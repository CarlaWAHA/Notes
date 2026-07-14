import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoteModel } from '../models/note';
import { NoteRequest } from '../models/note-request';

@Injectable({
  providedIn: 'root'
})
export class noteService {

  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/notes';

  getAllNotes(): Observable<NoteModel[]> {
    return this.http.get<NoteModel[]>(this.apiUrl);
  }

  getNoteById(id: number): Observable<NoteModel> {
    return this.http.get<NoteModel>(`${this.apiUrl}/${id}`);
  }

  createNote(note: NoteRequest): Observable<NoteModel> {
    return this.http.post<NoteModel>(this.apiUrl, note);
  }

  deleteNoteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
