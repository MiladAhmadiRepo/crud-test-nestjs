/**
 * Domain Entity - Customer
 * 
 * In DDD, the domain entity represents the core business concept with its behavior.
 * This is different from the ORM entity which is an infrastructure concern.
 */
export class Customer {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _dateOfBirth: Date;
  private _phoneNumber: string | null;
  private _email: string | null;
  private _bankAccountNumber: string | null;
  private _createdAt: Date;
  private _updatedAt: Date | null;

  constructor(
    id: number | null,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    phoneNumber?: string,
    email?: string,
    bankAccountNumber?: string,
    createdAt?: Date,
    updatedAt?: Date | null
  ) {
    this._id = id || 0;
    this._firstName = firstName;
    this._lastName = lastName;
    this._dateOfBirth = dateOfBirth;
    this._phoneNumber = phoneNumber || null;
    this._email = email || null;
    this._bankAccountNumber = bankAccountNumber || null;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || null;
    
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

  get phoneNumber(): string | null {
    return this._phoneNumber;
  }

  get email(): string | null {
    return this._email;
  }

  get bankAccountNumber(): string | null {
    return this._bankAccountNumber;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  // Domain methods
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
