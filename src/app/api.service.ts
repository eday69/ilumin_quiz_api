import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '@environment/environment.ts';

// import { environment } from '@environments/environment';

export interface RequestOptions {
  headers: HttpHeaders;
  params?: HttpParams;
  body?: any;
  observe?: any;
}

export const HTTP_DELETE = 'delete';
export const HTTP_GET = 'get';
export const HTTP_POST = 'post';
export const HTTP_PUT = 'put';


@Injectable({ providedIn: 'root' })
export class ApiService {
  http: HttpClient;
  headers: HttpHeaders;
  private environment = environment;

  constructor(http: HttpClient ) {
    this.http = http;
    this.setApiOptions();
  }

  setApiOptions() {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json');
  }

  getResponse(httpObservable: Observable<any>, httpMethod: string, url: string): Observable<any> {
    return httpObservable.pipe(
      map(
        (res: any) => {
          if (res) {
            return res.body;
          } else {
            return undefined;
          }
        }
      ),
      catchError(e => this.handleError(e, url))
    );
  }

  makeRequest(url: string, httpMethod: string, requestOptions?: RequestOptions, requestBody?: object): Observable<any> {
    url = this.environment.apiUrl + ':' + this.environment.apiPort + url;
    let httpObservable: Observable<any>;

    if (!requestOptions) {
      requestOptions = this.buildRequestOptions();
    }

    requestOptions.observe = 'response';
    switch (httpMethod) {
      case HTTP_GET:
        httpObservable = this.http.get(url, requestOptions);
        break;
      case HTTP_DELETE:
        requestOptions.body = requestBody;
        httpObservable = this.http.delete(url, requestOptions);
        break;
      case HTTP_POST:
        httpObservable = this.http.post(url, requestBody, requestOptions);
        break;
      case HTTP_PUT:
        httpObservable = this.http.put(url, requestBody, requestOptions);
        break;
    }

    return this.getResponse(httpObservable, httpMethod, url);
  }

  buildRequestOptions(params: any = null, headers: HttpHeaders = null): RequestOptions {
    return {
      headers: headers ? headers : this.headers,
      params
    };
  }

  handleError(error: any, url: string) {
    console.error(error.error.message);
    return throwError(error);
  }

  toURLSearchParams(params: { [id: string]: string }) {
    const urlSearchParams = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        urlSearchParams.set(key, params[key]);
      }
    }
    return urlSearchParams;
  }

  postParams(params: { [id: string]: string }): string {
    let postParams = '';
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        postParams = postParams + key + '=' + encodeURIComponent(params[key]) + '&';
      }
    }
    return postParams;
  }
}
