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

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  dateOfBirth: string;

  @ApiProperty({ example: '1234567890', nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ example: 'john.doe@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ example: '123456789', nullable: true })
  bankAccountNumber: string | null;

  // updatedAt field removed as it's no longer in the base entity

  /**
   * Static factory method to create a DTO from a domain entity
   */
  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id;
    dto.firstName = customer.firstName;
    dto.lastName = customer.lastName;
    dto.dateOfBirth = customer.dateOfBirth.toISOString();
    dto.phoneNumber = customer.phoneNumber;
    dto.email = customer.email;
    dto.bankAccountNumber = customer.bankAccountNumber;
    return dto;
  }
}
