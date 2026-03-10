import type { RequestHandler } from 'express';
import type z from 'zod';
import { HttpException } from '../common/http-exception.js';
import { HttpStatusCode } from '../common/http-status-code.js';

export interface ValidateSchemas {
  query?: z.ZodType;
  params?: z.ZodType;
  body?: z.ZodType;
}

export const validate =
  (schemas: ValidateSchemas): RequestHandler =>
  (req, res, next): void => {
    const errors: unknown[] = [];

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (result.success) {
        res.locals.query = result.data;
      } else {
        errors.push(...result.error.issues);
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (result.success) {
        res.locals.params = result.data;
      } else {
        errors.push(...result.error.issues);
      }
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (result.success) {
        res.locals.body = result.data;
      } else {
        errors.push(...result.error.issues);
      }
    }

    if (errors.length) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, 'Validation failed', errors);
    }

    next();
  };
