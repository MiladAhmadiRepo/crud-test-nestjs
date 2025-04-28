import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerUpdatedEvent } from '../models/customer-updated.event';

/**
 * CustomerUpdatedEventHandler
 *
 * This handler is responsible for updating the read model when a customer is updated.
 * It subscribes to CustomerUpdatedEvent and updates the corresponding record in the read database.
 */
@EventsHandler(CustomerUpdatedEvent)
export class CustomerUpdatedEventHandler implements IEventHandler<CustomerUpdatedEvent> {
  constructor() {}

  async handle(event: CustomerUpdatedEvent): Promise<void> {
    // Log the event instead of updating read model
    console.log(`Customer updated event handled: ${event.customerId}`);
  }
}
