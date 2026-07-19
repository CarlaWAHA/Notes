import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const url = req.url;
  const isPublicLogin = req.method === 'POST' && /\/api\/login(\?|$)/.test(url);
  const isPublicContentRead = req.method === 'GET' && /\/api\/content\//.test(url);

  if (isPublicLogin || isPublicContentRead) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {
    const authorized = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authorized);
  }

  return next(req);
};
