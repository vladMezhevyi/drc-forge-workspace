import { Component } from '@angular/core';
import { DrcButton } from '@drc/ui/button';
import { DrcIcon } from '@drc/ui/icon';

@Component({
  imports: [DrcButton, DrcIcon],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected title = 'forge';
}
