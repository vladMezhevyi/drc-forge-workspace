import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchStore } from '../../store/search.store';

@Component({
  selector: 'drc-search-layout',
  imports: [RouterOutlet],
  providers: [SearchStore],
  templateUrl: './search.layout.html',
  host: {
    class: 'block container my-0 mx-auto',
  },
})
export class SearchLayout {}
