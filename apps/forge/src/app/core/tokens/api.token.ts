import { InjectionToken, Provider } from '@angular/core';

export const API_BASE_URL: InjectionToken<string> = new InjectionToken(
  'API_BASE_URL',
);

export const provideApiBaseUrl = (baseUrl: string): Provider => {
  return {
    provide: API_BASE_URL,
    useValue: baseUrl,
  };
};
