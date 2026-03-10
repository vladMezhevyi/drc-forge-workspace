import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { GetUserParamsSchema } from './users.schema.js';
import { usersController } from './users.controller.js';

export const usersRouter = Router();

usersRouter.get('/:username', validate({ params: GetUserParamsSchema }), usersController.getUser);
