import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Note } from './noteComponent/noteComponent';
import { NoteModel } from './models/note';
import { noteListComponent } from './noteListComponent/noteListComponent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('notes');
}
