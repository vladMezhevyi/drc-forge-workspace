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
import { DrcInput } from '@drc/ui/input';

let nextId = 0;

type SelectValue = string | number | boolean | null;

type OptionLabelFn<T> = (item: T) => string;
type OptionValueFn<T> = (item: T) => SelectValue;

type OnChangeFn = (value: SelectValue) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'drc-select',
  imports: [CdkOverlayOrigin, CdkConnectedOverlay, NgTemplateOutlet, DrcInput],
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

  protected readonly itemTemplate =
    contentChild<TemplateRef<{ $implicit: T; item: T; index: number }>>('item');

  protected readonly panelId = computed<string>(() => `${this.id()}-panel`);

  protected readonly isOpen = signal<boolean>(false);
  protected readonly isDisabled = linkedSignal<boolean>(() => this.disabled());

  readonly value = model<SelectValue>(null);

  protected readonly selectedItem = computed<T | null>(() =>
    this.getItemByValue(this.value()),
  );

  protected readonly inputValue = linkedSignal<SelectValue, string>({
    source: this.value,
    computation: (next, prev) => {
      if (prev?.source !== next) {
        const item = this.getItemByValue(next);
        return item === null ? '' : this.resolveLabel(item);
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

  protected onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;

    this.inputValue.set(value);
    this.inputChange.emit(value);

    if (!this.isOpen()) {
      this.open();
    }
  }

  protected onBlur(): void {
    if (!this.isOpen()) {
      this.onTouched();
    }
  }

  // Suggestion Item Methods
  protected selectItem(item: T): void {
    const value = this.resolveValue(item);
    this.setValue(value);
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
    if (!selected && this.forceSelection()) {
      const inputValue = this.inputValue();
      const item = this.getItemByLabel(inputValue);

      if (!item) {
        this.setValue(null);
      } else if (!this.isSelected(item)) {
        const value = this.resolveValue(item);
        this.setValue(value);
      }
    }

    this.isOpen.set(false);
    this.onTouched();
  }

  protected onDetach(): void {
    if (!this.isOpen()) return;
    this.close();
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
  private setValue(value: SelectValue): void {
    this.value.set(value);
    this.onChange(value);
  }

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

  private getItemByValue(value: SelectValue): T | null {
    return (
      this.suggestions().find((item) => this.resolveValue(item) === value) ??
      null
    );
  }

  private getItemByLabel(label: string): T | null {
    return (
      this.suggestions().find(
        (item) =>
          this.resolveLabel(item).toLowerCase() === label.trim().toLowerCase(),
      ) ?? null
    );
  }
}
