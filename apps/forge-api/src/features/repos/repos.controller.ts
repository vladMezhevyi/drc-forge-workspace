import type { RequestHandler } from 'express';
import { reposService } from './repos.service.js';
import { HttpStatusCode } from '../../common/http-status-code.js';

export class ReposController {
  getRepository: RequestHandler = async (_req, res) => {
    const result = await reposService.getRepository(res.locals.params);
    res.status(HttpStatusCode.OK).json(result);
  };
}

export const reposController = new ReposController();
