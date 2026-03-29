import { inject } from '@angular/core';
import {
  SearchRepository,
  SearchRepositoryFilters,
} from '@drc/shared/contracts';
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
import { mapResponse } from '@ngrx/operators';
import { searchEvents } from '../events/search.events';
import { repositoriesApiEvents } from '../events/repositories.events';

export interface RepositoriesState {
  repositories: SearchRepository[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  filters: SearchRepositoryFilters;
}

const initialState: RepositoriesState = {
  repositories: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  filters: {},
};

export const RepositoriesStore = signalStore(
  withState(initialState),
  withReducer(
    on(searchEvents.repositoriesSearchTriggered, ({ payload }) => ({
      isLoading: true,
      error: null,
      filters: payload.filters,
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
        api.searchRepositories({ q: payload.query, ...payload.filters }).pipe(
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
