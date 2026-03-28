import type { Endpoints } from '@octokit/types';
import z from 'zod';
import { DeepCamelCase } from '@drc/shared/models';

// Common Schemas
export const BaseSearchQueryParamsSchema = z.object({
  q: z.string().min(1),
  order: z.enum(['desc', 'asc']).default('desc').optional(),
  perPage: z.coerce.number().positive().default(30).optional(),
  page: z.coerce.number().positive().default(1).optional(),
});

export const SearchTypeSchema = z.enum(['repositories', 'users']);

export type SearchType = z.infer<typeof SearchTypeSchema>;

// Search Repositories
export const SearchRepositoriesQueryParamsSchema =
  BaseSearchQueryParamsSchema.extend({
    sort: z
      .enum(['stars', 'forks', 'help-wanted-issues', 'updated'])
      .optional(),
  });

export type SearchRepositoriesQueryParams = z.infer<
  typeof SearchRepositoriesQueryParamsSchema
>;

export type SearchRepositoriesResponse = DeepCamelCase<
  Endpoints['GET /search/repositories']['response']['data']
>;

export type SearchRepository = SearchRepositoriesResponse['items'][number];

// Search Users
export const SearchUsersQueryParamsSchema = BaseSearchQueryParamsSchema.extend({
  sort: z.enum(['followers', 'repositories', 'joined']).optional(),
});

export type SearchUsersQueryParams = z.infer<
  typeof SearchUsersQueryParamsSchema
>;

export type SearchUsersResponse = DeepCamelCase<
  Endpoints['GET /search/users']['response']['data']
>;

export type SearchUser = SearchUsersResponse['items'][number];
