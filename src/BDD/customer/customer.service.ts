import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CustomerEntity } from '../../Orm/models/customer/customer.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

/**
 * Customer Service
 * Implements the business logic for customer management following BDD principles
 * Each method is named with a behavior-focused name that describes what it does
 * in domain language
 */
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  /**
   * Register a new customer in the system
   * @param customerData The customer information to register
   * @returns The newly created customer entity
   * @throws ConflictException when customer with same email already exists
   */
  async registerNewCustomer(customerData: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      // Convert string date to Date object
      const dateOfBirth = new Date(customerData.dateOfBirth);
      
      // Create a new customer entity
      const customer = this.customerRepository.create({
        ...customerData,
        dateOfBirth,
      });
      
      // Save the customer to the database
      return await this.customerRepository.save(customer);
    } catch (error) {
      // Handle specific database errors
      if (error instanceof QueryFailedError) {
        if (error.message.includes('email')) {
          throw new ConflictException('A customer with this email is already registered');
        }
      }
      throw error;
    }
  }

  /**
   * Retrieve all customers from the system
   * @returns List of all registered customers
   */
  async retrieveAllCustomers(): Promise<CustomerEntity[]> {
    return this.customerRepository.find();
  }

  /**
   * Find a specific customer by their ID
   * @param customerId The ID of the customer to find
   * @returns The customer entity if found
   * @throws NotFoundException when customer doesn't exist
   */
  async findCustomerById(customerId: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOneBy({ id: customerId });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} was not found in the system`);
    }
    
    return customer;
  }

  /**
   * Update customer information
   * @param customerId The ID of the customer to update
   * @param customerData The updated customer information
   * @returns The updated customer entity
   * @throws NotFoundException when customer doesn't exist
   * @throws ConflictException when update violates unique constraints
   */
  async updateCustomerInformation(customerId: number, customerData: UpdateCustomerDto): Promise<CustomerEntity> {
    try {
      // First check if the customer exists
      const existingCustomer = await this.findCustomerById(customerId);
      
      // Prepare data for update
      const updateData: any = { ...customerData };
      
      // Convert date string to Date object if provided
      if (customerData.dateOfBirth) {
        updateData.dateOfBirth = new Date(customerData.dateOfBirth);
      }
      
      // Update the customer entity
      Object.assign(existingCustomer, updateData);
      
      // Save the updated customer
      return await this.customerRepository.save(existingCustomer);
    } catch (error) {
      // If the error is a NotFoundException, just re-throw it
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      // Handle specific database errors
      if (error instanceof QueryFailedError) {
        if (error.message.includes('email')) {
          throw new ConflictException('The email address is already used by another customer');
        }
      }
      
      throw error;
    }
  }

  /**
   * Remove a customer from the system
   * @param customerId The ID of the customer to remove
   * @throws NotFoundException when customer doesn't exist
   */
  async removeCustomerFromSystem(customerId: number): Promise<void> {
    const customer = await this.findCustomerById(customerId);
    await this.customerRepository.remove(customer);
  }
}
