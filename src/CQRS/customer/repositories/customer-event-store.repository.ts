import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEventModel } from './customer-event.model';
import { CustomerAggregate } from '../models/customer.model';
import { CustomerCreatedEvent } from '../events/models/customer-created.event';
import { CustomerUpdatedEvent } from '../events/models/customer-updated.event';
import { CustomerDeletedEvent } from '../events/models/customer-deleted.event';

/**
 * CustomerEventStoreRepository
 *
 * This repository is responsible for storing and retrieving events from the event store.
 * It also handles reconstructing aggregates from the event history.
 */
@Injectable()
export class CustomerEventStoreRepository {
  constructor(
    @InjectRepository(CustomerEventModel)
    private readonly eventRepository: Repository<CustomerEventModel>,
  ) {}

  /**
   * Save an event to the event store
   */
  async saveEvent(
    customerId: number,
    event: CustomerCreatedEvent | CustomerUpdatedEvent | CustomerDeletedEvent,
    version: number
  ): Promise<void> {
    const eventModel = new CustomerEventModel();
    eventModel.customerId = customerId;
    eventModel.eventType = event.constructor.name;
    eventModel.eventData = JSON.stringify(event);
    eventModel.timestamp = new Date();
    eventModel.version = version;

    await this.eventRepository.save(eventModel);
  }

  /**
   * Get the current version for a customer
   */
  async getCustomerVersion(customerId: number): Promise<number> {
    const latestEvent = await this.eventRepository.findOne({
      where: { customerId },
      order: { version: 'DESC' }
    });

    return latestEvent ? latestEvent.version : 0;
  }

  /**
   * Load a customer aggregate by replaying all its events
   */
  async getCustomerAggregate(customerId: number): Promise<CustomerAggregate | null> {
    // Get all events for this customer, ordered by version
    const events = await this.eventRepository.find({
      where: { customerId },
      order: { version: 'ASC' }
    });

    if (events.length === 0) {
      return null;
    }

    // Create a new aggregate
    const aggregate = new CustomerAggregate(customerId);

    // Replay all events to reconstruct the aggregate state
    for (const eventModel of events) {
      const eventData = JSON.parse(eventModel.eventData);

      switch (eventModel.eventType) {
        case 'CustomerCreatedEvent':
          const createdEvent = new CustomerCreatedEvent(
            eventData.customerId,
            eventData.firstName,
            eventData.lastName,
            new Date(eventData.dateOfBirth),
            eventData.phoneNumber,
            eventData.email,
            eventData.bankAccountNumber,
            new Date(eventData.createdAt)
          );
          aggregate.onCustomerCreatedEvent(createdEvent);
          break;

        case 'CustomerUpdatedEvent':
          const updatedEvent = new CustomerUpdatedEvent(
            eventData.customerId,
            eventData.firstName,
            eventData.lastName,
            eventData.dateOfBirth ? new Date(eventData.dateOfBirth) : undefined,
            eventData.phoneNumber,
            eventData.email,
            eventData.bankAccountNumber,
            new Date(eventData.updatedAt)
          );
          aggregate.onCustomerUpdatedEvent(updatedEvent);
          break;

        case 'CustomerDeletedEvent':
          const deletedEvent = new CustomerDeletedEvent(
            eventData.customerId
          );
          aggregate.onCustomerDeletedEvent(deletedEvent);
          break;
      }
    }

    return aggregate;
  }
}
