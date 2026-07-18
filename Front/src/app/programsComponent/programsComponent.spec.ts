import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProgramsComponent } from './programsComponent';
import { noteService } from '../Services/note.service';
import { SiteContentService } from '../Services/site-content.service';

describe('ProgramsComponent', () => {
  const getAllNotes = jest.fn();

  beforeEach(async () => {
    localStorage.clear();
    getAllNotes.mockReset();

    await TestBed.configureTestingModule({
      imports: [ProgramsComponent],
      providers: [
        {
          provide: noteService,
          useValue: { getAllNotes },
        },
        {
          provide: SiteContentService,
          useValue: {
            getContentValue: jest.fn().mockReturnValue(of({ key: 'tc.programs.intro', value: 'Programs intro' })),
            updateContentValue: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('loads courses from admin managed notes', () => {
    getAllNotes.mockReturnValue(of([{ id: 1, title: 'Cours 1', content: 'Description 1' }]));
    const fixture = TestBed.createComponent(ProgramsComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.courses).toHaveLength(1);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Cours 1');
  });

  it('shows error message when loading courses fails', () => {
    getAllNotes.mockReturnValue(throwError(() => new Error('fail')));
    const fixture = TestBed.createComponent(ProgramsComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.errorMessage).toContain('Connectez-vous');
  });
});
