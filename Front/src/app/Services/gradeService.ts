import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Grade } from '../models/grade';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrUpdateGrade(request: any): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/admin/grades`, request);
  }

  getStudentGrades(studentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/admin/grades/student/${studentId}`);
  }

  getMyGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/student/grades/my-grades`);
  }

  getStudentGradesByStudentId(studentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/student/grades/${studentId}`);
  }
}
