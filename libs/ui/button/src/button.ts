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
  BUTTON_VARIANT_MAP,
} from './button.constants';

@Directive()
export abstract class ButtonBase {
  protected readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly variant = input<ButtonVariant>('filled');
  readonly severity = input<ButtonSeverity>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly loading = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  abstract readonly sizeMap: Record<ButtonSize, string>;

  protected readonly isLink =
    this.hostEl.nativeElement.tagName.toLowerCase() === 'a';

  protected readonly isDisabled = computed<boolean>(
    () => this.disabled() || this.loading(),
  );

  protected readonly isBtnDisabled = computed<boolean | null>(
    () => (this.isDisabled() && !this.isLink) || null,
  );

  protected readonly isLinkDisabled = computed<string | null>(() =>
    this.isDisabled() && this.isLink ? 'true' : null,
  );

  protected readonly isBusy = computed<string | null>(() =>
    this.loading() ? 'true' : null,
  );

  protected readonly classes = computed<string>(() =>
    [
      BUTTON_BASE,
      this.sizeMap[this.size()],
      BUTTON_VARIANT_MAP[this.severity()][this.variant()],
      this.isDisabled() ? BUTTON_DISABLED : 'cursor-pointer',
    ].join(' '),
  );
}
