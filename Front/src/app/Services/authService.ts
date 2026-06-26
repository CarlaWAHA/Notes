import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/loginRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = "http://localhost:9000";

  login(request: LoginRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, request, {
      responseType: 'text'
    });
  }
}