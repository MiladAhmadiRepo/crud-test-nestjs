import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * CustomerEventModel
 *
 * In Event Sourcing, all events are stored in an event store.
 * This entity represents a single event in the event store.
 */
@Entity('customer_event_store')
export class CustomerEventModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  eventType: string;

  @Column({ type: 'json' })
  eventData: string;

  @Column()
  timestamp: Date;

  @Column()
  version: number;
}
