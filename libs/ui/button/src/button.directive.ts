import { Directive } from '@angular/core';
import { ButtonSize } from './button.types';
import { BUTTON_SIZE_MAP } from './button.constants';
import { ButtonBase } from './button';

@Directive({
  selector: 'button[drcButton], a[drcButton]',
  host: {
    type: 'button',
    '[class]': 'classes()',
    '[attr.disabled]': 'isBtnDisabled()',
    '[attr.aria-disabled]': 'isLinkDisabled()',
    '[attr.aria-busy]': 'isBusy()',
    '[attr.tabindex]': 'isLinkDisabled() ? -1 : null',
  },
})
export class DrcButton extends ButtonBase {
  readonly sizeMap: Record<ButtonSize, string> = BUTTON_SIZE_MAP;
}
