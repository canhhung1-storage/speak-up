import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-course-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-card">
        <div class="user-greeting">
          @if (authService.currentUser()?.avatarUrl && !imageFailed()) {
            <img
              [src]="authService.currentUser()?.avatarUrl"
              class="dashboard-avatar"
              alt="Avatar"
              referrerpolicy="no-referrer"
              (error)="imageFailed.set(true)"
            />
          } @else {
            <div class="avatar-fallback">
              {{ getInitials(authService.currentUser()?.fullName) }}
            </div>
          }
          <h2 class="greeting-title">Welcome, {{ authService.currentUser()?.fullName || 'Learner' }}! 🚀</h2>
          <p class="user-email">{{ authService.currentUser()?.email }}</p>
        </div>

        <div class="welcome-box">
          <span class="badge-success">Authenticated via Google</span>
          <p class="welcome-text">You have successfully signed in with Google OAuth 2.0.</p>
          <p class="welcome-sub">Your personalized Effortless English learning modules and mini-stories will be loaded here.</p>
        </div>

        <div class="dashboard-actions">
          <a routerLink="/" class="btn-action btn-home">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span>Landing Page</span>
          </a>
          <button type="button" class="btn-action btn-signout" (click)="authService.logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        background-color: var(--bg-main);
      }

      .dashboard-card {
        width: 100%;
        max-width: 600px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 24px;
        padding: 40px;
        text-align: center;
        box-shadow: var(--card-shadow);
      }

      .dashboard-avatar {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        border: 3px solid #3b82f6;
        margin: 0 auto 16px auto;
        display: block;
        object-fit: cover;
        box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
      }

      .avatar-fallback {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        background: #3b82f6;
        color: #ffffff;
        font-size: 1.6rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px auto;
        box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
      }

      .greeting-title {
        font-size: 1.75rem;
        font-weight: 800;
        margin-bottom: 6px;
        color: var(--text-primary);
      }

      .user-email {
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin-bottom: 24px;
      }

      .welcome-box {
        background: var(--bg-surface-elevated);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 32px;
      }

      .badge-success {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #10b981;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.25);
        margin-bottom: 12px;
      }

      .welcome-text {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 6px;
      }

      .welcome-sub {
        font-size: 0.875rem;
        color: var(--text-secondary);
        line-height: 1.5;
      }

      .dashboard-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      .btn-action {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 12px;
        font-size: 0.925rem;
        font-weight: 600;
        transition: all 0.2s ease;
        text-decoration: none;
      }

      .btn-home {
        background: var(--bg-surface-elevated);
        color: var(--text-primary);
        border: 1px solid var(--border-color);

        &:hover {
          background: var(--bg-surface-hover);
        }
      }

      .btn-signout {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);

        &:hover {
          background: rgba(239, 68, 68, 0.18);
        }
      }
    `,
  ],
})
export class CourseDashboardComponent {
  readonly authService = inject(AuthService);
  imageFailed = signal<boolean>(false);

  getInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
