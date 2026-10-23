import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP Interceptor for authentication:
 * 1. Attaches Bearer JWT token to outgoing API requests.
 * 2. Catches 401 Unauthorized errors to automatically purge session and redirect to /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token();

  // Attach Authorization header if token exists and request is targeting SpeakUp API
  let authReq = req;
  if (token && (req.url.startsWith('/api') || req.url.includes('/api/'))) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Purge invalid/expired token and redirect to login
        authService.logout();
        const currentUrl = router.url;
        if (!currentUrl.startsWith('/login')) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: currentUrl },
          });
        }
      }
      return throwError(() => error);
    }),
  );
};
