import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SearchPanelComponent } from '../search-panel/search-panel.component';
import { A11yModule } from '@angular/cdk/a11y';
import { DrcIcon } from '@drc/ui/icon';
import { SearchStore } from '../../store/search.store';

@Component({
  selector: 'drc-search-panel-trigger',
  imports: [PortalModule, A11yModule, SearchPanelComponent, DrcIcon],
  templateUrl: './search-panel-trigger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPanelTriggerComponent {
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(SearchStore);

  private readonly portal = viewChild.required(CdkPortal);
  private overlayRef: OverlayRef | null = null;

  protected readonly placeholder = computed<string>(
    () => this.store.query() || 'Search',
  );

  protected show(): void {
    if (this.overlayRef) {
      this.close();
    }

    const margin = 16;
    const offset = `${margin}px`;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .top(offset)
        .left(offset),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: `calc(100% - ${margin * 2}px)`,
      hasBackdrop: true,
    });

    // Show overlay
    this.overlayRef.attach(this.portal());

    // Hide overlay on backdrop click
    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.close());

    // Hide overlay on Esc
    this.overlayRef
      .keydownEvents()
      .pipe(
        filter((e) => e.key === 'Escape'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.close());
  }

  protected close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
