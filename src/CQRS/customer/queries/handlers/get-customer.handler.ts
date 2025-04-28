import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CustomerEntity } from '../../../../Orm/models/customer/customer.model';
import { GetCustomerQuery } from '../models/get-customer.query';

/**
 * GetCustomerQueryHandler
 *
 * In CQRS, query handlers retrieve data from the read model.
 * This handler retrieves a specific customer by ID.
 */
@QueryHandler(GetCustomerQuery)
export class GetCustomerQueryHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>
  ) {}

  async execute(query: GetCustomerQuery): Promise<CustomerEntity> {
    console.log(`Get customer query handled: ${query.customerId}`);
    
    // Fetch the customer from the database
    const customer = await this.customerRepository.findOneBy({ id: query.customerId });
    
    // Throw NotFoundException if customer not found
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${query.customerId} not found`);
    }
    
    return customer;
  }
}
