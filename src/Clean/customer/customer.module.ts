import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../../Orm/models/customer/customer.model';
import { CustomerController } from './adapters/controllers/customer.controller';
import { CustomerRepository } from './adapters/repositories/customer.repository';
import { CreateCustomerUseCase } from './core/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from './core/use-cases/get-customer.use-case';
import { GetAllCustomersUseCase } from './core/use-cases/get-all-customers.use-case';
import { UpdateCustomerUseCase } from './core/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from './core/use-cases/delete-customer.use-case';
import { CUSTOMER_REPOSITORY } from './core/interfaces/customer-repository.interface';

/**
 * Customer Module for Clean Architecture
 * 
 * This module organizes the different layers of the Clean Architecture:
 * - Core: Entities and Use Cases (business rules)
 * - Adapters: Controllers, Presenters, and Repository implementations
 * - Frameworks: External frameworks and tools (NestJS, TypeORM)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity])
  ],
  controllers: [CustomerController],
  providers: [
    // Repository
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository
    },
    CustomerRepository,
    
    // Use Cases
    {
      provide: CreateCustomerUseCase,
      useFactory: (repository) => {
        return new CreateCustomerUseCase(repository);
      },
      inject: [CUSTOMER_REPOSITORY]
    },
    {
      provide: GetCustomerUseCase,
      useFactory: (repository) => {
        return new GetCustomerUseCase(repository);
      },
      inject: [CUSTOMER_REPOSITORY]
    },
    {
      provide: GetAllCustomersUseCase,
      useFactory: (repository) => {
        return new GetAllCustomersUseCase(repository);
      },
      inject: [CUSTOMER_REPOSITORY]
    },
    {
      provide: UpdateCustomerUseCase,
      useFactory: (repository) => {
        return new UpdateCustomerUseCase(repository);
      },
      inject: [CUSTOMER_REPOSITORY]
    },
    {
      provide: DeleteCustomerUseCase,
      useFactory: (repository) => {
        return new DeleteCustomerUseCase(repository);
      },
      inject: [CUSTOMER_REPOSITORY]
    }
  ],
  exports: [
    CreateCustomerUseCase,
    GetCustomerUseCase,
    GetAllCustomersUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase
  ]
})
export class CustomerModule {}
