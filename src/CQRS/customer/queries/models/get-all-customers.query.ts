/**
 * GetAllCustomersQuery
 *
 * In CQRS, queries represent requests for information without changing state.
 * This query is used to retrieve all customers.
 */
export class GetAllCustomersQuery {
  constructor(
    public readonly includeDeleted: boolean = false
  ) {}
}
