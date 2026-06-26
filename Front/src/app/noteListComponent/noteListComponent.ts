import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { noteService } from '../Services/note.service';
import { NoteModel } from '../models/note';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noteListComponent.html',
  styleUrls: ['./noteListComponent.css']
})
export class noteListComponent implements OnInit {

  private noteService = inject(noteService);
   private router = inject(Router);

  notes: NoteModel[] = [];

  ngOnInit(): void {
    console.log("ngOnInit called");
    console.log("Component loaded");

    this.noteService.getAllNotes().subscribe({
      next: (data) => {
        console.log("DATA FROM API:", data);
        this.notes = data;
      },
      error: (err) => console.error("API ERROR:", err)
    });
  }

  logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");

    this.router.navigate(['/login']);

  }
}
