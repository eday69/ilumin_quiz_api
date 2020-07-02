import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, HTTP_GET, HTTP_POST, HTTP_PUT} from './api.service';

@Injectable({
  providedIn: 'root'
})

export class DataService extends ApiService {
  studentData: {};
  token: '';

  getQuiz(id): any {
    const url = '/quiz' + id;
    return this.makeRequest(url, HTTP_GET, this.buildRequestOptions());
  }

  getPrompt(id, data): Observable<any> {
    const url = '/prompt/' + id;
    return this.makeRequest(url, HTTP_PUT, this.buildRequestOptions(), data);
  }

  postPrompt(data): Observable<any> {
    const url = '/prompt/';
    return this.makeRequest(url, HTTP_POST, this.buildRequestOptions(), data);
  }

}
