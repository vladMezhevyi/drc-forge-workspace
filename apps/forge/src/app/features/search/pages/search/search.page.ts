import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchListComponent } from '../../components/search-list/search-list.component';
import { SearchPanelTriggerComponent } from '../../components/search-panel-trigger/search-panel-trigger.component';
import { RepositoriesStore } from '../../stores/repositories.store';
import { UsersStore } from '../../stores/users.store';

@Component({
  selector: 'drc-search-page',
  imports: [SearchPanelTriggerComponent, SearchListComponent],
  templateUrl: './search.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block p-4',
  },
})
export class SearchPage {
  private readonly repositoriesStore = inject(RepositoriesStore);
  private readonly usersStore = inject(UsersStore);
}
