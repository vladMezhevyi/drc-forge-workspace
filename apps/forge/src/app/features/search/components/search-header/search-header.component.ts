import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { DrcButton } from '@drc/ui/button';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SearchPanelComponent } from '../search-panel/search-panel.component';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'drc-search-header',
  imports: [PortalModule, A11yModule, DrcButton, SearchPanelComponent],
  templateUrl: './search-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchHeaderComponent {
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);

  private readonly portal = viewChild.required(CdkPortal);
  private overlayRef: OverlayRef | null = null;

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
