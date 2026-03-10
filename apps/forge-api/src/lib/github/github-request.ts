import type { Endpoints, RequestParameters } from '@octokit/types';
import { RequestError } from '@octokit/request-error';
import { octokit } from './github-client.js';
import { HttpException } from '../../common/http-exception.js';
import { HttpStatusCode } from '../../common/http-status-code.js';
import { deepCamelCase, deepSnakeCase } from '../../utils/case-transform/index.js';
import type { DeepCamelCase } from '../../utils/case-transform/index.js';

type GitHubErrorMessages = Partial<Record<number, string>>;

type GitHubParams<E extends keyof Endpoints> = E extends keyof Endpoints
  ? Endpoints[E]['parameters'] & RequestParameters
  : RequestParameters;

/**
 * Wraps Octokit requests with automatic camelCase/snakeCase conversion and error handling.
 *
 * - Converts camelCase params to snake_case before sending to GitHub API
 * - Converts snake_case response to camelCase before returning
 * - Translates known GitHub API errors into HttpExceptions with custom messages
 * - Unknown GitHub errors result in a generic 500 HttpException
 * - Non-Octokit errors are rethrown as-is
 *
 * @param endpoint - GitHub API endpoint e.g. 'GET /repos/{owner}/{repo}'
 * @param params - Endpoint parameters in camelCase
 * @param errorMessages - Map of HTTP status codes to custom error messages e.g. { 404: 'Repository not found' }
 */
export const githubRequest = async <E extends keyof Endpoints>(
  endpoint: E,
  params?: DeepCamelCase<GitHubParams<E>>,
  errorMessages: GitHubErrorMessages = {},
): Promise<DeepCamelCase<Endpoints[E]['response']>> => {
  try {
    const parameters = params ? deepSnakeCase(params) : undefined;
    const response = await octokit.request(endpoint, parameters as GitHubParams<E> | undefined);
    return deepCamelCase(response);
  } catch (error) {
    if (error instanceof RequestError) {
      const message = errorMessages[error.status];
      if (message) {
        throw new HttpException(error.status as HttpStatusCode, message);
      }

      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Something went wrong');
    }

    throw error;
  }
};
