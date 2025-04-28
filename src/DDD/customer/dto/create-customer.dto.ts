import { IsString, IsDateString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from '../../../Common/decorators/is-phone-number.decorator';
import { IsBankAccount } from '../../../Common/decorators/is-bank-account.decorator';

/**
 * Data Transfer Object for creating a new customer
 * Part of the presentation layer in DDD
 */
export class CreateCustomerDto {
  @ApiProperty({
    description: 'The first name of the customer',
    example: 'John'
  })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Doe'
  })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'The date of birth of the customer in ISO format',
    example: '1990-01-01'
  })
  @IsDateString({}, { message: 'Date of birth must be a valid date string' })
  dateOfBirth: string;

  @ApiProperty({
    description: 'The phone number of the customer (must be a valid mobile number)',
    example: '+12025550123',
    required: false
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    description: 'The email address of the customer',
    example: 'john.doe@example.com',
    required: false
  })
  @IsEmail({
    allow_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true
  }, { message: 'Email must be a valid email address' })
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'The bank account number of the customer (8-17 digits)',
    example: '12345678901',
    required: false
  })
  @IsBankAccount()
  @IsOptional()
  bankAccountNumber: string;
}
