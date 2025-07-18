import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsDateString, IsEmail, IsOptional, IsNotEmpty} from 'class-validator';
import { IsPhoneNumber } from "../../../Common/decorators/is-phone-number.decorator";
import { IsBankAccount } from "../../../Common/decorators/is-bank-account.decorator";

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
    required: false
  })
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({
    description: 'Date of birth in ISO format',
    example: '1990-01-01',
    required: false
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Mobile phone number in international format',
    example: '+12025550123',
    required: false
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Email address (must be unique)',
    example: 'john.doe@example.com',
    required: false
  })
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'Bank account number (8-17 digits)',
    example: '12345678901',
    required: false
  })
  @IsBankAccount()
  @IsNotEmpty()
  bankAccountNumber?: string;
}
