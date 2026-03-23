import { HttpInterceptorFn } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { API_BASE_URL } from '../tokens/api.token';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);
  const url = req.url;

  // Throw error on wrong request path argument
  if (isDevMode() && !url.startsWith('/') && !url.startsWith('http')) {
    throw new Error(
      `[baseUrlInterceptor] Invalid URL "${url}" — relative paths must start with "/". Did you mean "/${url}"?`,
    );
  }

  if (url.startsWith('http')) {
    return next(req);
  }

  const request = req.clone({ url: `${baseUrl}${url}` });
  return next(request);
};
