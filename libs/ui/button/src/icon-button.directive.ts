import { afterEveryRender, Directive, isDevMode } from '@angular/core';
import { ButtonBase } from './button';
import { ButtonSize } from './button.types';
import { ICON_BUTTON_SIZE_MAP } from './button.constants';

@Directive({
  selector: 'button[drcIconButton], a[drcIconButton]',
  host: {
    type: 'button',
    '[class]': 'classes()',
    '[attr.disabled]': 'isBtnDisabled()',
    '[attr.aria-disabled]': 'isLinkDisabled()',
    '[attr.aria-busy]': 'isBusy()',
    '[attr.tabindex]': 'isLinkDisabled() ? -1 : null',
  },
})
export class DrcIconButton extends ButtonBase {
  readonly sizeMap: Record<ButtonSize, string> = ICON_BUTTON_SIZE_MAP;

  constructor() {
    super();

    // Verify that icon button has aria-label attribute
    afterEveryRender({ read: () => this.verifyAriaLabel() });
  }

  private verifyAriaLabel(): void {
    const el = this.hostEl.nativeElement;
    if (!isDevMode() || !el) return;

    const hasLabel =
      el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');

    if (!hasLabel) {
      const tagName = el.tagName.toLowerCase();
      const displayEl = `<${tagName}>${el.textContent}</${tagName}>`;

      console.warn(
        `[DrcIconButton] Missing a11y label. Add aria-label or aria-labelledby to ${displayEl}`,
      );
    }
  }
}
