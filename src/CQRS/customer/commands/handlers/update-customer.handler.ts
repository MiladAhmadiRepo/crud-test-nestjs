import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateCustomerCommand } from '../models/update-customer.command';
import { CustomerEventStoreRepository } from '../../repositories/customer-event-store.repository';
import { CustomerUpdatedEvent } from '../../events/models/customer-updated.event';
import { CustomerEntity } from '../../../../Orm/models/customer/customer.model';
import { CustomerAggregate } from '../../models/customer.model';

/**
 * UpdateCustomerCommandHandler
 *
 * In CQRS, command handlers contain the logic to process commands.
 * This handler updates an existing customer and publishes the related events.
 */
@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerCommandHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStoreRepository: CustomerEventStoreRepository,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    try {
      // Find the customer in the database
      const customer = await this.customerRepository.findOneBy({ id: command.customerId });
      
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${command.customerId} not found`);
      }
      
      // Check email uniqueness if email is being updated
      if (command.email && command.email !== customer.email) {
        const existingCustomer = await this.customerRepository.findOneBy({ email: command.email });
        if (existingCustomer) {
          throw new ConflictException(`Customer with email ${command.email} already exists`);
        }
      }
      
      // Update customer properties
      if (command.firstName !== undefined) customer.firstName = command.firstName;
      if (command.lastName !== undefined) customer.lastName = command.lastName;
      if (command.dateOfBirth !== undefined) customer.dateOfBirth = command.dateOfBirth;
      if (command.phoneNumber !== undefined) customer.phoneNumber = command.phoneNumber;
      if (command.email !== undefined) customer.email = command.email;
      if (command.bankAccountNumber !== undefined) customer.bankAccountNumber = command.bankAccountNumber;
      
      // Save the updated customer to the database
      await this.customerRepository.save(customer);
      
      // Load the customer aggregate from the event store
      const aggregate = await this.eventStoreRepository.getCustomerAggregate(command.customerId);
      
      if (!aggregate) {
        // Create a new aggregate if it doesn't exist in the event store
        const newAggregate = this.publisher.mergeObjectContext(
          new CustomerAggregate(command.customerId)
        );
        
        // Apply the update command
        newAggregate.updateCustomer(
          command.firstName,
          command.lastName,
          command.dateOfBirth,
          command.phoneNumber,
          command.email,
          command.bankAccountNumber
        );
        
        // Get the current version
        const version = await this.eventStoreRepository.getCustomerVersion(command.customerId);
        
        // Save the event to the event store
        const event = newAggregate.getUncommittedEvents()[0] as CustomerUpdatedEvent;
        await this.eventStoreRepository.saveEvent(command.customerId, event, version + 1);
        
        // Commit the events
        newAggregate.commit();
      } else {
        // Use the existing aggregate
        const customerAggregate = this.publisher.mergeObjectContext(aggregate);
        
        // Apply the update command
        customerAggregate.updateCustomer(
          command.firstName,
          command.lastName,
          command.dateOfBirth,
          command.phoneNumber,
          command.email,
          command.bankAccountNumber
        );
        
        // Get the current version
        const version = await this.eventStoreRepository.getCustomerVersion(command.customerId);
        
        // Save the event to the event store
        const event = customerAggregate.getUncommittedEvents()[0] as CustomerUpdatedEvent;
        await this.eventStoreRepository.saveEvent(command.customerId, event, version + 1);
        
        // Commit the events
        customerAggregate.commit();
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }
}
