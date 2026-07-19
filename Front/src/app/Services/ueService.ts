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

  createUE(payload: { code: string; titre: string }): Observable<UE> {
    return this.http.post<UE>(this.apiUrl, payload);
  }

  updateUE(id: number, payload: { code: string; titre: string }): Observable<UE> {
    return this.http.put<UE>(`${this.apiUrl}/${id}`, payload);
  }

  deleteUE(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
