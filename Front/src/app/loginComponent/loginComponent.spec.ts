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
    const token = 'jwt-123';
    const roles = ['ROLE_USER'];

    component.model.username = "user";
    component.model.password = 'password';

    // Act
    component.submit();

    const req = httpMock.expectOne(() => true);
    expect(req.request.method).toBe('POST'); 
    req.flush(token);

    // Assert
    expect(localStorage.getItem('username')).toBe(username);
    expect(localStorage.getItem('token')).toBe(token);
    expect(localStorage.getItem('roles')).toBe(JSON.stringify(roles));

  });

});
