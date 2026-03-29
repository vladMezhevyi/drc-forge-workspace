import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchPanelTriggerComponent } from '../../components/search-panel-trigger/search-panel-trigger.component';

@Component({
  selector: 'drc-search-landing-page',
  imports: [SearchPanelTriggerComponent],
  templateUrl: './search-landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid place-items-center h-screen',
  },
})
export class SearchLandingPage {}
