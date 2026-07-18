import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

interface SiteContentResponse {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteContentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/content`;

  getContentValue(key: string, defaultValue: string): Observable<SiteContentResponse> {
    return this.http.get<SiteContentResponse>(`${this.apiUrl}/${encodeURIComponent(key)}?defaultValue=${encodeURIComponent(defaultValue)}`);
  }

  updateContentValue(key: string, value: string): Observable<SiteContentResponse> {
    return this.http.put<SiteContentResponse>(`${this.apiUrl}/${encodeURIComponent(key)}`, { value });
  }
}
