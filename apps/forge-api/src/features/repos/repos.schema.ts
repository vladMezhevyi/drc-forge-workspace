import z from 'zod';
import type { DeepCamelCase } from '../../utils/case-transform/case-transform.types.js';
import type { Endpoints } from '@octokit/types';

// Get Repository
export const GetRepositoryParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export type GetRepositoryParams = z.infer<typeof GetRepositoryParamsSchema>;

export type GetRepositoryResponse = DeepCamelCase<
  Endpoints['GET /repos/{owner}/{repo}']['response']['data']
>;
