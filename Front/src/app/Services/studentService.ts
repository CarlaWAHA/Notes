import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/api';

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
}
