import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  output,
} from '@angular/core';
import { DrcInput } from '@drc/ui/input';
import { SearchStore } from '../../store/search.store';
import { SearchType } from '@drc/shared/contracts';
import { FormsModule } from '@angular/forms';
import { DrcIcon } from '@drc/ui/icon';
import { Router } from '@angular/router';

interface SearchAction {
  label: string;
  icon: string;
  type: SearchType;
}

@Component({
  selector: 'drc-search-panel',
  imports: [DrcInput, FormsModule, DrcIcon],
  templateUrl: './search-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block w-full p-6 bg-neutral-50 border border-primary-400 rounded-xs',
  },
})
export class SearchPanelComponent {
  private readonly store = inject(SearchStore);
  private readonly router = inject(Router);

  readonly closeOverlay = output<void>();

  protected readonly isLoading = this.store.isLoading;
  protected readonly query = linkedSignal<string>(
    () => this.store.query() || '',
  );

  protected readonly actions: SearchAction[] = [
    {
      label: 'Search repositories for',
      icon: 'folder_code',
      type: 'repositories',
    },
    {
      label: 'Search users for',
      icon: 'group',
      type: 'users',
    },
  ];

  protected onSearch(type: SearchType): void {
    const query = this.query();
    if (!query) return;

    this.router.navigate(['/search'], { queryParams: { q: query, type } });
    this.close();
  }

  protected close(): void {
    this.closeOverlay.emit();
  }
}
