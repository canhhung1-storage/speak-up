import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="navbar-wrapper">
      <div class="container navbar-container">
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-logo">
          <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
        </a>

        <!-- Center Nav Links -->
        <nav class="nav-links">
          <a href="#pillars" class="nav-link">The Method</a>
          <a href="#how-it-works" class="nav-link">How It Works</a>
        </nav>

        <!-- Right Action Controls -->
        <div class="nav-actions">
          <!-- Theme Mode Toggle -->
          <button
            class="theme-toggle-btn"
            (click)="themeService.toggleTheme()"
            [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            title="Toggle theme"
          >
            <!-- Moon icon (for light mode -> click to make dark) -->
            @if (!themeService.isDark()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            } @else {
              <!-- Sun icon (for dark mode -> click to make light) -->
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            }
          </button>

          <!-- Conditional Auth Area -->
          @if (authService.isAuthenticated()) {
            <!-- User is Logged In -->
            <div class="user-session-group">
              <a routerLink="/courses" class="btn-dashboard">
                Dashboard <span class="rocket-icon">🚀</span>
              </a>

              <!-- User Profile & Sign Out Button -->
              <div class="user-profile-badge" [title]="authService.currentUser()?.email || ''">
                @if (authService.currentUser()?.avatarUrl && !avatarFailed()) {
                  <img
                    [src]="authService.currentUser()?.avatarUrl"
                    [alt]="authService.currentUser()?.fullName || 'User'"
                    class="user-avatar"
                    referrerpolicy="no-referrer"
                    (error)="avatarFailed.set(true)"
                  />
                } @else {
                  <div class="user-avatar-initials">
                    {{ getInitials(authService.currentUser()?.fullName) }}
                  </div>
                }
                <span class="user-display-name">
                  {{ authService.currentUser()?.fullName?.split(' ')?.at(-1) || 'Learner' }}
                </span>
                
                <button
                  type="button"
                  class="btn-signout"
                  (click)="authService.logout()"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
          } @else {
            <!-- Guest / Not Logged In -->
            <a routerLink="/login" class="btn-signin">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>Sign In</span>
            </a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .navbar-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 1000;
        background: var(--nav-bg);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-color);
        transition: background-color 0.25s ease, border-color 0.25s ease;
      }

      .navbar-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 68px;
      }

      .brand-logo {
        display: flex;
        align-items: center;
        text-decoration: none;
      }

      .logo-text {
        font-size: 1.35rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--text-primary);
      }

      .logo-accent {
        color: #3b82f6;
      }

      .nav-links {
        display: flex;
        gap: 32px;

        @media (max-width: 640px) {
          display: none;
        }
      }

      .nav-link {
        font-size: 0.925rem;
        font-weight: 500;
        color: var(--text-secondary);
        transition: color 0.2s ease;

        &:hover {
          color: var(--text-primary);
        }
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .theme-toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: var(--text-secondary);
        background: transparent;
        transition: all 0.2s ease;

        &:hover {
          color: var(--text-primary);
          background: var(--bg-surface-elevated);
        }
      }

      .btn-signin {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 20px;
        border-radius: 10px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #ffffff;
        background: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        transition: all 0.2s ease;
        text-decoration: none;

        &:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
        }

        svg {
          flex-shrink: 0;
        }
      }

      // --- Authenticated User Area ---
      .user-session-group {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .btn-dashboard {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 10px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #ffffff;
        background: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        transition: all 0.2s ease;

        &:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
        }
      }

      .rocket-icon {
        font-size: 0.85rem;
      }

      .user-profile-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px 4px 4px;
        border-radius: 9999px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      .user-avatar-initials {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #3b82f6;
        color: #ffffff;
        font-size: 0.85rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-display-name {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-primary);
        max-width: 90px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        @media (max-width: 640px) {
          display: none;
        }
      }

      .btn-signout {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: var(--text-secondary);
        transition: all 0.2s ease;

        &:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      }
    `,
  ],
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  avatarFailed = signal<boolean>(false);

  getInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
