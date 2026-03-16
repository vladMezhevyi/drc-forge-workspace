import {
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import {
  INPUT_BASE,
  INPUT_DISABLED,
  INPUT_FOCUSED,
  INPUT_IDLE,
  INPUT_INVALID,
} from './input.constants';

@Directive({
  selector: 'input[drcInput], textarea[drcInput]',
  host: {
    '[class]': 'classes()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '[attr.aria-invalid]': 'isInvalid()',
  },
})
export class DrcInput {
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  readonly invalid = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  // Error
  private readonly controlInvalid = signal<boolean>(false);
  readonly isInvalid = computed<boolean>(
    () => this.invalid() || this.controlInvalid(),
  );

  // Disable
  private controlDisabled = signal<boolean>(false);
  readonly isDisabled = computed<boolean>(
    () => this.disabled() || this.controlDisabled(),
  );

  // Input state
  private readonly focused = signal<boolean>(false);

  // Classes
  protected readonly classes = computed<string>(() => {
    const focused = this.focused();
    const invalid = this.isInvalid();
    const disabled = this.isDisabled();

    const classes: string[] = [INPUT_BASE];

    if (disabled) {
      classes.push(INPUT_DISABLED);
    } else if (invalid) {
      classes.push(INPUT_INVALID);
    } else if (focused) {
      classes.push(INPUT_FOCUSED);
    } else {
      classes.push(INPUT_IDLE);
    }

    return classes.join(' ');
  });

  constructor() {
    this.setupStatusChanges();

    effect(() => console.log('IsInvalid: ', this.isInvalid()));
    effect(() => console.log('IsDisabled: ', this.isDisabled()));
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
  }

  private setupStatusChanges(): void {
    const control = this.ngControl?.control;
    if (!control) return;

    control.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef), startWith(control.status))
      .subscribe((status) => {
        this.controlInvalid.set(control.invalid && control.touched);
        this.controlDisabled.set(status === 'DISABLED');
      });
  }
}
