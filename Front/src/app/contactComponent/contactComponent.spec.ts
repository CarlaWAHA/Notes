import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactComponent } from './contactComponent';
import { ContactService } from '../Services/contactService';
import { SiteContentService } from '../Services/site-content.service';

describe('ContactComponent', () => {
  const sendContactMessage = jest.fn();

  beforeEach(async () => {
    localStorage.clear();
    sendContactMessage.mockReset();
    sendContactMessage.mockReturnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        {
          provide: ContactService,
          useValue: { sendContactMessage },
        },
        {
          provide: SiteContentService,
          useValue: {
            getContentValue: jest.fn().mockReturnValue(of({ key: 'tc.contact.intro', value: 'Intro' })),
            updateContentValue: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('shows validation error when form is incomplete', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const component = fixture.componentInstance;

    component.submit();

    expect(component.errorMessage).toContain('Veuillez remplir tous les champs');
    expect(sendContactMessage).not.toHaveBeenCalled();
  });

  it('submits and resets form on success', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const component = fixture.componentInstance;
    const payload = {
      fullName: 'Trust Campus',
      email: 'student@test.com',
      subject: 'Sujet',
      message: 'Bonjour',
    };
    component.model = { ...payload };

    component.submit();

    expect(sendContactMessage).toHaveBeenCalledWith(payload);
    expect(component.successMessage).toContain('Trust Campus');
    expect(component.model).toEqual({ fullName: '', email: '', subject: '', message: '' });
  });
});
