import { afterNextRender, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SearchType, SearchTypeSchema } from '@drc/shared/contracts';
import { SearchFacade } from '../../facades/search.facade';

@Component({
  selector: 'drc-search-layout',
  imports: [RouterOutlet],
  templateUrl: './search.layout.html',
  host: {
    class: 'block container my-0 mx-auto',
  },
})
export class SearchLayout {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(SearchFacade);

  constructor() {
    afterNextRender({
      read: () => {
        const params = this.parseParams(this.route.snapshot.queryParams);
        if (!params) return;

        this.facade.search(params.query, params.activeType);
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
