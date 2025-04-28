/**
 * Query for retrieving a customer by ID
 */
export class GetCustomerByIdQuery {
  constructor(public readonly customerId: number) {}
}
