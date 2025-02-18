import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../../../app.constants';
import { NotificationService } from '../notificatons/notifications.service';



@Injectable({
  providedIn: 'root',
})
export class RoleRequestService {
  private apiUrl = API_BASE_URL;
  userId = localStorage.getItem('authId');

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {
  }

  sendRequest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/role-change-requests/${this.userId}`, data).pipe(
      tap({
        next: () => this.notificationService.showSuccess('Request sent Successfully', 'Wait till the support team responds to your request'),
        error: () => this.notificationService.showError('Request Failed', 'Please check your details and try again'),
      }),
    );
  }
}
