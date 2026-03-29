import { SearchRepository } from '@drc/shared/contracts';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const repositoriesApiEvents = eventGroup({
  source: 'Search Repositories API',
  events: {
    loadedSuccess: type<{
      repositories: SearchRepository[];
      totalCount: number;
    }>(),
    loadedFailure: type<string>(),
  },
});
