/**
 * DeleteCustomerCommand
 *
 * In CQRS, commands represent intentions to change the system state.
 * This command is used to delete an existing customer.
 */
export class DeleteCustomerCommand {
  constructor(
    public readonly customerId: number
  ) {}
}
