import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for updating an existing customer
 * Part of the presentation layer in DDD
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @ApiProperty({
    description: 'The first name of the customer',
    example: 'John',
    required: false
  })
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Doe',
    required: false
  })
  lastName?: string;

  @ApiProperty({
    description: 'The date of birth of the customer in ISO format',
    example: '1990-01-01',
    required: false
  })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '1234567890',
    required: false
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'The email address of the customer',
    example: 'john.doe@example.com',
    required: false
  })
  email?: string;

  @ApiProperty({
    description: 'The bank account number of the customer',
    example: '123456789',
    required: false
  })
  bankAccountNumber?: string;
}
