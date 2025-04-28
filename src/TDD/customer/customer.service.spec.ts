import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { NotFoundException } from '@nestjs/common';
import {CustomerEntity} from "../../Orm/models/customer/customer.model";

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

  it('should find all customers', async () => {
    const customers = [
      {
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1992-02-02',
        phoneNumber: '0987654321',
        email: 'jane@example.com',
        bankAccountNumber: '987654321',
      },
    ];

    mockRepository.find.mockResolvedValueOnce(customers);
    const result = await service.findAll();
    
    expect(result).toEqual(customers);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('should find one customer', async () => {
    const customer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      bankAccountNumber: '123456789',
    };

    mockRepository.findOne.mockResolvedValueOnce(customer);
    const result = await service.findOne(1);
    
    expect(result).toEqual(customer);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException when customer not found', async () => {
    mockRepository.findOne.mockResolvedValueOnce(null);
    
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update customer', async () => {
    const customer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      bankAccountNumber: '123456789',
    };

    const updateDto = {
      firstName: 'Jane',
      email: 'jane@example.com',
    };

    mockRepository.findOne.mockResolvedValueOnce(customer);
    mockRepository.save.mockResolvedValueOnce({ ...customer, ...updateDto });

    const result = await service.update(1, updateDto);

    expect(result).toEqual({ ...customer, ...updateDto });
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should remove customer', async () => {
    const customer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      bankAccountNumber: '123456789',
    };

    mockRepository.findOne.mockResolvedValueOnce(customer);
    
    await service.remove(1);
    
    expect(mockRepository.remove).toHaveBeenCalledWith(customer);
  });
});
