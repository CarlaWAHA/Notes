import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';

import { NoteDetailComponent } from './note-detail-component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { noteService } from '../Services/note.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-dummy-notes',
  template: '<p>Notes</p>',
  standalone: true,
})
class DummyNotesComponent {}

const settle = async () => {
    await Promise.resolve();                     
    await new Promise((r) => setTimeout(r, 0));  
    await Promise.resolve();                     
  };

describe('NoteDetail', () => {
  let component: NoteDetailComponent;
  let fixture: ComponentFixture<NoteDetailComponent>;
  let router: Router;
  
  const noteServiceMock = {
    getNoteById: jest.fn(),
    deleteNoteById: jest.fn<ReturnType<noteService['deleteNoteById']>, Parameters<noteService['deleteNoteById']>>()
  }

  beforeEach(async () => {
    
    const mockedNote = { id: 1, title: 'title', content: 'content' };
    noteServiceMock.getNoteById.mockReturnValue(of(mockedNote));

    await TestBed.configureTestingModule({
      imports: [NoteDetailComponent, DummyNotesComponent],
      providers: [        
        provideRouter(
          [{ path: 'notes', component: DummyNotesComponent }]
        ), 
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { note: mockedNote },
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        { provide: noteService, useValue: noteServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

    afterEach(async() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.note).toBeDefined();

  });

  it('should delete note service mock', async() => {
    //Arrange
   noteServiceMock.deleteNoteById.mockReturnValueOnce(of({}));

    // Act
   component.delete();
    
    expect(noteServiceMock.deleteNoteById).toHaveBeenCalledTimes(1);
    expect(noteServiceMock.deleteNoteById).toHaveBeenCalledWith(1);

    // Assert
    await settle();
    expect(router.url).toBe('/notes');
  });

});