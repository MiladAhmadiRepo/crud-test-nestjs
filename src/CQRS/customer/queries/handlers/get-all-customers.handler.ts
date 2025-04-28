import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCustomersQuery } from '../models/get-all-customers.query';

/**
 * GetAllCustomersQueryHandler
 *
 * In CQRS, query handlers contain the logic to process read operations.
 * This handler retrieves all customers from the read model.
 */
@QueryHandler(GetAllCustomersQuery)
export class GetAllCustomersQueryHandler implements IQueryHandler<GetAllCustomersQuery> {
  constructor() {}

  async execute(): Promise<any[]> {
    // Return mock customer objects instead of querying the read model
    console.log('Get all customers query handled');
    
    // If you need to return actual data, you would need to implement
    // a different storage mechanism or fetch from event store
    return [
      {
        id: 1,
        firstName: 'Mock',
        lastName: 'Customer1',
        dateOfBirth: new Date('1990-01-01'),
        phoneNumber: '1234567890',
        email: 'mock1@example.com',
        bankAccountNumber: '123456789',
        isDeleted: false
      },
      {
        id: 2,
        firstName: 'Mock',
        lastName: 'Customer2',
        dateOfBirth: new Date('1992-02-02'),
        phoneNumber: '0987654321',
        email: 'mock2@example.com',
        bankAccountNumber: '987654321',
        isDeleted: false
      }
    ];
  }
}
