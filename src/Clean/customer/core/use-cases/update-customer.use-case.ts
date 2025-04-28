import { Inject } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { ICustomerRepository, CUSTOMER_REPOSITORY } from '../interfaces/customer-repository.interface';

/**
 * Input data for updating a customer
 */
export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  bankAccountNumber?: string;
}

/**
 * Use Case: Update Customer
 * 
 * In Clean Architecture, use cases contain application-specific business rules.
 * This use case handles updating an existing customer's information.
 */
export class UpdateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository
  ) {}

  /**
   * Execute the use case
   */
  async execute(id: number, input: UpdateCustomerInput): Promise<Customer | null> {
    // Find the existing customer
    const existingCustomer = await this.customerRepository.findById(id);
    
    if (!existingCustomer) {
      throw new Error(`Customer with ID ${id} not found`);
    }

    // Check if email is being updated and already exists for another customer
    if (input.email && 
        input.email !== existingCustomer.email && 
        await this.customerRepository.existsByEmail(input.email)) {
      throw new Error(`Email ${input.email} is already used by another customer`);
    }

    // Update personal information if provided
    if (input.firstName !== undefined || input.lastName !== undefined || input.dateOfBirth !== undefined) {
      existingCustomer.updatePersonalInformation(
        input.firstName,
        input.lastName,
        input.dateOfBirth
      );
    }

    // Update contact information if provided
    if (input.phoneNumber !== undefined || input.email !== undefined) {
      existingCustomer.updateContactInformation(
        input.phoneNumber,
        input.email
      );
    }

    // Update bank information if provided
    if (input.bankAccountNumber !== undefined) {
      existingCustomer.updateBankInformation(
        input.bankAccountNumber
      );
    }

    // Save the updated customer
    return this.customerRepository.save(existingCustomer);
  }
}
