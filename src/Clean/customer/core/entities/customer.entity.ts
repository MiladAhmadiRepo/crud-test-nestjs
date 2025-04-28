/**
 * Core Entity - Customer
 * 
 * In Clean Architecture, entities encapsulate enterprise-wide business rules.
 * They are the most stable part of the system and should not depend on any outer layer.
 */
export class Customer {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _dateOfBirth: Date;
  private _phoneNumber: string  ;
  private _email: string  ;
  private _bankAccountNumber: string  ;
  private _createdAt: Date;
  private _updatedAt: Date |null ;

  constructor(
    id: number  ,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    phoneNumber: string,
    email: string,
    bankAccountNumber: string,
    createdAt: Date  |null,
    updatedAt: Date | null
  ) {
    this._id = id || 0;
    this._firstName = firstName;
    this._lastName = lastName;
    this._dateOfBirth = dateOfBirth;
    this._phoneNumber = phoneNumber  ;
    this._email = email  ;
    this._bankAccountNumber = bankAccountNumber  ;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt  ;
    
    this.validateState();
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

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get dateOfBirth(): Date {
    return this._dateOfBirth;
  }

  get age(): number {
    const today = new Date();
    let age = today.getFullYear() - this._dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this._dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this._dateOfBirth.getDate())) {
      age--;
    }
    
    return age;
  }

  get phoneNumber(): string  {
    return this._phoneNumber;
  }

  get email(): string  {
    return this._email;
  }

  get bankAccountNumber(): string   {
    return this._bankAccountNumber;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date |null {
    return this._updatedAt;
  }

  // Business methods
  updatePersonalInformation(firstName?: string, lastName?: string, dateOfBirth?: Date): void {
    if (firstName !== undefined) {
      this._firstName = firstName;
    }
    
    if (lastName !== undefined) {
      this._lastName = lastName;
    }
    
    if (dateOfBirth !== undefined) {
      this._dateOfBirth = dateOfBirth;
    }
    
    this._updatedAt = new Date();
    this.validateState();
  }

  updateContactInformation(phoneNumber?: string, email?: string): void {
    if (phoneNumber !== undefined) {
      this._phoneNumber = phoneNumber;
    }
    
    if (email !== undefined) {
      this._email = email;
    }
    
    this._updatedAt = new Date();
    this.validateState();
  }

  updateBankInformation(bankAccountNumber?: string): void {
    if (bankAccountNumber !== undefined) {
      this._bankAccountNumber = bankAccountNumber;
    }
    
    this._updatedAt = new Date();
    this.validateState();
  }

  // Validation logic
  private validateState(): void {
    if (!this._firstName || this._firstName.trim() === '') {
      throw new Error('First name cannot be empty');
    }
    
    if (!this._lastName || this._lastName.trim() === '') {
      throw new Error('Last name cannot be empty');
    }
    
    if (!this._dateOfBirth) {
      throw new Error('Date of birth cannot be empty');
    }
    
    if (this._dateOfBirth > new Date()) {
      throw new Error('Date of birth cannot be in the future');
    }
    
    if (this._email && !this.isValidEmail(this._email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // For serialization
  toJSON() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      dateOfBirth: this._dateOfBirth,
      phoneNumber: this._phoneNumber,
      email: this._email,
      bankAccountNumber: this._bankAccountNumber,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
