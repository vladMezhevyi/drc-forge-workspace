import { Route } from '@angular/router';
import { hasQueryGuard } from './guards/has-query/has-query.guard';
import { provideSearch } from './providers/search.provider';

export const SEARCH_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/search/search.layout').then((c) => c.SearchLayout),
    providers: [provideSearch()],
    children: [
      {
        path: '',
        canMatch: [hasQueryGuard],
        loadComponent: () =>
          import('./pages/search/search.page').then((c) => c.SearchPage),
      },
      {
        path: '',
        loadComponent: () =>
          import('./pages/search-landing/search-landing.page').then(
            (c) => c.SearchLandingPage,
          ),
      },
    ],
  },
];
