import { Inject } from '@nestjs/common';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../interfaces/customer-repository.interface';

/**
 * Use Case: Delete Customer
 * 
 * In Clean Architecture, use cases contain application-specific business rules.
 * This use case handles removing a customer from the system.
 */
export class DeleteCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository
  ) {}

  /**
   * Execute the use case
   */
  async execute(id: number): Promise<void> {
    // Check if customer exists
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    
    // Remove the customer
    await this.customerRepository.remove(id);
  }
}
