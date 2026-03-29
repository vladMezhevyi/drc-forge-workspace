import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchPanelTriggerComponent } from '../../components/search-panel-trigger/search-panel-trigger.component';
import { UsersViewComponent } from '../../components/users-view/users-view.component';
import { RepositoriesViewComponent } from '../../components/repositories-view/repositories-view.component';
import { SearchFacade } from '../../facades/search.facade';

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
  private readonly facade = inject(SearchFacade);

  protected readonly activeType = this.facade.activeType;
}
