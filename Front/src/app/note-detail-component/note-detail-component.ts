import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { noteService } from '../Services/note.service';
import { NoteModel } from '../models/note';
import { Router } from '@angular/router';


@Component({
  selector: 'app-note-detail-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-detail-component.html',
  styleUrls: ['./note-detail-component.css']
})
export class NoteDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private noteService = inject(noteService);
  private router = inject(Router);

  note!: NoteModel;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.noteService.getNoteById(id).subscribe({
      next: (data) => this.note = data,
      error: (err) => console.error(err)
    });
  }
  delete(): void {
  this.noteService.deleteNoteById(this.note.id).subscribe(() => {
    this.router.navigate(['/notes']);
  });
}
}
