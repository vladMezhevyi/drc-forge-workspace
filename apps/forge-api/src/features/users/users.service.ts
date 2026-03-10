import { githubRequest } from '../../lib/github/github-request.js';
import type { GetUserParams, GetUserResponse } from './users.schema.js';

class UsersService {
  async getUser(queryParams: GetUserParams): Promise<GetUserResponse> {
    const response = await githubRequest('GET /users/{username}', queryParams, {
      404: 'User not found',
    });
    return response.data;
  }
}

export const usersService = new UsersService();
