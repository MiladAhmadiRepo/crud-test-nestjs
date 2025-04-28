/**
 * CustomerDeletedEvent
 *
 * In Event Sourcing, this event represents the deletion of a customer.
 * It contains only the customer ID as that's all that's needed to mark it as deleted.
 */
export class CustomerDeletedEvent {
  constructor(
    public readonly customerId: number
  ) {}
}
