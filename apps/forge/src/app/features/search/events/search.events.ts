import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const searchEvents = eventGroup({
  source: 'Search Page',
  events: {
    repositoriesSearchTriggered: type<string>(),
    usersSearchTriggered: type<string>(),
  },
});
