import { IsString, IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { IsPhoneNumber } from "../../../Common/decorators/is-phone-number.decorator";
import { IsBankAccount } from "../../../Common/decorators/is-bank-account.decorator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Date of birth in ISO format',
    example: '1990-01-01',
    required: true
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Mobile phone number in international format',
    example: '+19786253886',
    required: true
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email address (must be unique)',
    example: 'john.doe@example.com',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Bank account number (8-17 digits)',
    example: '12345678901',
    required: true
  })
  @IsBankAccount()
  @IsNotEmpty()
  bankAccountNumber: string;
}
