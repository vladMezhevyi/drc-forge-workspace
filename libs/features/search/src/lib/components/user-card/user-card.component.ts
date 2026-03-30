import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SearchUser } from '@drc/shared/contracts';

@Component({
  selector: 'drc-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  readonly user = input.required<SearchUser>();
}
