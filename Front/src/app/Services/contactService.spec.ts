import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ContactService } from './contactService';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts contact payload to API', () => {
    service.sendContactMessage({
      fullName: 'Trust Campus',
      email: 'student@test.com',
      subject: 'Sujet',
      message: 'Message',
    }).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/contact');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
