import { computed } from '@angular/core';
import { SearchType } from '@drc/shared/contracts';
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

export interface SearchContextState {
  query: string;
  activeType: SearchType;
}

const initialState: SearchContextState = {
  query: '',
  activeType: 'repositories',
};

export const SearchContextStore = signalStore(
  withState(initialState),
  withProps(() => ({
    dispatch: injectDispatch(searchEvents),
  })),
  withComputed((store) => ({
    hasQuery: computed(() => store.query().trim().length > 0),
    trimmedQuery: computed(() => store.query().trim()),
  })),
  withMethods(({ dispatch, ...store }) => ({
    search(query: string, activeType: SearchType): void {
      if (!query) return;

      patchState(store, { query, activeType });

      switch (activeType) {
        case 'repositories': {
          dispatch.repositoriesSearchTriggered(query);
          break;
        }
        case 'users': {
          dispatch.usersSearchTriggered(query);
          break;
        }
      }
    },
  })),
);
