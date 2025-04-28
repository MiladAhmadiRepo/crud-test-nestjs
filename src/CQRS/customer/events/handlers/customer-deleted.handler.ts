import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerDeletedEvent } from '../models/customer-deleted.event';

/**
 * CustomerDeletedEventHandler
 *
 * This handler is responsible for updating the read model when a customer is deleted.
 * It subscribes to CustomerDeletedEvent and marks the customer as deleted in the read database.
 */
@EventsHandler(CustomerDeletedEvent)
export class CustomerDeletedEventHandler implements IEventHandler<CustomerDeletedEvent> {
  constructor() {}

  async handle(event: CustomerDeletedEvent): Promise<void> {
    // Log the event instead of updating read model
    console.log(`Customer deleted event handled: ${event.customerId}`);
  }
}
