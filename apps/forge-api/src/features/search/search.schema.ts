import type { Endpoints } from '@octokit/types';
import type { DeepCamelCase } from '../../utils/case-transform/case-transform.types.js';
import z from 'zod';

// Common Schemas
export const BaseSearchQueryParamsSchema = z.object({
  q: z.string().min(1),
  order: z.enum(['desc', 'asc']).default('desc').optional(),
  perPage: z.coerce.number().positive().default(30).optional(),
  page: z.coerce.number().positive().default(1).optional(),
});

// Search Repositories
export const SearchRepositoriesQueryParamsSchema = BaseSearchQueryParamsSchema.extend({
  sort: z.enum(['stars', 'forks', 'help-wanted-issues', 'updated']).optional(),
});

export type SearchRepositoriesQueryParams = z.infer<typeof SearchRepositoriesQueryParamsSchema>;

export type SearchRepositoriesResponse = DeepCamelCase<
  Endpoints['GET /search/repositories']['response']['data']
>;

// Search Users
export const SearchUsersQueryParamsSchema = BaseSearchQueryParamsSchema.extend({
  sort: z.enum(['followers', 'repositories', 'joined']).optional(),
});

export type SearchUsersQueryParams = z.infer<typeof SearchUsersQueryParamsSchema>;

export type SearchUsersResponse = DeepCamelCase<Endpoints['GET /search/users']['response']['data']>;
