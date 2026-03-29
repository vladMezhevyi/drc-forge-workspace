import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const hasQueryGuard: CanMatchFn = () => {
  const router = inject(Router);
  const query: string =
    router.currentNavigation()?.extractedUrl?.queryParams?.['q'];

  return !!query;
};
