import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

/**
 * Data Transfer Object for updating an existing customer
 */
export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  bankAccountNumber?: string;
}
