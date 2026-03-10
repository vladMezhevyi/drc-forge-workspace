import type { RequestHandler } from 'express';
import { searchService } from './search.service.js';
import { HttpStatusCode } from '../../common/http-status-code.js';

class SearchController {
  searchRepositories: RequestHandler = async (_req, res): Promise<void> => {
    const result = await searchService.searchRepositories(res.locals.query);
    res.status(HttpStatusCode.OK).json(result);
  };

  searchUsers: RequestHandler = async (_req, res): Promise<void> => {
    const result = await searchService.searchUsers(res.locals.query);
    res.status(HttpStatusCode.OK).json(result);
  };
}

export const searchController = new SearchController();
