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
  UsePipes
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEntity } from '../../Orm/models/customer/customer.model';

/**
 * Customer Controller
 * Handles HTTP requests for customer management following BDD principles
 * Each endpoint is named with a behavior-focused name that describes what it does
 * in domain language
 */
@Controller('bdd/customers')
@ApiTags('BDD Customer Management')
@UsePipes(new ValidationPipe({ transform: true }))
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new customer in the system' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The customer has been successfully registered',
    type: CustomerEntity
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid customer data provided' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'A customer with this email already exists' })
  async registerCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    return this.customerService.registerNewCustomer(createCustomerDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all customers from the system' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of all registered customers',
    type: [CustomerEntity]
  })
  async getAllCustomers(): Promise<CustomerEntity[]> {
    return this.customerService.retrieveAllCustomers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find a specific customer by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to find', type: 'number' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The customer information',
    type: CustomerEntity
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found in the system' })
  async getCustomerById(@Param('id', ParseIntPipe) id: number): Promise<CustomerEntity> {
    return this.customerService.findCustomerById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update customer information' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to update', type: 'number' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The customer information has been successfully updated',
    type: CustomerEntity
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found in the system' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid customer data provided' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email address is already used by another customer' })
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    return this.customerService.updateCustomerInformation(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a customer from the system' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to remove', type: 'number' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The customer has been successfully removed' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found in the system' })
  async removeCustomer(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.customerService.removeCustomerFromSystem(id);
  }
}
