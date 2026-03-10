import { Router } from 'express';
import { searchRouter } from './features/search/search.routes.js';
import { reposRouter } from './features/repos/repos.routes.js';
import { usersRouter } from './features/users/users.routes.js';

export const router = Router();

router.get('/status', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/search', searchRouter);
router.use('/repos', reposRouter);
router.use('/users', usersRouter);
