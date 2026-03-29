import {
  SearchRepositoryFilters,
  SearchUsersFilters,
} from '@drc/shared/contracts';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const searchEvents = eventGroup({
  source: 'Search Page',
  events: {
    repositoriesSearchTriggered: type<{
      query: string;
      filters?: SearchRepositoryFilters;
    }>(),
    usersSearchTriggered: type<{
      query: string;
      filters?: SearchUsersFilters;
    }>(),
  },
});
