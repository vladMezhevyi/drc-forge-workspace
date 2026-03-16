import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  SearchRepositoriesQueryParamsSchema,
  SearchUsersQueryParamsSchema,
} from '@drc/shared/contracts';
import { searchController } from './search.controller.js';

export const searchRouter = Router();

searchRouter.get(
  '/repositories',
  validate({ query: SearchRepositoriesQueryParamsSchema }),
  searchController.searchRepositories,
);

searchRouter.get(
  '/users',
  validate({ query: SearchUsersQueryParamsSchema }),
  searchController.searchUsers,
);
