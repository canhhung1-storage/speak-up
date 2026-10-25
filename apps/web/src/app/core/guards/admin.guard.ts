import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional Route Guard for Admin Portal:
 * 1. Checks if user is authenticated. If not, redirects to /login with returnUrl.
 * 2. Checks if user has ADMIN role. If not, redirects to /courses (learner dashboard).
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (authService.isAdmin()) {
    return true;
  }

  // User is logged in but not an Admin -> redirect to Learner dashboard
  return router.createUrlTree(['/courses']);
};
