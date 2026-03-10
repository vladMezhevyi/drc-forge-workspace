import { Octokit } from '@octokit/rest';
import { env } from '../../common/env.js';

export const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
  userAgent: 'drc-githunt',
});
