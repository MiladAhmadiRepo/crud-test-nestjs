import { IsString, IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { IsPhoneNumber } from '../../common/decorators/is-phone-number.decorator';
import { IsBankAccount } from '../../common/decorators/is-bank-account.decorator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBankAccount()
  @IsNotEmpty()
  bankAccountNumber: string;
}
