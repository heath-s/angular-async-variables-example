import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { stringify } from 'qs';

import { environment } from 'src/environments/environment';

const API_PREFIX = environment.constants.API_PREFIX;

interface BaseApiRequestUrl {
  url: string;
  query?: { [key: string]: any };
}

@Injectable()
export class BaseApiService {
  constructor(public http: HttpClient) { }

  protected delete<T>({ url = '', query = {} }: BaseApiRequestUrl, options: any = {}): Observable<T> {
    const q = this.getQueryString(query);
    return this.http
      .delete<T>(
        `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
        Object.assign({}, this.REQUEST_OPTIONS, options)
      )
      .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
  }

  protected get<T>({ url = '', query = {} }: BaseApiRequestUrl, options: any = {}): Observable<T> {
    const q = this.getQueryString(query);
    return this.http
      .get<T>(
        `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
        Object.assign({}, this.REQUEST_OPTIONS, options)
      )
      .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
  }

  protected post<T>({ url = '', query = {} }: BaseApiRequestUrl, body = {}, options: any = {}): Observable<T> {
    const q = this.getQueryString(query);
    return this.http
      .post<T>(
        `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
        body,
        Object.assign({}, this.REQUEST_OPTIONS, options)
      )
      .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
  }

  protected put<T>({ url = '', query = {} }: BaseApiRequestUrl, body = {}, options: any = {}): Observable<T> {
    const q = this.getQueryString(query);
    return this.http
      .put<T>(
        `${API_PREFIX}${url}${q ? `?${q}` : ''}`,
        body,
        Object.assign({}, this.REQUEST_OPTIONS, options)
      )
      .pipe(map((response: HttpResponse<T>) => this.handleResponse<T>(response)));
  }

  private getQueryString(query: any): string {
    return stringify(query, { arrayFormat: 'bracket' });
  }

  private handleResponse<T>(response): T {
    return response.body;
  }

  private get REQUEST_OPTIONS(): { headers: HttpHeaders, observe: string } {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response'
    };
  }
}
