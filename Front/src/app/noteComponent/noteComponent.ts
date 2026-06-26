import { Component, Input } from '@angular/core';
import { NoteModel } from '../models/note';


@Component({
  selector: 'app-noteComponent',
  standalone: true,
  templateUrl: './noteComponent.html',
  styleUrl: './noteComponent.css',
})
export class Note {

  myNote!: NoteModel;

  ngOninit(){
    this.myNote=new NoteModel(
    1,
    "note title",
    "content title",
    );
  }
  @Input() note!: NoteModel;
}
