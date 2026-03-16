import { githubRequest } from '../../lib/github/github-request.js';
import type {
  GetRepositoryParams,
  GetRepositoryResponse,
} from '@drc/shared/contracts';

class ReposService {
  async getRepository(
    params: GetRepositoryParams,
  ): Promise<GetRepositoryResponse> {
    const result = await githubRequest('GET /repos/{owner}/{repo}', params, {
      403: 'Access to this repository is forbidden',
      404: 'Repository not found',
    });
    return result.data;
  }
}

export const reposService = new ReposService();
