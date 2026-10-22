import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'courses',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/learning/course-dashboard.component').then(
        (m) => m.CourseDashboardComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
