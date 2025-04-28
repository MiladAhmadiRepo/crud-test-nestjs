import { Injectable, Inject } from '@nestjs/common';
import { CustomerDomainService } from '../domain/customer.service';
import { Customer } from '../domain/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerNotFoundException } from '../domain/exceptions/customer-not-found.exception';
import { CustomerAlreadyExistsException } from '../domain/exceptions/customer-already-exists.exception';
import { ICustomerRepository } from '../domain/customer.repository.interface';
import { CUSTOMER_REPOSITORY } from '../customer.module';

/**
 * Application Service for Customer
 * 
 * Implements use cases by coordinating domain objects and services.
 * Translates between the domain and the outside world (DTOs, exceptions).
 */
@Injectable()
export class CustomerApplicationService {
  constructor(
    private readonly customerDomainService: CustomerDomainService,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository
  ) {}

  /**
   * Register a new customer
   */
  async registerCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      return await this.customerDomainService.registerNewCustomer(
        createCustomerDto.firstName,
        createCustomerDto.lastName,
        new Date(createCustomerDto.dateOfBirth),
        createCustomerDto.phoneNumber,
        createCustomerDto.email,
        createCustomerDto.bankAccountNumber
      );
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new CustomerAlreadyExistsException(error.message);
      }
      throw error;
    }
  }

  /**
   * Find all customers
   */
  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  /**
   * Find a customer by ID
   */
  async findCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }

  /**
   * Update customer information
   */
  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    try {
      return await this.customerDomainService.updateCustomerInformation(
        id,
        updateCustomerDto.firstName,
        updateCustomerDto.lastName,
        updateCustomerDto.dateOfBirth ? new Date(updateCustomerDto.dateOfBirth) : undefined,
        updateCustomerDto.phoneNumber,
        updateCustomerDto.email,
        updateCustomerDto.bankAccountNumber
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new CustomerNotFoundException(id);
      }
      if (error.message.includes('already used')) {
        throw new CustomerAlreadyExistsException(error.message);
      }
      throw error;
    }
  }

  /**
   * Remove a customer
   */
  async removeCustomer(id: number): Promise<void> {
    try {
      await this.customerDomainService.removeCustomer(id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new CustomerNotFoundException(id);
      }
      throw error;
    }
  }
}
