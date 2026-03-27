import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { SearchStore } from '../../store/search.store';
import { SearchType } from '@drc/shared/contracts';

@Component({
  selector: 'drc-search-page',
  templateUrl: './search.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage {
  private readonly store = inject(SearchStore);

  readonly q = input<string | undefined>(undefined);
  readonly type = input<SearchType | undefined>(undefined);

  protected readonly isLoading = this.store.isLoading;
  protected readonly isEmpty = this.store.isEmpty;
  protected readonly repositories = this.store.repositories;
  protected readonly users = this.store.users;
  protected readonly activeType = this.store.activeType;
  protected readonly error = this.store.error;

  constructor() {
    // Search on URL changes
    effect(() => {
      const query = this.q();
      const type = this.type() || 'repositories';
      if (!query) return;

      this.store.search(query, type);
    });
  }
}
