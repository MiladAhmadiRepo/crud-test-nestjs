import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    try {
      const phoneNumber = phoneUtil.parse(value);
      return phoneUtil.isValidNumber(phoneNumber) && phoneUtil.getNumberType(phoneNumber) === 1; // 1 is MOBILE
    } catch (e) {
      return false;
    }
  }

  defaultMessage() {
    return 'Phone number ($value) must be a valid mobile number';
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}
