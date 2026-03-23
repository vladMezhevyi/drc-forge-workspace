import { Route } from '@angular/router';

export const SEARCH_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/search/search.layout').then((c) => c.SearchLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/search/search.page').then((c) => c.SearchPage),
      },
    ],
  },
];
