import { TestBed } from '@angular/core/testing';
import { AdminSpaceComponent } from './adminSpaceComponent';

describe('AdminSpaceComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSpaceComponent],
    }).compileComponents();
  });

  it('renders links to admin modules', () => {
    const fixture = TestBed.createComponent(AdminSpaceComponent);
    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('CRUD Etudiants');
    expect(html.textContent).toContain('CRUD Cours');
    expect(Array.from(html.querySelectorAll('a')).some((link) => link.getAttribute('href') === '/admin')).toBe(true);
    expect(Array.from(html.querySelectorAll('a')).some((link) => link.getAttribute('href') === '/notes')).toBe(true);
  });
});
