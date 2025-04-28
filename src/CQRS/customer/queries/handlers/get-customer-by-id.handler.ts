import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerByIdQuery } from '../models/get-customer-by-id.query';

/**
 * GetCustomerByIdQueryHandler
 *
 * In CQRS, query handlers contain the logic to process read operations.
 * This handler retrieves a customer by ID from the read model.
 */
@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdQueryHandler implements IQueryHandler<GetCustomerByIdQuery> {
  constructor() {}

  async execute(query: GetCustomerByIdQuery): Promise<any> {
    // Return a mock customer object instead of querying the read model
    console.log(`Get customer by ID query handled: ${query.customerId}`);
    
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
