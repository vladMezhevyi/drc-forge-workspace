import z from 'zod';
import type { DeepCamelCase } from '@drc/shared/models';
import type { Endpoints } from '@octokit/types';

export const GetUserParamsSchema = z.object({
  username: z.string().min(1),
});

export type GetUserParams = z.infer<typeof GetUserParamsSchema>;

export type GetUserResponse = DeepCamelCase<Endpoints['GET /users/{username}']['response']['data']>;
