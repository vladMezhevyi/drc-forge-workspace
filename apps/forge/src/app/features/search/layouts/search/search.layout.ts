import { afterNextRender, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SearchContextStore } from '../../stores/search-context.store';
import { RepositoriesStore } from '../../stores/repositories.store';
import { UsersStore } from '../../stores/users.store';
import { provideDispatcher } from '@ngrx/signals/events';
import { SearchType, SearchTypeSchema } from '@drc/shared/contracts';

@Component({
  selector: 'drc-search-layout',
  imports: [RouterOutlet],
  providers: [
    provideDispatcher(), // Scope search events in search feature only
    SearchContextStore,
    RepositoriesStore,
    UsersStore,
  ],
  templateUrl: './search.layout.html',
  host: {
    class: 'block container my-0 mx-auto',
  },
})
export class SearchLayout {
  private readonly route = inject(ActivatedRoute);
  private readonly searchCtx = inject(SearchContextStore);

  constructor() {
    afterNextRender({
      read: () => {
        const params = this.parseParams(this.route.snapshot.queryParams);
        if (!params) return;

        this.searchCtx.search(params.query, params.activeType);
      },
    });
  }

  private parseParams(
    params: Record<string, string | undefined>,
  ): { query: string; activeType: SearchType } | null {
    const query: string | undefined = params['q'];
    const activeType = SearchTypeSchema.safeParse(params['type']);
    if (!query || activeType.error) return null;

    return { query, activeType: activeType.data };
  }
}
