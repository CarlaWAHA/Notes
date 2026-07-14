import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { noteService } from '../Services/note.service';
import { NoteModel } from '../models/note';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './noteListComponent.html',
  styleUrls: ['./noteListComponent.css']
})
export class noteListComponent implements OnInit {

  private noteService = inject(noteService);
  private router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  notes: NoteModel[] = [];
  newTitle = '';
  newContent = '';
  errorMessage = '';
  loading = false;

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.noteService.getAllNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('API ERROR:', err);
        this.errorMessage = 'Impossible de charger les notes.';
        this.loading = false;
      }
    });
  }

  addNote(): void {
    if (!this.newTitle.trim() || !this.newContent.trim()) {
      this.errorMessage = 'Le titre et le contenu sont obligatoires.';
      return;
    }

    this.noteService.createNote({ title: this.newTitle, content: this.newContent }).subscribe({
      next: () => {
        this.newTitle = '';
        this.newContent = '';
        this.errorMessage = '';
        this.loadNotes();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Create error:', err);
        this.errorMessage = 'Impossible de créer la note : vérifiez le titre et le contenu.';
      }
    });
  }

  deleteNote(id: number): void {
    this.errorMessage = '';
    this.noteService.deleteNoteById(id).subscribe({
      next: () => this.loadNotes(),
      error: (err: HttpErrorResponse) => {
        console.error('Delete error:', err);
        this.errorMessage = 'Impossible de supprimer la note.';
      }
    });
  }

  isAdmin(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    try {
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      return roles.includes('ROLE_ADMIN');
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    this.router.navigate(['/login']);
  }
}
