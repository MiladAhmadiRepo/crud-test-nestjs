import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerResponsePresenter } from '../presenters/customer-response.presenter';
import { CreateCustomerUseCase } from '../../core/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from '../../core/use-cases/get-customer.use-case';
import { GetAllCustomersUseCase } from '../../core/use-cases/get-all-customers.use-case';
import { UpdateCustomerUseCase } from '../../core/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../core/use-cases/delete-customer.use-case';

/**
 * Customer Controller
 * 
 * In Clean Architecture, controllers are part of the interface adapters layer
 * that convert data from the format most convenient for the use cases and entities
 * to the format most convenient for the delivery mechanism (e.g., web, CLI, etc.)
 */
@Controller('clean/customers')
@ApiTags('Clean Architecture Customer Management')
@UsePipes(new ValidationPipe({ transform: true }))
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Customer successfully registered',
    type: CustomerResponsePresenter,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid customer data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Customer already exists' })
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponsePresenter> {
    try {
      const customer = await this.createCustomerUseCase.execute({
        firstName: createCustomerDto.firstName,
        lastName: createCustomerDto.lastName,
        dateOfBirth: new Date(createCustomerDto.dateOfBirth),
        phoneNumber: createCustomerDto.phoneNumber,
        email: createCustomerDto.email,
        bankAccountNumber: createCustomerDto.bankAccountNumber,
      });
      if(!customer){
        throw new HttpException('error creating customer', HttpStatus.BAD_REQUEST);
      }
      return CustomerResponsePresenter.fromEntity(customer);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all customers',
    type: [CustomerResponsePresenter],
  })
  async findAll(): Promise<CustomerResponsePresenter[]> {
    const customers = await this.getAllCustomersUseCase.execute();
    return customers.map(customer => CustomerResponsePresenter.fromEntity(customer));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer found',
    type: CustomerResponsePresenter,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerResponsePresenter> {
    try {
      const customer = await this.getCustomerUseCase.execute(id);
      if(!customer){
        throw new HttpException('not found customer', HttpStatus.NOT_FOUND);
      }
      return CustomerResponsePresenter.fromEntity(customer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer successfully updated',
    type: CustomerResponsePresenter,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid customer data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already in use' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponsePresenter> {
    try {
      const customer = await this.updateCustomerUseCase.execute(id, {
        firstName: updateCustomerDto.firstName,
        lastName: updateCustomerDto.lastName,
        dateOfBirth: updateCustomerDto.dateOfBirth ? new Date(updateCustomerDto.dateOfBirth) : undefined,
        phoneNumber: updateCustomerDto.phoneNumber,
        email: updateCustomerDto.email,
        bankAccountNumber: updateCustomerDto.bankAccountNumber,
      });
      if(!customer){
        throw new HttpException('not found customer', HttpStatus.NOT_FOUND);
      }
      return CustomerResponsePresenter.fromEntity(customer);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('already used')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Customer successfully removed' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.deleteCustomerUseCase.execute(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
