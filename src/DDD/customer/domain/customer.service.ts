import { Customer } from './customer.entity';
import { ICustomerRepository } from './customer.repository.interface';

/**
 * Domain Service for Customer
 *
 * Contains core business logic that doesn't naturally fit within the Customer entity.
 * Domain services operate purely on domain objects and don't depend on application or infrastructure.
 */
export class CustomerDomainService {
    constructor(private readonly customerRepository: ICustomerRepository) {
    }

    /**
     * Register a new customer in the system
     * @throws Error if validation fails or customer already exists
     */
    async registerNewCustomer(
        firstName: string,
        lastName: string,
        dateOfBirth: Date,
        phoneNumber: string,
        email: string,
        bankAccountNumber: string
    ): Promise<Customer | null> {
        // Domain validation
        if (email && await this.customerRepository.existsByEmail(email)) {
            throw new Error('A customer with this email already exists');
        }

        // Create domain entity
        const customer = new Customer(
            null,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            email,
            bankAccountNumber,
            new Date()
        );

        // Persist through repository
        return this.customerRepository.save(customer);
    }

    /**
     * Update customer information
     * @throws Error if customer doesn't exist or validation fails
     */
    async updateCustomerInformation(
        customerId: number,
        firstName?: string,
        lastName?: string,
        dateOfBirth?: Date,
        phoneNumber?: string,
        email?: string,
        bankAccountNumber?: string
    ): Promise<Customer | null> {
        // Retrieve customer
        const customer = await this.customerRepository.findById(customerId);
        if (!customer) {
            throw new Error(`Customer with ID ${customerId} not found`);
        }

        // Check email uniqueness if being updated
        if (email && email !== customer.email && await this.customerRepository.existsByEmail(email)) {
            throw new Error('The email address is already used by another customer');
        }

        // Update customer information using domain methods
        if (firstName !== undefined || lastName !== undefined || dateOfBirth !== undefined) {
            customer.updatePersonalInformation(firstName, lastName, dateOfBirth);
        }

        if (phoneNumber !== undefined || email !== undefined) {
            customer.updateContactInformation(phoneNumber, email);
        }

        if (bankAccountNumber !== undefined) {
            customer.updateBankInformation(bankAccountNumber);
        }

        // Persist changes
        return this.customerRepository.save(customer);
    }

    /**
     * Remove a customer from the system
     * @throws Error if customer doesn't exist
     */
    async removeCustomer(customerId: number): Promise<void> {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer) {
            throw new Error(`Customer with ID ${customerId} not found`);
        }

        await this.customerRepository.remove(customer);
    }
}
