import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { IconService } from './icon.service';
import { IconGrade, IconSize, IconWeight } from './icon.types';
import { ICON_SIZE_MAP } from './icon.constants';

const labelTransform = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

@Component({
  selector: 'drc-icon',
  template: `<ng-content />`,
  host: {
    class: 'material-symbols-outlined',
    '[style.font-size]': 'styles().size',
    '[style.font-variation-settings]': 'styles().variation',
    '[attr.aria-label]': 'label()',
    '[attr.aria-hidden]': 'isHidden()',
    '[attr.role]': 'role()',
  },
  styles: `
    :host {
      line-height: 1;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      user-select: none;
    }
  `,
})
export class DrcIcon {
  private readonly iconService = inject(IconService);

  readonly label = input<string, unknown>('', {
    transform: labelTransform,
  });
  readonly size = input<IconSize | undefined>(undefined);
  readonly filled = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly weight = input<IconWeight>(400);
  readonly grade = input<IconGrade>(0);

  constructor() {
    this.iconService.loadIcons();
  }

  protected readonly isHidden = computed<string | null>(() =>
    this.label() ? null : 'true',
  );

  protected readonly role = computed<string | null>(() =>
    this.label() ? 'img' : null,
  );

  protected readonly styles = computed(() => {
    const size = this.size();
    const sizeConfig = size ? ICON_SIZE_MAP[size] : null;

    const opsz = sizeConfig?.opsz ?? 24;
    const fill = this.filled() ? 1 : 0;
    const variation = `'FILL' ${fill}, 'wght' ${this.weight()}, 'GRAD' ${this.grade()}, 'opsz' ${opsz}`;

    return {
      variation,
      size: sizeConfig?.size ?? `var(--icon-size, var(--icon-size-default))`,
    };
  });
}
