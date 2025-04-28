import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';
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
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'The date of birth of the customer in ISO format',
    example: '1990-01-01',
    required: false
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'The phone number of the customer (must be a valid mobile number)',
    example: '+12025550123',
    required: false
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

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
  email?: string;

  @ApiProperty({
    description: 'The bank account number of the customer (8-17 digits)',
    example: '12345678901',
    required: false
  })
  @IsBankAccount()
  @IsOptional()
  bankAccountNumber?: string;
}
