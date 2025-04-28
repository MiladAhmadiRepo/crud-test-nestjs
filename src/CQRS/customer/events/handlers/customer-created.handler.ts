import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerCreatedEvent } from '../models/customer-created.event';

/**
 * CustomerCreatedEventHandler
 *
 * This handler is responsible for updating the read model when a customer is created.
 * It subscribes to CustomerCreatedEvent and creates a new record in the read database.
 */
@EventsHandler(CustomerCreatedEvent)
export class CustomerCreatedEventHandler implements IEventHandler<CustomerCreatedEvent> {
  constructor() {}

  async handle(event: CustomerCreatedEvent): Promise<void> {
    // Log the event instead of saving to read model
    console.log(`Customer created event handled: ${event.customerId}`);
  }
}
