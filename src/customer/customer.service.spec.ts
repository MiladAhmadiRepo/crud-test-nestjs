import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { NotFoundException } from '@nestjs/common';
import {CustomerEntity} from "../orm/models/customer/customer.model";

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<CustomerEntity>;

  const mockRepository = {
    create: jest.fn().mockImplementation(dto => ({ id: Date.now(), ...dto })),
    save: jest.fn().mockImplementation(customer => Promise.resolve(customer)),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(CustomerEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<CustomerEntity>>(getRepositoryToken(CustomerEntity));
  });

  it('should create a customer', async () => {
    const customerDto = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      bankAccountNumber: '123456789',
    };

    const customer = await service.create(customerDto);

    expect(customer).toHaveProperty('id');
    expect(customer.firstName).toBe('John');
    expect(mockRepository.create).toHaveBeenCalledWith(customerDto);
    expect(mockRepository.save).toHaveBeenCalled();
  });


});
