import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { UsersStore } from '../../stores/users.store';
import { SearchFacade } from '../../facades/search.facade';

@Component({
  selector: 'drc-users-view',
  imports: [],
  templateUrl: './users-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersViewComponent {
  private readonly store = inject(UsersStore);
  private readonly facade = inject(SearchFacade);

  constructor() {
    effect(() => console.log(this.store.isLoading()));
  }
}
