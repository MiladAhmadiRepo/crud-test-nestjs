import { Customer } from '../entities/customer.entity';

/**
 * Token for CustomerRepository dependency injection
 */
export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

/**
 * Repository Interface for Customer Domain Entity
 * 
 * In Clean Architecture, this interface is defined by the use cases
 * and implemented by the adapters layer.
 */
export interface ICustomerRepository {
  /**
   * Find a customer by their unique identifier
   */
  findById(id: number): Promise<Customer | null>;

  /**
   * Save a new or existing customer
   */
  save(customer: Customer): Promise<Customer | null>;
  
  /**
   * Remove a customer from the system
   */
  remove(customerId: number): Promise<void>;
  
  /**
   * Check if a customer with the given email already exists
   */
  existsByEmail(email: string): Promise<boolean>;
}
