import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const hasQueryGuard: CanMatchFn = () => {
  const router = inject(Router);
  const query = router.currentNavigation()?.extractedUrl.queryParams?.['q'];
  console.log('Guard query: ', query);

  return !!query;
};
