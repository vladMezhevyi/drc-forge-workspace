import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideDispatcher } from '@ngrx/signals/events';
import { SearchFacade } from '../facades/search.facade';
import { RepositoriesStore } from '../stores/repositories.store';
import { UsersStore } from '../stores/users.store';

export const provideSearch = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideDispatcher(),
    SearchFacade,
    RepositoriesStore,
    UsersStore,
    provideEnvironmentInitializer(() => {
      inject(SearchFacade);
      inject(RepositoriesStore);
      inject(UsersStore);
    }),
  ]);
};
