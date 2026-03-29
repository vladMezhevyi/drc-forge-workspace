import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  SearchRepositoriesQueryParams,
  SearchRepositoriesResponse,
  SearchUsersQueryParams,
  SearchUsersResponse,
} from '@drc/shared/contracts';
import { Observable } from 'rxjs';
import { SEARCH_ENDPOINTS } from './search.endpoints';

@Injectable({
  providedIn: 'root',
})
export class SearchApi {
  private readonly http = inject(HttpClient);

  searchRepositories(
    params: SearchRepositoriesQueryParams,
  ): Observable<SearchRepositoriesResponse> {
    let httpParams = new HttpParams().set('q', params.q);

    if (params.order) httpParams = httpParams.set('order', params.order);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('perPage', params.perPage);

    return this.http.get<SearchRepositoriesResponse>(
      SEARCH_ENDPOINTS.repositories,
      { params: httpParams },
    );
  }

  searchUsers(params: SearchUsersQueryParams): Observable<SearchUsersResponse> {
    let httpParams = new HttpParams().set('q', params.q);

    if (params.order) httpParams = httpParams.set('order', params.order);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('perPage', params.perPage);

    return this.http.get<SearchUsersResponse>(SEARCH_ENDPOINTS.users, {
      params: httpParams,
    });
  }
}
