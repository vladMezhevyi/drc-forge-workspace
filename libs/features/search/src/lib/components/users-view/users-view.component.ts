import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UsersStore } from '../../stores/users.store';
import { SearchFacade } from '../../facades/search.facade';
import { SearchUsersFilters } from '@drc/shared/contracts';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'drc-users-view',
  imports: [UserCardComponent],
  templateUrl: './users-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersViewComponent {
  private readonly store = inject(UsersStore);
  private readonly facade = inject(SearchFacade);

  protected readonly query = this.facade.trimmedQuery;
  protected readonly isLoading = this.store.isLoading;
  protected readonly error = this.store.error;
  protected readonly users = this.store.users;
  protected readonly totalCount = this.store.totalCount;

  protected onFiltersChange(filters: SearchUsersFilters): void {
    this.facade.applyUserFilters(filters);
  }
}
