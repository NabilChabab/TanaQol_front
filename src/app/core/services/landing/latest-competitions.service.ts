import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LatestCompetitionsService {

  private apiUrl = API_BASE_URL;

  constructor(private http : HttpClient) { }

  findLatestCompetitions(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/competition/all`, {
      withCredentials: true,
      params: { page: page.toString(), size: size.toString() }
    });
  }
}
