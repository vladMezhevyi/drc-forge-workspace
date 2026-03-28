import { inject } from '@angular/core';
import { SearchUser } from '@drc/shared/contracts';
import { signalStore, type, withState } from '@ngrx/signals';
import { SearchApi } from '../../../core/api/search/search.api';
import { switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  eventGroup,
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { searchEvents } from '../events/search.events';
import { mapResponse } from '@ngrx/operators';

export interface UsersState {
  users: SearchUser[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  totalCount: 0,
  isLoading: false,
  error: null,
};

const usersApiEvents = eventGroup({
  source: 'Search Users API',
  events: {
    loadedSuccess: type<{
      users: SearchUser[];
      totalCount: number;
    }>(),
    loadedFailure: type<string>(),
  },
});

export const UsersStore = signalStore(
  withState(initialState),
  withReducer(
    on(searchEvents.usersSearchTriggered, () => ({
      isLoading: true,
      error: null,
    })),
    on(usersApiEvents.loadedSuccess, ({ payload }) => ({
      users: payload.users,
      totalCount: payload.totalCount,
      isLoading: false,
      error: null,
    })),
    on(usersApiEvents.loadedFailure, ({ payload }) => ({
      error: payload,
      isLoading: false,
      users: [],
      totalCount: 0,
    })),
  ),
  withEventHandlers((_, events = inject(Events), api = inject(SearchApi)) => ({
    search$: events.on(searchEvents.usersSearchTriggered).pipe(
      switchMap(({ payload }) =>
        api.searchUsers({ q: payload }).pipe(
          mapResponse({
            next: ({ items, totalCount }) =>
              usersApiEvents.loadedSuccess({
                totalCount,
                users: items,
              }),
            error: (error: HttpErrorResponse) =>
              usersApiEvents.loadedFailure(error.message),
          }),
        ),
      ),
    ),
  })),
);
