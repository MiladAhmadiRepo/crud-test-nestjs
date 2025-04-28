import { IsString, IsDateString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'The phone number of the customer',
    example: '1234567890',
    required: false
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The email address of the customer',
    example: 'john.doe@example.com',
    required: false
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The bank account number of the customer',
    example: '123456789',
    required: false
  })
  @IsString({ message: 'Bank account number must be a string' })
  @IsOptional()
  bankAccountNumber?: string;
}
