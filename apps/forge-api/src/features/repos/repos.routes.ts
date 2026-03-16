import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { GetRepositoryParamsSchema } from '@drc/shared/contracts';
import { reposController } from './repos.controller.js';

export const reposRouter = Router();

reposRouter.get(
  '/:owner/:repo',
  validate({ params: GetRepositoryParamsSchema }),
  reposController.getRepository,
);
