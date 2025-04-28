import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from '../models/create-customer.command';
import { CustomerAggregate } from '../../models/customer.model';
import { CustomerEventStoreRepository } from '../../repositories/customer-event-store.repository';
import { CustomerCreatedEvent } from '../../events/models/customer-created.event';

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
  ) {}

  async execute(command: CreateCustomerCommand): Promise<number> {
    // Generate a new ID using a timestamp-based approach
    const newId = Math.floor(Date.now() / 1000);

    // Create a new customer aggregate
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
  }
}
