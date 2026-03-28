import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  ElementRef,
  inject,
  linkedSignal,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { DrcInput } from '@drc/ui/input';
import { SearchType } from '@drc/shared/contracts';
import { FormsModule } from '@angular/forms';
import { DrcIcon } from '@drc/ui/icon';
import { Router } from '@angular/router';
import { SearchContextStore } from '../../stores/search-context.store';

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
    tabindex: '-1',
    role: 'dialog',
    'aria-label': 'Search panel',
    '(keydown)': 'onOverlayKeydown($event)',
  },
})
export class SearchPanelComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly store = inject(SearchContextStore);

  readonly closeOverlay = output<void>();

  protected readonly isLoading = computed<boolean>(() => false); // TODO: Listen to actual loading event
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

  private readonly buttonEls =
    viewChildren<ElementRef<HTMLButtonElement>>('searchBtn');
  private readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private readonly focusableEls = computed<HTMLElement[]>(() => {
    const isLoading = this.isLoading();

    const elements: HTMLElement[] = [
      this.inputEl().nativeElement,
      ...this.buttonEls().map((el) => el.nativeElement),
    ];

    return isLoading ? [] : elements;
  });

  protected onOverlayKeydown(e: KeyboardEvent): void {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

    e.preventDefault();
    this.navigate(e.key === 'ArrowDown' ? 1 : -1);
  }

  protected onInputEnter(e: Event): void {
    e.preventDefault();

    const query = this.query();
    const type = this.store.activeType();
    if (!query) return;

    this.search(query, type);
    this.close();
  }

  protected onSearch(type: SearchType): void {
    const query = this.query();
    if (!query) return;

    this.search(query, type);
    this.close();
  }

  private search(query: string, type: SearchType): void {
    this.store.search(query, type);
    this.router.navigate(['/search'], {
      replaceUrl: true,
      queryParams: { q: query, type },
    });
  }

  private navigate(direction: 1 | -1): void {
    const elements = this.focusableEls();

    const focusedIndex = elements.indexOf(
      this.document.activeElement as HTMLElement,
    );
    const next =
      focusedIndex === -1
        ? 0
        : (focusedIndex + direction + elements.length) % elements.length;

    elements[next]?.focus();
  }

  protected close(): void {
    this.closeOverlay.emit();
  }
}
