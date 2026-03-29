import { SearchUser } from '@drc/shared/contracts';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const usersApiEvents = eventGroup({
  source: 'Search Users API',
  events: {
    loadedSuccess: type<{
      users: SearchUser[];
      totalCount: number;
    }>(),
    loadedFailure: type<string>(),
  },
});
