import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isBankAccount', async: false })
export class IsBankAccountConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    // This is a simple validation. Adjust according to your bank account format requirements
    const accountNumberRegex = /^\d{8,17}$/; // 8-17 digits
    return accountNumberRegex.test(value);
  }

  defaultMessage() {
    return 'Bank account number ($value) must be valid';
  }
}

export function IsBankAccount(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBankAccountConstraint,
    });
  };
}
