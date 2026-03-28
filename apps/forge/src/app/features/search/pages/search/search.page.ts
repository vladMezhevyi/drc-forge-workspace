import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchPanelTriggerComponent } from '../../components/search-panel-trigger/search-panel-trigger.component';
import { RepositoriesStore } from '../../stores/repositories.store';
import { UsersStore } from '../../stores/users.store';
import { UsersViewComponent } from '../../components/users-view/users-view.component';
import { RepositoriesViewComponent } from '../../components/repositories-view/repositories-view.component';
import { SearchContextStore } from '../../stores/search-context.store';

@Component({
  selector: 'drc-search-page',
  imports: [
    SearchPanelTriggerComponent,
    UsersViewComponent,
    RepositoriesViewComponent,
  ],
  templateUrl: './search.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block p-4',
  },
})
export class SearchPage {
  private readonly repositoriesStore = inject(RepositoriesStore);
  private readonly usersStore = inject(UsersStore);
  private readonly searchCtx = inject(SearchContextStore);

  protected readonly activeType = this.searchCtx.activeType;
}
