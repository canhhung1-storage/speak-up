import {
  Component,
  inject,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

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
            (click)="toggleTheme()"
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

          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div class="error-banner">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Google Sign-In Container (Renders official Google Continue with Google button) -->
          <div class="google-auth-box">
            <div #googleBtnWrapper class="google-btn-wrapper"></div>
          </div>

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
            <button type="submit" class="btn-submit" [disabled]="authService.isLoading()">
              @if (authService.isLoading()) {
                <span>Signing In...</span>
              } @else {
                <span>Sign In</span>
              }
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
          display: none;
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
        margin-bottom: 24px;
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

      .error-banner {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: #ef4444;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 20px;
      }

      // --- Google Auth Box ---
      .google-auth-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 48px;
      }

      .google-btn-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;

        // Center Google's iframe nicely
        iframe {
          margin: 0 auto !important;
        }
      }

      // --- Divider ---
      .divider {
        display: flex;
        align-items: center;
        margin: 24px 0 20px 0;
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

        &:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(59, 130, 246, 0.45);
        }

        &:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        &:active:not(:disabled) {
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
export class LoginComponent implements OnInit, AfterViewInit {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('googleBtnWrapper') googleBtnWrapper!: ElementRef<HTMLDivElement>;

  email = '';
  password = '';
  showPassword = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // If already authenticated, redirect immediately
    if (this.authService.isAuthenticated()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/courses';
      this.router.navigateByUrl(returnUrl);
    }
  }

  ngAfterViewInit(): void {
    this.setupGoogleAuth();
  }

  private setupGoogleAuth(): void {
    this.authService.initGoogleAuth(
      (response: AuthResponse) => {
        this.errorMessage.set(null);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/courses';
        this.router.navigateByUrl(returnUrl);
      },
      (error: any) => {
        console.error('Google Sign-In failed:', error);
        this.errorMessage.set('Google sign-in failed. Please try again.');
      },
    );

    if (this.googleBtnWrapper?.nativeElement) {
      this.authService.renderGoogleButton(
        this.googleBtnWrapper.nativeElement,
        this.themeService.isDark(),
        360,
      );
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    // Re-render google button with updated theme if container exists
    if (this.googleBtnWrapper?.nativeElement) {
      this.googleBtnWrapper.nativeElement.innerHTML = '';
      this.authService.renderGoogleButton(
        this.googleBtnWrapper.nativeElement,
        this.themeService.isDark(),
        360,
      );
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  onSubmitEmail(): void {
    this.errorMessage.set('Email/password login is coming soon. Please use Google Sign-In.');
  }
}
