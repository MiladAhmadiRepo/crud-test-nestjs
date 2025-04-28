import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../../../Orm/models/customer/customer.model';
import { ICustomerRepository } from '../../core/interfaces/customer-repository.interface';
import { Customer } from '../../core/entities/customer.entity';

/**
 * TypeORM implementation of the Customer Repository
 * 
 * In Clean Architecture, this is part of the adapters layer that implements
 * the repository interface defined by the use cases.
 */
@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly ormRepository: Repository<CustomerEntity>,
  ) {}

  /**
   * Map ORM entity to domain entity
   */
  private toDomainEntity(ormEntity: CustomerEntity): Customer {
    // if (!ormEntity) return null;
    
    // Map ORM entity properties to domain entity constructor parameters
    // insertedAt maps to createdAt
    return new Customer(
      ormEntity.id,
      ormEntity.firstName,
      ormEntity.lastName,
      ormEntity.dateOfBirth,
      ormEntity.phoneNumber,
      ormEntity.email,
      ormEntity.bankAccountNumber,
      ormEntity.insertedAt as Date
    );
  }

  /**
   * Map domain entity to ORM entity
   */
  private toOrmEntity(domainEntity: Customer): Partial<CustomerEntity> {
    return {
      id: domainEntity.id || undefined,
      firstName: domainEntity.firstName,
      lastName: domainEntity.lastName,
      dateOfBirth: domainEntity.dateOfBirth,
      phoneNumber: domainEntity.phoneNumber,
      email: domainEntity.email,
      bankAccountNumber: domainEntity.bankAccountNumber,
      // No longer need to map updatedAt since modifiedAt was removed
    };
  }

  async findById(id: number): Promise<Customer | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findAll(): Promise<Customer[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map(entity => this.toDomainEntity(entity));
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const ormEntity = await this.ormRepository.findOneBy({ email });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async save(customer: Customer): Promise<Customer | null> {
    const ormEntity = this.toOrmEntity(customer);
    
    // For new entities without ID
    if (!ormEntity.id) {
      const newEntity = this.ormRepository.create(ormEntity);
      const savedEntity = await this.ormRepository.save(newEntity);
      return this.toDomainEntity(savedEntity);
    }
    
    // For existing entities
    await this.ormRepository.update(ormEntity.id, ormEntity);
    const updatedEntity = await this.ormRepository.findOneBy({ id: ormEntity.id });
    return updatedEntity? this.toDomainEntity(updatedEntity) : null;
  }

  async remove(customerId: number): Promise<void> {
    await this.ormRepository.delete(customerId);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.ormRepository.count({ where: { email } });
    return count > 0;
  }
}
