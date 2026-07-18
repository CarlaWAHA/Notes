import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoteModel } from '../models/note';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class noteService {

  private http = inject(HttpClient);
  private readonly notesUrl = `${environment.apiUrl.replace(/\/api$/, '')}/notes`;

  getAllNotes(): Observable<NoteModel[]> {
    return this.http.get<NoteModel[]>(this.notesUrl);
  }

  getNoteById(id: number): Observable<NoteModel> {
    return this.http.get<NoteModel>(`${this.notesUrl}/${id}`);
  }

  createNote(payload: { title: string; content: string }): Observable<NoteModel> {
    return this.http.post<NoteModel>(this.notesUrl, payload);
  }

  updateNote(id: number, payload: { title: string; content: string }): Observable<NoteModel> {
    return this.http.put<NoteModel>(`${this.notesUrl}/${id}`, payload);
  }

   deleteNoteById(id: number) {
    return this.http.delete(`${this.notesUrl}/${id}`);
  }
}
