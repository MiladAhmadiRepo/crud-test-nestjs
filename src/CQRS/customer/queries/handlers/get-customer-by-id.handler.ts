import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CustomerEntity } from '../../../../Orm/models/customer/customer.model';
import { GetCustomerByIdQuery } from '../models/get-customer-by-id.query';

/**
 * GetCustomerByIdQueryHandler
 *
 * In CQRS, query handlers contain the logic to process read operations.
 * This handler retrieves a customer by ID from the read model.
 */
@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdQueryHandler implements IQueryHandler<GetCustomerByIdQuery> {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>
  ) {}

  async execute(query: GetCustomerByIdQuery): Promise<CustomerEntity> {
    console.log(`Get customer by ID query handled: ${query.customerId}`);
    
    // Fetch the customer from the database
    const customer = await this.customerRepository.findOneBy({ id: query.customerId });
    
    // Throw NotFoundException if customer not found
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${query.customerId} not found`);
    }
    
    return customer;
  }
}
