import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

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
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'courses',
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/admin/courses/course-list.component').then(
            (m) => m.CourseListComponent,
          ),
      },
      {
        path: 'courses/:courseId/lessons',
        loadComponent: () =>
          import('./features/admin/lessons/lesson-list.component').then(
            (m) => m.LessonListComponent,
          ),
      },
      {
        path: 'courses/:courseId/lessons/create',
        loadComponent: () =>
          import('./features/admin/lessons/lesson-editor.component').then(
            (m) => m.LessonEditorComponent,
          ),
      },
      {
        path: 'courses/:courseId/lessons/:lessonId/edit',
        loadComponent: () =>
          import('./features/admin/lessons/lesson-editor.component').then(
            (m) => m.LessonEditorComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
