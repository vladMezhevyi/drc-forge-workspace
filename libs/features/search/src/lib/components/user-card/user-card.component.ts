import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {}
