import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { GetUserParamsSchema } from '@drc/shared/contracts';
import { usersController } from './users.controller.js';

export const usersRouter = Router();

usersRouter.get(
  '/:username',
  validate({ params: GetUserParamsSchema }),
  usersController.getUser,
);
