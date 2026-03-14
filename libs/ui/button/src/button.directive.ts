import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { ButtonSeverity, ButtonSize, ButtonVariant } from './button.types';
import {
  BUTTON_BASE,
  BUTTON_DISABLED,
  BUTTON_SIZE_MAP,
  BUTTON_VARIANT_MAP,
} from './button.constants';

@Directive({
  selector: 'button[drcButton], a[drcButton]',
  host: {
    type: 'button',
    '[class]': 'classes()',
    '[attr.disabled]': 'isBtnDisabled()',
    '[attr.aria-disabled]': 'isLinkDisabled()',
  },
})
export class DrcButton {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly variant = input<ButtonVariant>('filled');
  readonly severity = input<ButtonSeverity>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly isLink =
    this.hostEl.nativeElement.tagName.toLowerCase() === 'a';

  protected readonly isBtnDisabled = computed<boolean | null>(
    () => (this.disabled() && !this.isLink) || null,
  );

  protected readonly isLinkDisabled = computed<string | null>(() =>
    this.disabled() && this.isLink ? 'true' : null,
  );

  protected readonly classes = computed<string>(() =>
    [
      BUTTON_BASE,
      BUTTON_SIZE_MAP[this.size()],
      BUTTON_VARIANT_MAP[this.severity()][this.variant()],
      this.disabled() ? BUTTON_DISABLED : 'cursor-pointer',
    ].join(' '),
  );
}
