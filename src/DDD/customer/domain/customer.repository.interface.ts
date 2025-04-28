import { Customer } from './customer.entity';

/**
 * Repository Interface for Customer Domain Entity
 * 
 * In DDD, the repository interface belongs to the domain layer and defines
 * how the domain interacts with persistence without specifying implementation details.
 */
export interface ICustomerRepository {

  findById(id: number): Promise<Customer | null>;

  save(customer: Customer): Promise<Customer | null>;

  remove(customer: Customer): Promise<void>;

  existsByEmail(email: string): Promise<boolean>;
}
