import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../../Orm/models/customer/customer.model';
import { CustomerController } from './presentation/customer.controller';
import { CustomerApplicationService } from './application/customer.application.service';
import { CustomerDomainService } from './domain/customer.service';
import { CustomerRepository } from './infrastructure/customer.repository';

// Define a token for the repository interface
export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';

/**
 * Customer Module for DDD Architecture
 * 
 * This module organizes the different layers of the DDD architecture:
 * - Domain Layer: Core business logic and entities
 * - Application Layer: Use cases and orchestration
 * - Infrastructure Layer: Technical implementations
 * - Presentation Layer: Controllers and DTOs
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity])
  ],
  controllers: [CustomerController],
  providers: [
    // Infrastructure layer - define repository first
    CustomerRepository,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository
    },
    
    // Domain layer - depends on repository
    {
      provide: CustomerDomainService,
      useFactory: (repository) => new CustomerDomainService(repository),
      inject: [CUSTOMER_REPOSITORY]
    },
    
    // Application layer - depends on domain service and repository
    {
      provide: CustomerApplicationService,
      useFactory: (domainService, repository) => new CustomerApplicationService(domainService, repository),
      inject: [CustomerDomainService, CUSTOMER_REPOSITORY]
    }
  ],
  exports: [CustomerApplicationService]
})
export class CustomerModule {}
