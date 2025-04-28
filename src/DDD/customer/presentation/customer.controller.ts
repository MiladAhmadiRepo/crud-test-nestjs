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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CustomerApplicationService } from '../application/customer.application.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';

/**
 * Customer Controller
 * Part of the presentation layer in DDD
 * Handles HTTP requests and translates between the application layer and the client
 */
@Controller('ddd/customers')
@ApiTags('DDD Customer Management')
@UsePipes(new ValidationPipe({ transform: true }))
export class CustomerController {
  constructor(private readonly applicationService: CustomerApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Customer successfully registered',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid customer data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Customer already exists' })
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto | null> {
    const customer = await this.applicationService.registerCustomer(createCustomerDto);
    if(!customer)return  null
    return CustomerResponseDto.fromDomain(customer);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer found',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerResponseDto> {
    const customer = await this.applicationService.findCustomerById(id);
    return CustomerResponseDto.fromDomain(customer);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer successfully updated',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid customer data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Email already in use' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto|null> {
    const customer = await this.applicationService.updateCustomer(id, updateCustomerDto);
    if(!customer) return null
    return CustomerResponseDto.fromDomain(customer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Customer successfully removed' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Customer not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.applicationService.removeCustomer(id);
  }
}
