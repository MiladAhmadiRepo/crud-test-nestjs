import { Inject } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../interfaces/customer-repository.interface';

/**
 * Use Case: Get Customer by ID
 * 
 * In Clean Architecture, use cases contain application-specific business rules.
 * This use case handles retrieving a specific customer by their ID.
 */
export class GetCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository
  ) {}

  /**
   * Execute the use case
   */
  async execute(id: number): Promise<Customer | null> {
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    
    return customer;
  }
}
