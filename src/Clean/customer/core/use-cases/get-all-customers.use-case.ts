import { Inject } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../interfaces/customer-repository.interface';

/**
 * Use Case: Get All Customers
 * 
 * In Clean Architecture, use cases contain application-specific business rules.
 * This use case handles retrieving all customers from the system.
 */
export class GetAllCustomersUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository
  ) {}

  /**
   * Execute the use case
   */
  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}
