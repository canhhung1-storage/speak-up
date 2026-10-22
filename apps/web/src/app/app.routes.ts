import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  {
    path: 'courses',
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
