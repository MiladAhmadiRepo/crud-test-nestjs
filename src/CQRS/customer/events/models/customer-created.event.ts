/**
 * CustomerCreatedEvent
 *
 * In Event Sourcing, this event represents the creation of a new customer.
 * It contains all the initial data needed to reconstruct the customer state.
 */
export class CustomerCreatedEvent {
  constructor(
    public readonly customerId: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dateOfBirth: Date,
    public readonly phoneNumber: string | null,
    public readonly email: string | null,
    public readonly bankAccountNumber: string | null,
  ) {}
}
