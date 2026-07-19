import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UE } from '../models/ue';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UEService {
  private readonly apiUrl = `${environment.apiUrl}/ues`;

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

  createUE(request: UE): Observable<UE> {
    return this.http.post<UE>(this.apiUrl, request);
  }

  updateUE(id: number, request: UE): Observable<UE> {
    return this.http.put<UE>(`${this.apiUrl}/${id}`, request);
  }

  deleteUE(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
