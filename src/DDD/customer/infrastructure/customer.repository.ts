import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../../Orm/models/customer/customer.model';
import { ICustomerRepository } from '../domain/customer.repository.interface';
import { Customer } from '../domain/customer.entity';

/**
 * TypeORM implementation of the Customer Repository
 * 
 * This is part of the infrastructure layer in DDD.
 * It translates between domain entities and ORM entities.
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

    return new Customer(
      ormEntity.id,
      ormEntity.firstName,
      ormEntity.lastName,
      ormEntity.dateOfBirth,
      ormEntity.phoneNumber,
      ormEntity.email,
      ormEntity.bankAccountNumber,
      ormEntity.insertedAt,
      ormEntity.modifiedAt
    );
  }

  /**
   * Map domain entity to ORM entity
   */
  private toOrmEntity(domainEntity: Customer): Partial<CustomerEntity> {
    return {
      id: domainEntity.id  ,
      firstName: domainEntity.firstName,
      lastName: domainEntity.lastName,
      dateOfBirth: domainEntity.dateOfBirth,
      phoneNumber: domainEntity.phoneNumber,
      email: domainEntity.email,
      bankAccountNumber: domainEntity.bankAccountNumber,
      modifiedAt: domainEntity.updatedAt
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

  async save(customer: Customer): Promise<Customer> {
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
    return this.toDomainEntity(updatedEntity);
  }

  async remove(customer: Customer): Promise<void> {
    await this.ormRepository.delete(customer.id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.ormRepository.count({ where: { email } });
    return count > 0;
  }
}
