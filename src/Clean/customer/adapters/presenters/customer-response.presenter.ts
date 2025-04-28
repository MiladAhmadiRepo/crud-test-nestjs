import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../core/entities/customer.entity';

/**
 * Presenter for customer responses
 * 
 * In Clean Architecture, presenters are part of the interface adapters layer
 * that format the output from the use cases into a format suitable for the
 * delivery mechanism (e.g., web, CLI, etc.)
 */
export class CustomerResponsePresenter {
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
   * Static factory method to create a presenter from a domain entity
   */
  static fromEntity(customer: Customer  ): CustomerResponsePresenter {
    const presenter = new CustomerResponsePresenter();
    presenter.id = customer.id;
    presenter.firstName = customer.firstName;
    presenter.lastName = customer.lastName;
    presenter.fullName = customer.fullName;
    presenter.dateOfBirth = customer.dateOfBirth.toISOString();
    presenter.age = customer.age;
    presenter.phoneNumber = customer.phoneNumber;
    presenter.email = customer.email;
    presenter.bankAccountNumber = customer.bankAccountNumber;
    presenter.createdAt = customer.createdAt.toISOString();
    return presenter;
  }
}
