import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UE } from '../models/ue';
import { environment } from '../../environment/environment.production';

@Injectable({
  providedIn: 'root'
})
export class UEService {
  private readonly apiUrl = environment.apiUrl;

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
