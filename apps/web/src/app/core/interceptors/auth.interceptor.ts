import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP Interceptor for authentication:
 * 1. Attaches Bearer JWT token to outgoing API requests.
 * 2. Catches 401 Unauthorized errors to automatically perform Silent Refresh via HttpOnly cookie.
 * 3. Retries original request with new Access Token or redirects to /login if refresh fails.
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
      // If 401 occurs and is NOT an auth attempt itself, attempt silent refresh
      if (
        error.status === 401 &&
        !req.url.includes('/auth/refresh') &&
        !req.url.includes('/auth/google')
      ) {
        return authService.refreshToken().pipe(
          switchMap((refreshRes) => {
            // Retry original failed request with newly obtained access token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshRes.accessToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            // Refresh token has expired or was revoked -> Logout & redirect
            authService.logout();
            const currentUrl = router.url;
            if (!currentUrl.startsWith('/login')) {
              router.navigate(['/login'], {
                queryParams: { returnUrl: currentUrl },
              });
            }
            return throwError(() => refreshErr);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
