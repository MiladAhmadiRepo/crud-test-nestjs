import { Customer } from './customer.entity';

/**
 * Repository Interface for Customer Domain Entity
 * 
 * In DDD, the repository interface belongs to the domain layer and defines
 * how the domain interacts with persistence without specifying implementation details.
 */
export interface ICustomerRepository {
  /**
   * Find a customer by their unique identifier
   */
  findById(id: number): Promise<Customer | null>;
  
  /**
   * Find all customers
   */
  findAll(): Promise<Customer[]>;
  
  /**
   * Find a customer by their email address
   */
  findByEmail(email: string): Promise<Customer | null>;
  
  /**
   * Save a new or existing customer
   */
  save(customer: Customer): Promise<Customer>;
  
  /**
   * Remove a customer from the system
   */
  remove(customer: Customer): Promise<void>;
  
  /**
   * Check if a customer with the given email already exists
   */
  existsByEmail(email: string): Promise<boolean>;
}
