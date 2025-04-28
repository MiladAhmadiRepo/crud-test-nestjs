/**
 * GetCustomerQuery
 *
 * In CQRS, queries represent requests for information without changing state.
 * This query is used to retrieve a specific customer by ID.
 */
export class GetCustomerQuery {
  constructor(
    public readonly customerId: number
  ) {}
}
