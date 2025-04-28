import { AggregateRoot } from '@nestjs/cqrs';
import { CustomerCreatedEvent } from '../events/models/customer-created.event';
import { CustomerUpdatedEvent } from '../events/models/customer-updated.event';
import { CustomerDeletedEvent } from '../events/models/customer-deleted.event';

/**
 * Customer Aggregate Root
 *
 * In CQRS and Event Sourcing, an Aggregate Root is responsible for:
 * 1. Enforcing invariants (business rules)
 * 2. Applying state changes through events
 * 3. Exposing public methods that represent business operations
 */
export class CustomerAggregate extends AggregateRoot {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _dateOfBirth: Date;
  private _phoneNumber: string | null;
  private _email: string | null;
  private _bankAccountNumber: string | null;
  private _isDeleted: boolean;

  constructor(id?: number) {
    super();
    this._id = id || 0;
    this._isDeleted = false;
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }


  get dateOfBirth(): Date {
    return this._dateOfBirth;
  }

  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  get email(): string | null {
    return this._email;
  }

  get bankAccountNumber(): string | null {
    return this._bankAccountNumber;
  }

  // Command methods - these trigger events
  createCustomer(
    id: number,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    phoneNumber?: string,
    email?: string,
    bankAccountNumber?: string
  ): void {
    // Validate
    this.validateCustomerData(firstName, lastName, dateOfBirth, email);

    // Apply event
    this.apply(new CustomerCreatedEvent(
      id,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber || null,
      email || null,
      bankAccountNumber || null,
    ));
  }

  updateCustomer(
    firstName?: string,
    lastName?: string,
    dateOfBirth?: Date,
    phoneNumber?: string,
    email?: string,
    bankAccountNumber?: string
  ): void {
    // Check if customer exists
    if (this._isDeleted) {
      throw new Error('Cannot update a deleted customer');
    }

    // Validate if any data is provided
    if (firstName !== undefined || lastName !== undefined || dateOfBirth !== undefined ||
        phoneNumber !== undefined || email !== undefined || bankAccountNumber !== undefined) {

      // Validate new data
      this.validateCustomerData(
        firstName !== undefined ? firstName : this._firstName,
        lastName !== undefined ? lastName : this._lastName,
        dateOfBirth !== undefined ? dateOfBirth : this._dateOfBirth,
        email !== undefined ? email : this._email
      );

      // Apply event
      this.apply(new CustomerUpdatedEvent(
        this._id,
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        email,
        bankAccountNumber,
      ));
    }
  }

  deleteCustomer(): void {
    // Check if customer exists
    if (this._isDeleted) {
      throw new Error('Customer is already deleted');
    }

    // Apply event
    this.apply(new CustomerDeletedEvent(this._id));
  }

  // Event sourcing methods - these update the state based on events
  onCustomerCreatedEvent(event: CustomerCreatedEvent): void {
    this._id = event.customerId;
    this._firstName = event.firstName;
    this._lastName = event.lastName;
    this._dateOfBirth = event.dateOfBirth;
    this._phoneNumber = event.phoneNumber;
    this._email = event.email;
    this._bankAccountNumber = event.bankAccountNumber;
    this._isDeleted = false;
  }

  onCustomerUpdatedEvent(event: CustomerUpdatedEvent): void {
    if (event.firstName !== undefined) {
      this._firstName = event.firstName;
    }

    if (event.lastName !== undefined) {
      this._lastName = event.lastName;
    }

    if (event.dateOfBirth !== undefined) {
      this._dateOfBirth = event.dateOfBirth;
    }

    if (event.phoneNumber !== undefined) {
      this._phoneNumber = event.phoneNumber;
    }

    if (event.email !== undefined) {
      this._email = event.email;
    }

    if (event.bankAccountNumber !== undefined) {
      this._bankAccountNumber = event.bankAccountNumber;
    }

  }

  onCustomerDeletedEvent(event: CustomerDeletedEvent): void {
    this._isDeleted = true;
  }

  // Helper methods
  private validateCustomerData(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    email?: string | null
  ): void {
    if (!firstName || firstName.trim() === '') {
      throw new Error('First name cannot be empty');
    }

    if (!lastName || lastName.trim() === '') {
      throw new Error('Last name cannot be empty');
    }

    if (!dateOfBirth) {
      throw new Error('Date of birth cannot be empty');
    }

    if (dateOfBirth > new Date()) {
      throw new Error('Date of birth cannot be in the future');
    }

  }

}
