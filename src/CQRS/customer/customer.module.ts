import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { CustomerController } from './controllers/customer.controller';

// Command Handlers
import { CreateCustomerCommandHandler } from './commands/handlers/create-customer.handler';
import { UpdateCustomerCommandHandler } from './commands/handlers/update-customer.handler';
import { DeleteCustomerCommandHandler } from './commands/handlers/delete-customer.handler';

// Query Handlers
import { GetCustomerByIdQueryHandler } from './queries/handlers/get-customer-by-id.handler';
import { GetAllCustomersQueryHandler } from './queries/handlers/get-all-customers.handler';
import { GetCustomerQueryHandler } from './queries/handlers/get-customer.handler';

// Event Handlers
import { CustomerCreatedEventHandler } from './events/handlers/customer-created.handler';
import { CustomerUpdatedEventHandler } from './events/handlers/customer-updated.handler';
import { CustomerDeletedEventHandler } from './events/handlers/customer-deleted.handler';

// Repositories
import { CustomerEventStoreRepository } from './repositories/customer-event-store.repository';
import { CustomerEventModel } from './repositories/customer-event.model';

// Command handlers
const CommandHandlers = [
  CreateCustomerCommandHandler,
  UpdateCustomerCommandHandler,
  DeleteCustomerCommandHandler,
];

// Query handlers
const QueryHandlers = [
  GetCustomerByIdQueryHandler,
  GetAllCustomersQueryHandler,
  GetCustomerQueryHandler,
];

// Event handlers
const EventHandlers = [
  CustomerCreatedEventHandler,
  CustomerUpdatedEventHandler,
  CustomerDeletedEventHandler,
];

/**
 * Customer Module for CQRS Architecture
 * 
 * This module organizes the different components of the CQRS pattern:
 * - Commands: Write operations that change state
 * - Queries: Read operations that retrieve data
 * - Events: Notifications of state changes
 */
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CustomerEventModel])
  ],
  controllers: [CustomerController],
  providers: [
    CustomerEventStoreRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
})
export class CustomerModule {}
