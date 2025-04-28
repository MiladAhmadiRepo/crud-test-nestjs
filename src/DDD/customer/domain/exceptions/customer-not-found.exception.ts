import { NotFoundException } from '@nestjs/common';

/**
 * Domain-specific exception for when a customer is not found
 */
export class CustomerNotFoundException extends NotFoundException {
  constructor(customerId: number) {
    super(`Customer with ID ${customerId} was not found in the system`);
  }
}
