import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {CustomerEntity} from "../../Orm/models/customer/customer.model";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('email')) {
          throw new ConflictException('Email already exists');
        } else if (error.message.includes('firstName_lastName_dateOfBirth')) {
          throw new ConflictException('Customer with this name and date of birth already exists');
        }
      }
      throw error;
    }
  }

  findAll(): Promise<CustomerEntity[]> {
    return this.customerRepository.find();
  }

  async findOne(id: number): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerEntity|null> {
    try {
      const result = await this.customerRepository.update(id, updateCustomerDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return await this.customerRepository.findOneBy({ id });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('email')) {
          throw new ConflictException('Email already exists');
        } else if (error.message.includes('firstName_lastName_dateOfBirth')) {
          throw new ConflictException('Customer with this name and date of birth already exists');
        }
      }
      throw error;
    }

  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}
