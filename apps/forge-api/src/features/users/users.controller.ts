import type { RequestHandler } from 'express';
import { usersService } from './users.service.js';
import { HttpStatusCode } from '../../common/http-status-code.js';

class UsersController {
  getUser: RequestHandler = async (_req, res) => {
    const result = await usersService.getUser(res.locals.params);
    res.status(HttpStatusCode.OK).json(result);
  };
}

export const usersController = new UsersController();
