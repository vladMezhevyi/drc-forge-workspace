import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchHeaderComponent } from '../../components/search-header/search-header.component';
import { SearchStore } from '../../store/search.store';

@Component({
  selector: 'drc-search-layout',
  imports: [RouterOutlet, SearchHeaderComponent],
  providers: [SearchStore],
  templateUrl: './search.layout.html',
})
export class SearchLayout {}
