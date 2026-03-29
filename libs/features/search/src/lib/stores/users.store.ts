import { inject } from '@angular/core';
import { SearchUser, SearchUsersFilters } from '@drc/shared/contracts';
import { signalStore, withState } from '@ngrx/signals';
import { SearchApi } from '../api/search.api';
import { switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Events,
  on,
  withEventHandlers,
  withReducer,
} from '@ngrx/signals/events';
import { searchEvents } from '../events/search.events';
import { mapResponse } from '@ngrx/operators';
import { usersApiEvents } from '../events/users.events';

export interface UsersState {
  users: SearchUser[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  filters: SearchUsersFilters;
}

const initialState: UsersState = {
  users: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  filters: {},
};

export const UsersStore = signalStore(
  withState(initialState),
  withReducer(
    on(searchEvents.usersSearchTriggered, ({ payload }) => ({
      isLoading: true,
      error: null,
      filters: payload.filters,
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
        api.searchUsers({ q: payload.query, ...payload.filters }).pipe(
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
