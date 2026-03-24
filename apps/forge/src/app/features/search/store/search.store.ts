import { computed, inject } from '@angular/core';
import {
  SearchRepositoriesResponse,
  SearchType,
  SearchUsersResponse,
} from '@drc/shared/contracts';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SearchApi } from '../../../core/api/search/search.api';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface SearchState {
  query: string;
  activeType: SearchType;
  repositories: SearchRepositoriesResponse['items'];
  users: SearchUsersResponse['items'];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  activeType: 'repositories',
  repositories: [],
  users: [],
  isLoading: false,
  error: null,
};

export const SearchStore = signalStore(
  withState(initialState),
  withComputed(({ activeType, repositories, users, isLoading, error }) => ({
    isEmpty: computed(() => {
      const array = activeType() === 'repositories' ? repositories() : users();
      return !isLoading() && !array.length;
    }),
    hasError: computed(() => error() !== null),
  })),
  withMethods((store, api = inject(SearchApi)) => ({
    search(query: string, type: SearchType): void {
      const handlers: Record<SearchType, () => void> = {
        repositories: () => this.searchRepositories(query),
        users: () => this.searchUsers(query),
      };

      handlers[type]();
    },
    searchRepositories: rxMethod<string>(
      pipe(
        tap((query) =>
          patchState(store, {
            query,
            activeType: 'repositories',
            isLoading: true,
            error: null,
          }),
        ),
        switchMap((query) =>
          api.searchRepositories({ q: query }).pipe(
            tap((response) =>
              patchState(store, {
                repositories: response.items || [],
                isLoading: false,
              }),
            ),
            catchError((error: HttpErrorResponse) => {
              patchState(store, { isLoading: false, error: error.message });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
    searchUsers: rxMethod<string>(
      pipe(
        tap((query) =>
          patchState(store, {
            query,
            activeType: 'users',
            isLoading: true,
            error: null,
          }),
        ),
        switchMap((query) =>
          api.searchUsers({ q: query }).pipe(
            tap((response) =>
              patchState(store, {
                users: response.items || [],
                isLoading: false,
              }),
            ),
            catchError((error: HttpErrorResponse) => {
              patchState(store, { isLoading: false, error: error.message });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
);
