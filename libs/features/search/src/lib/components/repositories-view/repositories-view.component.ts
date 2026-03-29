import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RepositoriesFiltersComponent } from '../repositories-filters/repositories-filters.component';
import { RepositoriesStore } from '../../stores/repositories.store';
import { SearchRepositoryFilters } from '@drc/shared/contracts';
import { SearchFacade } from '../../facades/search.facade';

@Component({
  selector: 'drc-repositories-view',
  imports: [RepositoriesFiltersComponent],
  templateUrl: './repositories-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepositoriesViewComponent {
  private readonly store = inject(RepositoriesStore);
  private readonly facade = inject(SearchFacade);

  protected readonly query = this.facade.trimmedQuery;
  protected readonly isLoading = this.store.isLoading;
  protected readonly error = this.store.error;
  protected readonly repositories = this.store.repositories;
  protected readonly totalCount = this.store.totalCount;

  protected onFiltersChange(filters: SearchRepositoryFilters): void {
    this.facade.applyRepositoryFilters(filters);
  }
}
