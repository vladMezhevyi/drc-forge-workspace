import type { Endpoints } from '@octokit/types';

export type SearchRepositoriesResponse = Endpoints['GET /search/repositories']['response']['data'];
