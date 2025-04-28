import { Inject } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../interfaces/customer-repository.interface';

/**
 * Input data for creating a customer
 */
export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber?: string;
  email?: string;
  bankAccountNumber?: string;
}

/**
 * Use Case: Create Customer
 * 
 * In Clean Architecture, use cases contain application-specific business rules.
 * They orchestrate the flow of data to and from the entities and implement
 * the business rules that are specific to the application itself.
 */
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository
  ) {}

  /**
   * Execute the use case
   */
  async execute(input: CreateCustomerInput): Promise<Customer | null> {
    // Check if customer with the same email already exists
    if (input.email && await this.customerRepository.existsByEmail(input.email)) {
      throw new Error(`Customer with email ${input.email} already exists`);
    }

    // Create a new customer entity
    const customer = new Customer(
      0, // ID will be assigned by the repository
      input.firstName,
      input.lastName,
      input.dateOfBirth,
      input.phoneNumber || '',
      input.email || '',
      input.bankAccountNumber || '',
    );

    // Save the customer
    return this.customerRepository.save(customer);
  }
}
