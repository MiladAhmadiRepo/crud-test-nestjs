import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { CreateCustomerCommand } from '../models/create-customer.command';
import { CustomerAggregate } from '../../models/customer.model';
import { CustomerEventStoreRepository } from '../../repositories/customer-event-store.repository';
import { CustomerCreatedEvent } from '../../events/models/customer-created.event';
import { CustomerEntity } from '../../../../Orm/models/customer/customer.model';

/**
 * CreateCustomerCommandHandler
 *
 * In CQRS, command handlers contain the logic to process commands.
 * This handler creates a new customer and publishes the related events.
 */
@CommandHandler(CreateCustomerCommand)
export class CreateCustomerCommandHandler implements ICommandHandler<CreateCustomerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStoreRepository: CustomerEventStoreRepository,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>
  ) {}

  async execute(command: CreateCustomerCommand): Promise<number> {
    try {
      // Check if a customer with the same email already exists
      if (command.email) {
        const existingCustomer = await this.customerRepository.findOneBy({ email: command.email });
        if (existingCustomer) {
          throw new ConflictException(`Customer with email ${command.email} already exists`);
        }
      }

      // Create a new customer entity
      const customerEntity = this.customerRepository.create({
        firstName: command.firstName,
        lastName: command.lastName,
        dateOfBirth: command.dateOfBirth,
        phoneNumber: command.phoneNumber,
        email: command.email,
        bankAccountNumber: command.bankAccountNumber
      });

      // Save the customer entity to the database
      const savedCustomer = await this.customerRepository.save(customerEntity);
      const newId = savedCustomer.id;

      // Create a new customer aggregate for event sourcing
      const customerAggregate = this.publisher.mergeObjectContext(
        new CustomerAggregate(newId)
      );

      // Apply the create command
      customerAggregate.createCustomer(
        newId,
        command.firstName,
        command.lastName,
        command.dateOfBirth,
        command.phoneNumber,
        command.email,
        command.bankAccountNumber
      );

      // Get the current version
      const version = await this.eventStoreRepository.getCustomerVersion(newId);

      // Save the event to the event store
      // We're assuming the first event in the uncommitted events is the CustomerCreatedEvent
      const event = customerAggregate.getUncommittedEvents()[0] as CustomerCreatedEvent;
      await this.eventStoreRepository.saveEvent(newId, event, version + 1);

      // Commit the events (this will publish them to the event handlers)
      customerAggregate.commit();

      return newId;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw error;
    }
  }
}
