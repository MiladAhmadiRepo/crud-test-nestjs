/**
 * CustomerUpdatedEvent
 *
 * In Event Sourcing, this event represents an update to an existing customer.
 * It contains only the fields that were updated, with undefined for unchanged fields.
 */
export class CustomerUpdatedEvent {
  constructor(
    public readonly customerId: number,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly dateOfBirth?: Date,
    public readonly phoneNumber?: string,
    public readonly email?: string,
    public readonly bankAccountNumber?: string,
    public readonly updatedAt: Date = new Date()
  ) {}
}
