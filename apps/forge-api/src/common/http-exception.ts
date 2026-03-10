import { HttpStatusCode } from './http-status-code.js';

export class HttpException extends Error {
  constructor(
    public readonly statusCode: HttpStatusCode,
    public readonly message: string,
    public readonly errors?: unknown[],
    public readonly isOperational: boolean = true, // false - unexpected bug, true = expected error
  ) {
    super(message);

    this.name = 'HttpException'; // Shows class name instead of generic 'Error'

    Object.setPrototypeOf(this, new.target.prototype); // Fixes instanceof checks when extending Error

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor); // stack trace starts where error was thrown, not inside this constructor
    }
  }
}
