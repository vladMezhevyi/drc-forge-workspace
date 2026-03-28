import { inject } from '@angular/core';
import { SearchRepository } from '@drc/shared/contracts';
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
import { mapResponse } from '@ngrx/operators';
import { searchEvents } from '../events/search.events';

export interface RepositoriesState {
  repositories: SearchRepository[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: RepositoriesState = {
  repositories: [],
  totalCount: 0,
  isLoading: false,
  error: null,
};

const repositoriesApiEvents = eventGroup({
  source: 'Search Repositories API',
  events: {
    loadedSuccess: type<{
      repositories: SearchRepository[];
      totalCount: number;
    }>(),
    loadedFailure: type<string>(),
  },
});

export const RepositoriesStore = signalStore(
  withState(initialState),
  withReducer(
    on(searchEvents.repositoriesSearchTriggered, () => ({
      isLoading: true,
      error: null,
    })),
    on(repositoriesApiEvents.loadedSuccess, ({ payload }) => ({
      repositories: payload.repositories,
      totalCount: payload.totalCount,
      isLoading: false,
      error: null,
    })),
    on(repositoriesApiEvents.loadedFailure, ({ payload }) => ({
      error: payload,
      isLoading: false,
      repositories: [],
      totalCount: 0,
    })),
  ),
  withEventHandlers((_, events = inject(Events), api = inject(SearchApi)) => ({
    search$: events.on(searchEvents.repositoriesSearchTriggered).pipe(
      switchMap(({ payload }) =>
        api.searchRepositories({ q: payload }).pipe(
          mapResponse({
            next: ({ items, totalCount }) =>
              repositoriesApiEvents.loadedSuccess({
                totalCount,
                repositories: items,
              }),
            error: (error: HttpErrorResponse) =>
              repositoriesApiEvents.loadedFailure(error.message),
          }),
        ),
      ),
    ),
  })),
);
