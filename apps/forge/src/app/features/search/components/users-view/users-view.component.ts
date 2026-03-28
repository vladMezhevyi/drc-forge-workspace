import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'drc-users-view',
  imports: [],
  templateUrl: './users-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersViewComponent {}
