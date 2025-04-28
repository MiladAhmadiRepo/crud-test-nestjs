/**
 * UpdateCustomerCommand
 *
 * In CQRS, commands represent intentions to change the system state.
 * This command is used to update an existing customer.
 */
export class UpdateCustomerCommand {
  constructor(
    public readonly customerId: number,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly dateOfBirth?: Date,
    public readonly phoneNumber?: string,
    public readonly email?: string,
    public readonly bankAccountNumber?: string
  ) {}
}
