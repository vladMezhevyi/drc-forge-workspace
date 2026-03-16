import { Component } from '@angular/core';
import { DrcButton } from '@drc/ui/button';
import { DrcIcon } from '@drc/ui/icon';
import { DrcInput } from '@drc/ui/input';

@Component({
  imports: [DrcButton, DrcIcon, DrcInput],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected title = 'forge';
}
