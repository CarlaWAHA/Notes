import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdmissionsComponent } from './admissionsComponent';
import { SiteContentService } from '../Services/site-content.service';

describe('AdmissionsComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AdmissionsComponent],
      providers: [
        {
          provide: SiteContentService,
          useValue: {
            getContentValue: jest.fn().mockReturnValue(of({ key: 'tc.admissions.intro', value: 'Admission intro' })),
            updateContentValue: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('creates component', () => {
    const fixture = TestBed.createComponent(AdmissionsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('hides admin link for non admin', () => {
    const fixture = TestBed.createComponent(AdmissionsComponent);
    fixture.detectChanges();

    const links = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[];
    expect(links.some((link) => link.getAttribute('href') === '/admin-space')).toBe(false);
  });
});
