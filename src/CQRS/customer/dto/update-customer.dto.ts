import {IsString, IsEmail, IsOptional, IsDateString, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from '../../../Common/decorators/is-phone-number.decorator';
import { IsBankAccount } from '../../../Common/decorators/is-bank-account.decorator';

/**
 * Data Transfer Object for updating an existing customer
 */
export class UpdateCustomerDto {
  @ApiProperty({
    description: 'The first name of the customer',
    example: 'John',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Doe',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({
    description: 'The date of birth of the customer in ISO format',
    example: '1990-01-01',
    required: false
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'The phone number of the customer (must be a valid mobile number)',
    example: '+12025550123',
    required: false
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The email address of the customer',
    example: 'john.doe@example.com',
    required: false
  })
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'The bank account number of the customer (8-17 digits)',
    example: '12345678901',
    required: false
  })
  @IsBankAccount()
  @IsNotEmpty()
  bankAccountNumber?: string;
}
