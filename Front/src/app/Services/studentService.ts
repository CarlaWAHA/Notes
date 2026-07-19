import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createStudent(request: any): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/admin/students`, request);
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/admin/students`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/admin/students/${id}`);
  }

  addUEToStudent(studentId: number, ueCode: string): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/admin/students/${studentId}/ues/${ueCode}`, {});
  }

  removeUEFromStudent(studentId: number, ueCode: string): Observable<Student> {
    return this.http.delete<Student>(`${this.apiUrl}/admin/students/${studentId}/ues/${ueCode}`);
  }

  updateStudent(studentId: number, payload: { username: string; password?: string; ueCodes: string[] }): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/admin/students/${studentId}`, payload);
  }

  deleteStudent(studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/students/${studentId}`);
  }
}
