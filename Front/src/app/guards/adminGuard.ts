import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/home']);
    return false;
  }

  let roles: string[] = [];
  try {
    roles = JSON.parse(localStorage.getItem('roles') || '[]');
  } catch {
    roles = [];
  }

  if (roles.includes('ROLE_ADMIN')) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
