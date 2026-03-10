import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { ButtonSeverity, ButtonSize, ButtonVariant } from './button.types';

@Directive({
  selector: 'button[drcButton], a[drcButton]',
  host: {
    '[attr.disabled]': 'isBtnDisabled()',
    '[attr.aria-disabled]': 'isLinkDisabled()',
  },
})
export class DrcButton {
  private readonly hostEl = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly variant = input<ButtonVariant>('filled', { alias: 'drcButton' });
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
}
