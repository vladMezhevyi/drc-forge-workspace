import type { NextFunction, Request, Response } from 'express';
import { HttpException } from '../common/http-exception.js';
import { logger } from '../common/logger.js';
import { ZodError } from 'zod';
import { HttpStatusCode } from '../common/http-status-code.js';
import { RequestError } from '@octokit/request-error';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Handle known/expected errors
  if (error instanceof HttpException) {
    // Operational - expected (404, 400, etc...), non-operational - bug
    if (error.isOperational) {
      logger.warn({ error }, error.message);
    } else {
      logger.error({ error }, error.message);
    }

    res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors?.length ? error.errors : undefined,
    });

    return;
  }

  // Zod validation failed - always a 400
  if (error instanceof ZodError) {
    logger.warn({ error }, 'Validation failed');

    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Validation failed',
      errors: error.issues,
    });

    return;
  }

  if (error instanceof RequestError) {
    logger.warn({ error }, 'GitHub API error');
    res.status(error.status).json({ message: 'Something went wrong' });

    return;
  }

  // Anything else is unexpected - log full error, return generic 500
  logger.error({ error }, 'Unexpected error');
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
};
