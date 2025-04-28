import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomerCommand } from '../models/delete-customer.command';
import { CustomerEventStoreRepository } from '../../repositories/customer-event-store.repository';
import { CustomerDeletedEvent } from '../../events/models/customer-deleted.event';

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
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {

    // Load the customer aggregate from the event store
    const aggregate = await this.eventStoreRepository.getCustomerAggregate(command.customerId);
    
    if (!aggregate) {
      throw new Error(`Customer with ID ${command.customerId} not found in event store`);
    }
    
    // Now we can safely merge the context since we know aggregate is not null
    const customerAggregate = this.publisher.mergeObjectContext(aggregate);

    // Apply the delete command
    customerAggregate.deleteCustomer();

    // Get the current version
    const version = await this.eventStoreRepository.getCustomerVersion(command.customerId);

    // Save the event to the event store
    // We're assuming the first event in the uncommitted events is the CustomerDeletedEvent
    const event = customerAggregate.getUncommittedEvents()[0] as CustomerDeletedEvent;
    await this.eventStoreRepository.saveEvent(command.customerId, event, version + 1);

    // Commit the events (this will publish them to the event handlers)
    customerAggregate.commit();
  }
}
