import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { CustomerEntity } from '../../Orm/models/customer/customer.model';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

/**
 * BDD-style tests for CustomerService
 * Using Given-When-Then structure to clearly define behaviors
 */
describe('Customer Management', () => {
  let service: CustomerService;
  let repository: Repository<CustomerEntity>;

  // Mock repository for testing
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
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
    
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('Given a new customer needs to be registered', () => {
    const createCustomerDto: CreateCustomerDto = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      bankAccountNumber: '123456789',
    };

    const savedCustomer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      bankAccountNumber: '123456789',
      insertedAt: new Date(),
      deletedAt: null,
    };

    it('When valid customer data is provided, Then the customer should be successfully registered', async () => {
      // Arrange
      mockRepository.create.mockReturnValue(savedCustomer);
      mockRepository.save.mockResolvedValue(savedCustomer);

      // Act
      const result = await service.registerNewCustomer(createCustomerDto);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCustomerDto,
        dateOfBirth: new Date(createCustomerDto.dateOfBirth),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(savedCustomer);
      expect(result).toEqual(savedCustomer);
    });

    it('When a customer with the same email already exists, Then a ConflictException should be thrown', async () => {
      // Arrange
      const error = new Error('email duplicate key value violates unique constraint');
      error.name = 'QueryFailedError';
      mockRepository.create.mockReturnValue(savedCustomer);
      mockRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(service.registerNewCustomer(createCustomerDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('Given customers exist in the system', () => {
    const customers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        phoneNumber: '1234567890',
        email: 'john.doe@example.com',
        bankAccountNumber: '123456789',
        insertedAt: new Date(),
        modifiedAt: null,
        modifiedBy: null,
        lockedAt: null,
        lockedBy: null,
        deletedAt: null,
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1992-05-15'),
        phoneNumber: '9876543210',
        email: 'jane.smith@example.com',
        bankAccountNumber: '987654321',
        insertedAt: new Date(),
        modifiedAt: null,
        modifiedBy: null,
        lockedAt: null,
        lockedBy: null,
        deletedAt: null,
      },
    ];

    it('When retrieving all customers, Then all registered customers should be returned', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(customers);

      // Act
      const result = await service.retrieveAllCustomers();

      // Assert
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(customers);
      expect(result.length).toBe(2);
    });

    it('When finding a customer by ID that exists, Then the customer should be returned', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(customers[0]);

      // Act
      const result = await service.findCustomerById(1);

      // Assert
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(customers[0]);
    });

    it('When finding a customer by ID that does not exist, Then a NotFoundException should be thrown', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findCustomerById(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('Given a customer needs to be updated', () => {
    const existingCustomer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      bankAccountNumber: '123456789',
      insertedAt: new Date(),
      deletedAt: null,
    };

    const updateCustomerDto: UpdateCustomerDto = {
      firstName: 'Johnny',
      email: 'johnny.doe@example.com',
    };

    const updatedCustomer = {
      ...existingCustomer,
      firstName: 'Johnny',
      email: 'johnny.doe@example.com',
    };

    it('When updating a customer that exists, Then the customer information should be updated', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(existingCustomer);
      mockRepository.save.mockResolvedValue(updatedCustomer);

      // Act
      const result = await service.updateCustomerInformation(1, updateCustomerDto);

      // Assert
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedCustomer);
    });

    it('When updating a customer that does not exist, Then a NotFoundException should be thrown', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateCustomerInformation(999, updateCustomerDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('When updating a customer with an email that already exists, Then a ConflictException should be thrown', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(existingCustomer);
      const error = new Error('email duplicate key value violates unique constraint');
      error.name = 'QueryFailedError';
      mockRepository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(service.updateCustomerInformation(1, updateCustomerDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('Given a customer needs to be removed from the system', () => {
    const existingCustomer = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      bankAccountNumber: '123456789',
      insertedAt: new Date(),
      deletedAt: null,
    };

    it('When removing a customer that exists, Then the customer should be successfully removed', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(existingCustomer);
      mockRepository.remove.mockResolvedValue(undefined);

      // Act
      await service.removeCustomerFromSystem(1);

      // Assert
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(existingCustomer);
    });

    it('When removing a customer that does not exist, Then a NotFoundException should be thrown', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.removeCustomerFromSystem(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
