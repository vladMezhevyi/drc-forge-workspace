import { githubRequest } from '../../lib/github/github-request.js';
import type {
  SearchRepositoriesQueryParams,
  SearchRepositoriesResponse,
  SearchUsersQueryParams,
  SearchUsersResponse,
} from '@drc/shared/contracts';

class SearchService {
  private readonly errors: Record<number, string> = {
    422: 'Invalid search query',
    503: 'GitHub search service is unavailable, please try again later',
  };

  async searchRepositories(
    queryParams: SearchRepositoriesQueryParams,
  ): Promise<SearchRepositoriesResponse> {
    const response = await githubRequest(
      'GET /search/repositories',
      queryParams,
      this.errors,
    );
    return response.data;
  }

  async searchUsers(
    queryParams: SearchUsersQueryParams,
  ): Promise<SearchUsersResponse> {
    const response = await githubRequest(
      'GET /search/users',
      queryParams,
      this.errors,
    );
    return response.data;
  }
}

export const searchService = new SearchService();
