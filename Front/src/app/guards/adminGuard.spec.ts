import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { adminGuard } from './adminGuard';

describe('adminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('allows admin users', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('roles', JSON.stringify(['ROLE_ADMIN']));

    const result = TestBed.runInInjectionContext(() => adminGuard());
    expect(result).toBe(true);
  });

  it('redirects non-admin users to home', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('roles', JSON.stringify(['ROLE_STUDENT']));
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    const result = TestBed.runInInjectionContext(() => adminGuard());

    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
