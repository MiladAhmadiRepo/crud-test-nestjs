import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../domain/customer.entity';

/**
 * Data Transfer Object for customer responses
 * Part of the presentation layer in DDD
 */
export class CustomerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  dateOfBirth: string;

  @ApiProperty({ example: 33 })
  age: number;

  @ApiProperty({ example: '1234567890', nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ example: 'john.doe@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ example: '123456789', nullable: true })
  bankAccountNumber: string | null;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: string;

  // updatedAt field removed as it's no longer in the base entity

  /**
   * Static factory method to create a DTO from a domain entity
   */
  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id;
    dto.firstName = customer.firstName;
    dto.lastName = customer.lastName;
    dto.fullName = customer.fullName;
    dto.dateOfBirth = customer.dateOfBirth.toISOString();
    dto.age = customer.age;
    dto.phoneNumber = customer.phoneNumber;
    dto.email = customer.email;
    dto.bankAccountNumber = customer.bankAccountNumber;
    dto.createdAt = customer.createdAt.toISOString();
    return dto;
  }
}
