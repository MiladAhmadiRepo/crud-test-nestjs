import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DeleteCustomerCommand } from '../models/delete-customer.command';
import { CustomerEventStoreRepository } from '../../repositories/customer-event-store.repository';
import { CustomerDeletedEvent } from '../../events/models/customer-deleted.event';
import { CustomerEntity } from '../../../../Orm/models/customer/customer.model';
import { CustomerAggregate } from '../../models/customer.model';

/**
 * DeleteCustomerCommandHandler
 *
 * In CQRS, command handlers contain the logic to process commands.
 * This handler deletes an existing customer and publishes the related events.
 */
@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerCommandHandler implements ICommandHandler<DeleteCustomerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly eventStoreRepository: CustomerEventStoreRepository,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    try {
      // Find the customer in the database
      const customer = await this.customerRepository.findOneBy({ id: command.customerId });
      
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${command.customerId} not found`);
      }
      
      // Soft delete the customer in the database
      await this.customerRepository.softDelete(command.customerId);
      
      // Load the customer aggregate from the event store
      const aggregate = await this.eventStoreRepository.getCustomerAggregate(command.customerId);
      
      if (!aggregate) {
        // Create a new aggregate if it doesn't exist in the event store
        const newAggregate = this.publisher.mergeObjectContext(
          new CustomerAggregate(command.customerId)
        );
        
        // Apply the delete command
        newAggregate.deleteCustomer();
        
        // Get the current version
        const version = await this.eventStoreRepository.getCustomerVersion(command.customerId);
        
        // Save the event to the event store
        const event = newAggregate.getUncommittedEvents()[0] as CustomerDeletedEvent;
        await this.eventStoreRepository.saveEvent(command.customerId, event, version + 1);
        
        // Commit the events
        newAggregate.commit();
      } else {
        // Use the existing aggregate
        const customerAggregate = this.publisher.mergeObjectContext(aggregate);
        
        // Apply the delete command
        customerAggregate.deleteCustomer();
        
        // Get the current version
        const version = await this.eventStoreRepository.getCustomerVersion(command.customerId);
        
        // Save the event to the event store
        const event = customerAggregate.getUncommittedEvents()[0] as CustomerDeletedEvent;
        await this.eventStoreRepository.saveEvent(command.customerId, event, version + 1);
        
        // Commit the events
        customerAggregate.commit();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw error;
    }
  }
}
