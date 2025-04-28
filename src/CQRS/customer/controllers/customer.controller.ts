import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CreateCustomerCommand } from '../commands/models/create-customer.command';
import { UpdateCustomerCommand } from '../commands/models/update-customer.command';
import { DeleteCustomerCommand } from '../commands/models/delete-customer.command';
import { GetCustomerByIdQuery } from '../queries/models/get-customer-by-id.query';
import { GetAllCustomersQuery } from '../queries/models/get-all-customers.query';

/**
 * Customer Controller for CQRS Architecture
 * 
 * This controller is responsible for:
 * - Accepting HTTP requests
 * - Converting DTOs to Commands/Queries
 * - Dispatching Commands/Queries to the appropriate handlers
 * - Returning HTTP responses
 */
@Controller('cqrs/customers')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const customerId = await this.commandBus.execute(
        new CreateCustomerCommand(
          createCustomerDto.firstName,
          createCustomerDto.lastName,
          new Date(createCustomerDto.dateOfBirth),
          createCustomerDto.phoneNumber,
          createCustomerDto.email,
          createCustomerDto.bankAccountNumber
        )
      );
      
      return { id: customerId, message: 'Customer created successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const customer = await this.queryBus.execute(new GetCustomerByIdQuery(+id));
      if (!customer) {
        throw new HttpException(`Customer with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return customer;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    try {
      await this.commandBus.execute(
        new UpdateCustomerCommand(
          +id,
          updateCustomerDto.firstName,
          updateCustomerDto.lastName,
          updateCustomerDto.dateOfBirth ? new Date(updateCustomerDto.dateOfBirth) : undefined,
          updateCustomerDto.phoneNumber,
          updateCustomerDto.email,
          updateCustomerDto.bankAccountNumber
        )
      );
      
      return { message: 'Customer updated successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.commandBus.execute(new DeleteCustomerCommand(+id));
      return { message: 'Customer deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
