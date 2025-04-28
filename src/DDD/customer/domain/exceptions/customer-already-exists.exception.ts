import { ConflictException } from '@nestjs/common';

/**
 * Domain-specific exception for when a customer already exists
 */
export class CustomerAlreadyExistsException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
