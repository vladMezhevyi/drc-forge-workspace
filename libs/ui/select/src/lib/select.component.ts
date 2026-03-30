import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DOCUMENT,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
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
  private readonly document = inject(DOCUMENT);

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
  readonly maxHeight = input<string>('240px');

  readonly inputChange = output<string>();

  private readonly containerRef =
    viewChild.required<ElementRef<HTMLElement>>('containerRef');

  protected readonly itemTemplate =
    contentChild<TemplateRef<{ $implicit: T; item: T; index: number }>>('item');
  protected readonly emptyTemplate =
    contentChild<TemplateRef<unknown>>('empty');

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
      console.log('[Computation]', { prev, next });

      if (prev?.source !== next) {
        const item = this.getItemByValue(next);
        return item === null ? '' : this.resolveLabel(item);
      }

      return prev.value;
    },
  });

  protected readonly activeIndex = signal<number>(-1);

  protected readonly containerWidth = signal<number>(0);

  private onChange: OnChangeFn = () => {};
  private onTouched: OnTouchedFn = () => {};

  constructor() {
    effect(() => console.log('[Value]', this.value()));
    effect(() => console.log('[Input Value]', this.inputValue()));

    // Scroll item into view
    afterRenderEffect({
      read: () => {
        const index = this.activeIndex();
        if (index < 0 || !this.isOpen()) return;

        const id = this.buildItemId(index);
        this.document.getElementById(id)?.scrollIntoView({ block: 'nearest' });
      },
    });
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

  protected onKeydown(e: KeyboardEvent): void {
    const total = this.suggestions().length;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();

        if (!this.isOpen()) {
          this.isOpen.set(true);
        }

        this.activeIndex.update((prev) => (prev + 1) % total);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();

        if (!this.isOpen()) {
          this.isOpen.set(true);
        }

        this.activeIndex.update((prev) => (prev <= 0 ? total - 1 : prev - 1));
        break;
      }
      case 'Enter': {
        e.preventDefault();

        if (!this.isOpen()) return;

        const item = this.suggestions()[this.activeIndex()];
        if (item) {
          this.selectItem(item);
        }

        break;
      }
      case 'Home': {
        if (this.isOpen()) {
          e.preventDefault();
          this.activeIndex.set(0);
        }

        break;
      }
      case 'End': {
        if (this.isOpen()) {
          e.preventDefault();
          this.activeIndex.set(total - 1);
        }

        break;
      }
    }
  }

  // Suggestion Item Methods
  protected selectItem(item: T): void {
    const value = this.resolveValue(item);
    this.setValue(value);
    this.close();
  }

  protected isSelected(item: T): boolean {
    return this.resolveValue(item) === this.value();
  }

  protected isItemDisabled(item: T): boolean {
    return (item as Record<string, unknown>)['disabled'] === true;
  }

  protected buildItemId(index: number): string {
    return `${this.id()}-item-${index}`;
  }

  // Overlay Methods
  protected open(): void {
    if (this.isDisabled()) return;

    const width = this.containerRef().nativeElement.offsetWidth;
    this.containerWidth.set(width);

    this.activeIndex.set(-1);
    this.isOpen.set(true);
  }

  protected close(): void {
    if (this.forceSelection()) {
      const inputValue = this.inputValue();
      const item = this.getItemByLabel(inputValue);

      console.log('Item: ', item);

      if (!item) {
        this.setValue(null);
        this.inputValue.set('');
      } else if (!this.isSelected(item)) {
        const value = this.resolveValue(item);
        const label = this.resolveLabel(item);
        this.setValue(value);
        this.inputValue.set(label);
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
