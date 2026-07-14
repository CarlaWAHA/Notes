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
  private readonly apiUrl = environment.apiUrl;

  getAllNotes(): Observable<NoteModel[]> {
    return this.http.get<NoteModel[]>(this.apiUrl);
  }

  getNoteById(id: number): Observable<NoteModel> {
    return this.http.get<NoteModel>(`${this.apiUrl}/${id}`);
  }
   deleteNoteById(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
