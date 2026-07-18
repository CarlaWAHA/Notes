import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SiteContentService } from './site-content.service';

describe('SiteContentService', () => {
  let service: SiteContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SiteContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches a content value with default fallback', () => {
    service.getContentValue('tc.home.hero', 'Default').subscribe((response) => {
      expect(response.value).toBe('Stored');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/content/tc.home.hero?defaultValue=Default');
    expect(req.request.method).toBe('GET');
    req.flush({ key: 'tc.home.hero', value: 'Stored' });
  });

  it('updates a content value', () => {
    service.updateContentValue('tc.home.hero', 'Updated').subscribe((response) => {
      expect(response.value).toBe('Updated');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/content/tc.home.hero');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ value: 'Updated' });
    req.flush({ key: 'tc.home.hero', value: 'Updated' });
  });
});
