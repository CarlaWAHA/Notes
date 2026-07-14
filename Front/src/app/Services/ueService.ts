import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UE } from '../models/ue';

@Injectable({
  providedIn: 'root'
})
export class UEService {
  private apiUrl = 'http://localhost:8080/api/ues';

  constructor(private http: HttpClient) {}

  getAllUEs(): Observable<UE[]> {
    return this.http.get<UE[]>(this.apiUrl);
  }

  getUEById(id: number): Observable<UE> {
    return this.http.get<UE>(`${this.apiUrl}/${id}`);
  }

  getUEByCode(code: string): Observable<UE> {
    return this.http.get<UE>(`${this.apiUrl}/code/${code}`);
  }
}
