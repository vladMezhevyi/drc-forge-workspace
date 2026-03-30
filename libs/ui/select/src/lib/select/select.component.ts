import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  forwardRef,
  input,
  linkedSignal,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';

let nextId = 0;

type SelectValue = string | number | boolean | null;

type OptionLabelFn<T> = (item: T) => string;
type OptionValueFn<T> = (item: T) => SelectValue;

type OnChangeFn = (value: SelectValue) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'drc-select',
  imports: [CdkOverlayOrigin, CdkConnectedOverlay, NgTemplateOutlet],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DrcSelect),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block relative',
  },
})
export class DrcSelect<T = any> implements ControlValueAccessor {
  readonly suggestions = input<T[]>([]);
  readonly id = input<string>(`drc-select-${nextId++}`);
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly optionLabel = input<string | OptionLabelFn<T>>('label');
  readonly optionValue = input<string | OptionValueFn<T>>('value');
  readonly forceSelection = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  readonly inputChange = output<string>();

  protected readonly itemTemplate = contentChild<TemplateRef<unknown>>('item');

  protected readonly panelId = computed<string>(() => `${this.id()}-panel`);

  protected readonly isOpen = signal<boolean>(false);
  protected readonly isDisabled = linkedSignal<boolean>(() => this.disabled());

  readonly value = model<SelectValue>(null);

  protected readonly inputValue = linkedSignal<SelectValue, string>({
    source: this.value,
    computation: (next, prev) => {
      if (prev?.source !== next) {
        const item = this.suggestions().find(
          (item) => this.resolveValue(item) === next,
        );
        return item === undefined ? '' : this.resolveLabel(item);
      }

      return prev.value;
    },
  });

  private onChange: OnChangeFn = () => {};
  private onTouched: OnTouchedFn = () => {};

  constructor() {
    effect(() =>
      console.log({
        inputValue: this.inputValue(),
        value: this.value(),
      }),
    );
  }

  // Input Events
  protected onFocus(): void {
    this.open();
  }

  protected onBlur(): void {
    if (!this.isOpen()) {
      this.onTouched();
    }
  }

  protected onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;

    this.inputValue.set(value);
    this.inputChange.emit(value);

    if (!this.isOpen()) {
      this.open();
    }
  }

  // Suggestion Item Methods
  protected selectItem(item: T): void {
    const value = this.resolveValue(item);
    this.value.set(value);
    this.onChange(value);
    this.close(true);
  }

  protected isSelected(item: T): boolean {
    return this.resolveValue(item) === this.value();
  }

  // Overlay Methods
  protected open(): void {
    if (this.isDisabled()) return;
    this.isOpen.set(true);
  }

  protected close(selected = false): void {
    if (this.isDisabled()) return;

    this.isOpen.set(false);
    this.onTouched();
  }

  // Control Value Accessor Methods
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  writeValue(item: SelectValue | null): void {
    this.value.set(item);
  }

  registerOnChange(fn: OnChangeFn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  // Helpers
  protected resolveValue(item: T): SelectValue {
    const accessor = this.optionValue();
    if (typeof accessor === 'function') return accessor(item);
    return (item as Record<string, SelectValue>)[accessor];
  }

  protected resolveLabel(item: T): string {
    const accessor = this.optionLabel();
    if (typeof accessor === 'function') return accessor(item);

    const label = (item as Record<string, unknown>)[accessor];
    return String(label);
  }
}
