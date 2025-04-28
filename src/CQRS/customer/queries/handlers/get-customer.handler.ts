import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerQuery } from '../models/get-customer.query';

/**
 * GetCustomerQueryHandler
 *
 * In CQRS, query handlers retrieve data from the read model.
 * This handler retrieves a specific customer by ID.
 */
@QueryHandler(GetCustomerQuery)
export class GetCustomerQueryHandler implements IQueryHandler<GetCustomerQuery> {
  constructor() {}

  async execute(query: GetCustomerQuery): Promise<any> {
    // Return a mock customer object instead of querying the read model
    console.log(`Get customer query handled: ${query.customerId}`);
    
    // If you need to return actual data, you would need to implement
    // a different storage mechanism or fetch from event store
    return {
      id: query.customerId,
      firstName: 'Mock',
      lastName: 'Customer',
      dateOfBirth: new Date('1990-01-01'),
      phoneNumber: '1234567890',
      email: 'mock@example.com',
      bankAccountNumber: '123456789',
      isDeleted: false
    };
  }
}
