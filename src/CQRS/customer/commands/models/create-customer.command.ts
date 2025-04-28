/**
 * CreateCustomerCommand
 *
 * In CQRS, commands represent intentions to change the system state.
 * This command is used to create a new customer.
 */
export class CreateCustomerCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dateOfBirth: Date,
    public readonly phoneNumber?: string,
    public readonly email?: string,
    public readonly bankAccountNumber?: string
  ) {}
}
