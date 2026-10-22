import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="login-wrapper">
      <!-- Left Column: Branding, Inspiration Quote & Author Card -->
      <aside class="left-panel">
        <div class="left-panel-content">
          <!-- Back to Home Link -->
          <a routerLink="/" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span>Back to Home</span>
          </a>

          <!-- Main Brand & Quote Group -->
          <div class="brand-group">
            <div class="logo">
              <span class="logo-text">Speak<span class="logo-accent">Up</span></span>
            </div>

            <h1 class="headline">Unlock your English potential.</h1>

            <div class="quote-card">
              <p class="quote-text">
                "Language is not a genetic gift, it is a social gift. Learning a new language is becoming a member of the club – the community of speakers of that language."
              </p>
            </div>

            <!-- Author Pill -->
            <div class="author-card">
              <div class="author-avatar">AJ</div>
              <div class="author-info">
                <span class="author-name">A.J. Hoge</span>
                <span class="author-title">Creator of Effortless English</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Column: Authentication Form -->
      <main class="right-panel">
        <!-- Floating Theme Toggle in Top-Right -->
        <div class="panel-header-actions">
          <button
            class="theme-toggle-btn"
            (click)="themeService.toggleTheme()"
            [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            title="Toggle theme"
          >
            @if (!themeService.isDark()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            } @else {
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
        </div>

        <!-- Form Card Container -->
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">Welcome back</h2>
            <p class="form-subtitle">Enter your details to access your learning dashboard.</p>
          </div>

          <!-- Google Sign-In Button -->
          <button type="button" class="btn-google" (click)="onGoogleSignIn()">
            <svg class="google-icon" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Divider -->
          <div class="divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <!-- Email & Password Form -->
          <form class="auth-form" (ngSubmit)="onSubmitEmail()">
            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">Email address</label>
              <input
                id="email"
                type="email"
                class="form-input"
                placeholder="you@example.com"
                [(ngModel)]="email"
                name="email"
                required
                autocomplete="email"
              />
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <div class="password-label-row">
                <label for="password" class="form-label">Password</label>
                <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
              </div>
              <div class="input-password-wrapper">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  class="form-input password-input"
                  placeholder="••••••••"
                  [(ngModel)]="password"
                  name="password"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="btn-toggle-eye"
                  (click)="togglePasswordVisibility()"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  @if (!showPassword()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                      <line x1="2" y1="2" x2="22" y2="22"/>
                    </svg>
                  }
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn-submit">
              Sign In
            </button>
          </form>

          <!-- Footer Prompt -->
          <div class="form-footer">
            <span class="footer-text">Don't have an account? </span>
            <a href="javascript:void(0)" class="signup-link">Sign up</a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .login-wrapper {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1fr 1fr;
        background-color: var(--bg-main);
        color: var(--text-primary);
        transition: background-color 0.25s ease, color 0.25s ease;

        @media (max-width: 980px) {
          grid-template-columns: 1fr;
        }
      }

      // ================= LEFT PANEL =================
      .left-panel {
        position: relative;
        padding: 48px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
        border-right: 1px solid var(--border-color);

        @media (max-width: 980px) {
          display: none; // Prioritize the login form on mobile devices
        }
      }

      .left-panel-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-width: 480px;
        margin: 0 auto;
        width: 100%;
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-secondary);
        transition: color 0.2s ease, transform 0.2s ease;
        margin-bottom: auto;

        &:hover {
          color: var(--text-primary);
          transform: translateX(-3px);
        }
      }

      .brand-group {
        margin: auto 0;
        padding: 32px 0;
      }

      .logo {
        margin-bottom: 24px;
      }

      .logo-text {
        font-size: 1.6rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--text-primary);
      }

      .logo-accent {
        color: #3b82f6;
      }

      .headline {
        font-size: clamp(2rem, 3.2vw, 2.75rem);
        font-weight: 800;
        line-height: 1.18;
        letter-spacing: -0.03em;
        color: var(--text-primary);
        margin-bottom: 28px;
      }

      .quote-card {
        position: relative;
        margin-bottom: 32px;
        padding-left: 20px;
        border-left: 2px solid #3b82f6;
      }

      .quote-text {
        font-size: 1rem;
        line-height: 1.65;
        font-style: italic;
        color: var(--text-secondary);
      }

      .author-card {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        padding: 12px 20px 12px 14px;
        border-radius: 16px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--card-shadow);
        transition: background-color 0.25s ease, border-color 0.25s ease;
      }

      .author-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #3b82f6;
        color: #ffffff;
        font-weight: 700;
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .author-info {
        display: flex;
        flex-direction: column;
      }

      .author-name {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      .author-title {
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      // ================= RIGHT PANEL =================
      .right-panel {
        position: relative;
        padding: 40px 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--bg-main);
      }

      .panel-header-actions {
        position: absolute;
        top: 28px;
        right: 28px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .theme-toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: var(--text-secondary);
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        box-shadow: var(--card-shadow);
        transition: all 0.2s ease;

        &:hover {
          color: var(--text-primary);
          background: var(--bg-surface-elevated);
          transform: rotate(15deg);
        }
      }

      .form-container {
        width: 100%;
        max-width: 420px;
        margin: auto 0;
        padding: 16px 0;
      }

      .form-header {
        text-align: center;
        margin-bottom: 28px;
      }

      .form-title {
        font-size: 1.95rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .form-subtitle {
        font-size: 0.925rem;
        color: var(--text-secondary);
        line-height: 1.5;
      }

      // --- Google Button ---
      .btn-google {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        width: 100%;
        height: 48px;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 600;
        background: #ffffff;
        color: #1f2937;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
        text-decoration: none;

        &:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        &:active {
          transform: translateY(0);
        }
      }

      :host-context(html[data-theme='dark']) .btn-google {
        background: #ffffff;
        color: #0f172a;
        border-color: #ffffff;

        &:hover {
          background: #f1f5f9;
        }
      }

      .google-icon {
        flex-shrink: 0;
      }

      // --- Divider ---
      .divider {
        display: flex;
        align-items: center;
        margin: 26px 0 22px 0;
        color: var(--text-muted);
        font-size: 0.725rem;
        font-weight: 700;
        letter-spacing: 0.08em;

        &::before,
        &::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-color);
        }

        span {
          padding: 0 14px;
        }
      }

      // --- Auth Form ---
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
      }

      .password-label-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .forgot-link {
        font-size: 0.825rem;
        font-weight: 600;
        color: #3b82f6;
        transition: color 0.2s ease;

        &:hover {
          color: #2563eb;
          text-decoration: underline;
        }
      }

      .form-input {
        width: 100%;
        height: 46px;
        padding: 0 16px;
        border-radius: 12px;
        font-size: 0.95rem;
        font-family: inherit;
        background: var(--bg-surface);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        transition: all 0.2s ease;

        &::placeholder {
          color: var(--text-muted);
        }

        &:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
      }

      .input-password-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .password-input {
        padding-right: 46px;
      }

      .btn-toggle-eye {
        position: absolute;
        right: 12px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        border-radius: 8px;
        transition: color 0.2s ease;

        &:hover {
          color: var(--text-primary);
        }
      }

      .btn-submit {
        width: 100%;
        height: 48px;
        border-radius: 12px;
        font-size: 0.975rem;
        font-weight: 700;
        color: #ffffff;
        background: #3b82f6;
        box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
        margin-top: 6px;
        transition: all 0.2s ease;

        &:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(59, 130, 246, 0.45);
        }

        &:active {
          transform: translateY(0);
        }
      }

      .form-footer {
        text-align: center;
        margin-top: 24px;
        font-size: 0.9rem;
      }

      .footer-text {
        color: var(--text-secondary);
      }

      .signup-link {
        font-weight: 600;
        color: #3b82f6;
        transition: color 0.2s ease;

        &:hover {
          color: #2563eb;
          text-decoration: underline;
        }
      }
    `,
  ],
})
export class LoginComponent {
  readonly themeService = inject(ThemeService);

  email = '';
  password = '';
  showPassword = signal<boolean>(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  onGoogleSignIn(): void {
    // Sẽ kết nối Google GIS / Auth Service ở Step 5 & 6
    console.log('Trigger Google Sign-In');
  }

  onSubmitEmail(): void {
    console.log('Email Sign-In submitted:', { email: this.email });
  }
}
