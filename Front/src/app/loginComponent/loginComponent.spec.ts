import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './loginComponent';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dummy-notes',
  template: '<p>Notes</p>',
  standalone: true,
})
class DummyNotesComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, DummyNotesComponent],
      providers: [
        provideRouter([
          { path: 'notes', component: DummyNotesComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
it('submit() → stocke dans localStorage', async() => {
    // Arrange
    const username = 'user';
    const token = 'secure-token-123';
    const roles = ['ROLE_USER'];
  const userId = 42;

    component.model.username = 'user';
    component.model.password = 'password';

    component.submit();

  const req = httpMock.expectOne('http://localhost:8080/api/login');
    expect(req.request.method).toBe('POST');
  req.flush({ token, roles, userId, username });

    expect(localStorage.getItem('username')).toBe(username);
  expect(localStorage.getItem('userId')).toBe(String(userId));
    expect(localStorage.getItem('token')).toBe(token);
    expect(localStorage.getItem('roles')).toBe(JSON.stringify(roles));

  });

});
