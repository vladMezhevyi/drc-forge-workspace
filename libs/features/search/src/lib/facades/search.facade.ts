import {
  SearchRepositoryFilters,
  SearchType,
  SearchUsersFilters,
} from '@drc/shared/contracts';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { injectDispatch } from '@ngrx/signals/events';
import { searchEvents } from '../events/search.events';
import { computed } from '@angular/core';

export interface SearchFacadeState {
  query: string;
  activeType: SearchType;
}

const initialState: SearchFacadeState = {
  query: '',
  activeType: 'repositories',
};

export const SearchFacade = signalStore(
  withState(initialState),
  withProps(() => ({
    dispatch: injectDispatch(searchEvents),
  })),
  withComputed((store) => ({
    hasQuery: computed(() => store.query().trim().length > 0),
    trimmedQuery: computed(() => store.query().trim()),
  })),
  withMethods(({ dispatch, ...store }) => ({
    search<F>(query: string, activeType: SearchType, filters?: F): void {
      if (!query.trim()) return;

      patchState(store, { query, activeType });
      this._dispatch(filters);
    },
    applyRepositoryFilters(filters: SearchRepositoryFilters): void {
      dispatch.repositoriesSearchTriggered({
        query: store.trimmedQuery(),
        filters,
      });
    },
    applyUserFilters(filters: SearchUsersFilters): void {
      dispatch.usersSearchTriggered({
        query: store.trimmedQuery(),
        filters,
      });
    },
    _dispatch<F>(filters?: F): void {
      const query = store.trimmedQuery();
      const activeType = store.activeType();

      switch (activeType) {
        case 'repositories': {
          dispatch.repositoriesSearchTriggered({
            query,
            filters: filters || {},
          });
          break;
        }
        case 'users': {
          dispatch.usersSearchTriggered({ query, filters: filters || {} });
          break;
        }
      }
    },
  })),
);
