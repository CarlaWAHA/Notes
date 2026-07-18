import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AboutComponent } from './aboutComponent';
import { SiteContentService } from '../Services/site-content.service';

describe('AboutComponent', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        {
          provide: SiteContentService,
          useValue: {
            getContentValue: jest.fn().mockReturnValue(of({ key: 'tc.about.vision', value: 'Vision test' })),
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
    const fixture = TestBed.createComponent(AboutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows admin link for admin role', () => {
    localStorage.setItem('roles', JSON.stringify(['ROLE_ADMIN']));
    const fixture = TestBed.createComponent(AboutComponent);
    fixture.detectChanges();

    const links = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[];
    expect(links.some((link) => link.getAttribute('href') === '/admin-space')).toBe(true);
  });
});
