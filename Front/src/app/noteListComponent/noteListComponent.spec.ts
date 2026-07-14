import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { noteListComponent } from './noteListComponent';
import { noteService } from '../Services/note.service';
import { Router } from '@angular/router';

describe('noteListComponent', () => {
  let component: noteListComponent;
  let fixture: ComponentFixture<noteListComponent>;
  const noteServiceMock = {
    getAllNotes: jest.fn(),
    createNote: jest.fn(),
    deleteNoteById: jest.fn()
  };

  beforeEach(async () => {
    noteServiceMock.getAllNotes.mockReturnValue(of([{ id: 1, title: 'Test', content: 'Contenu' }]));
    noteServiceMock.createNote.mockReturnValue(of({ id: 2, title: 'Nouveau', content: 'Contenu' }));
    noteServiceMock.deleteNoteById.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [noteListComponent],
      providers: [
        { provide: noteService, useValue: noteServiceMock },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(noteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a note when form is filled', () => {
    component.newTitle = 'Nouveau';
    component.newContent = 'Contenu';
    component.addNote();

    expect(noteServiceMock.createNote).toHaveBeenCalledWith({ title: 'Nouveau', content: 'Contenu' });
    expect(component.errorMessage).toBe('');
  });

  it('should display an error when note creation fails', () => {
    noteServiceMock.createNote.mockReturnValueOnce(throwError(() => new Error('Erreur')));
    component.newTitle = 'Nouveau';
    component.newContent = 'Contenu';
    component.addNote();

    expect(component.errorMessage).toBe('Impossible de créer la note : vérifiez le titre et le contenu.');
  });

  it('should delete a note', () => {
    component.deleteNote(1);
    expect(noteServiceMock.deleteNoteById).toHaveBeenCalledWith(1);
  });
});
