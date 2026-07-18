import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface ContactRequest {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  sendContactMessage(payload: ContactRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/contact`, payload);
  }
}
