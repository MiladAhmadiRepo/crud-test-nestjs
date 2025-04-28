import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { IsPhoneNumber } from '../../../Common/decorators/is-phone-number.decorator';
import { IsBankAccount } from '../../../Common/decorators/is-bank-account.decorator';

/**
 * Data Transfer Object for creating a new customer
 */
export class CreateCustomerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail({
    allow_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true
  }, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @IsBankAccount()
  @IsOptional()
  bankAccountNumber?: string;
}
