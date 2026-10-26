import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, finalize, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (res: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    [key: string]: unknown;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
  prompt: () => void;
  disableAutoSelect: () => void;
}

interface GoogleAuthGlobal {
  accounts?: {
    id?: GoogleAccountsId;
  };
}

declare const google: GoogleAuthGlobal | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'speakup_token';
  private readonly USER_KEY = 'speakup_user';

  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  readonly isLoading = signal<boolean>(false);

  // In-flight refresh observable to deduplicate concurrent refresh calls
  private refreshInFlight$: Observable<AuthResponse> | null = null;

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  /**
   * Initializes Google Identity Services (GIS)
   */
  initGoogleAuth(onSuccess: (response: AuthResponse) => void, onError?: (err: unknown) => void): void {
    if (typeof window === 'undefined') return;

    const checkGoogle = () => {
      if (typeof google !== 'undefined' && google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (credentialResponse: GoogleCredentialResponse) => {
            if (credentialResponse?.credential) {
              this.isLoading.set(true);
              this.loginWithGoogle(credentialResponse.credential).subscribe({
                next: (res) => {
                  this.isLoading.set(false);
                  onSuccess(res);
                },
                error: (err) => {
                  this.isLoading.set(false);
                  if (onError) onError(err);
                },
              });
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } else {
        setTimeout(checkGoogle, 100);
      }
    };

    checkGoogle();
  }

  /**
   * Render official Google Sign-In button into a host element
   */
  renderGoogleButton(
    container: HTMLElement,
    isDark = false,
    width = 380,
  ): void {
    const checkGoogle = () => {
      if (typeof google !== 'undefined' && google?.accounts?.id) {
        google.accounts.id.renderButton(container, {
          theme: isDark ? 'filled_black' : 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'continue_with',
          logo_alignment: 'left',
          width: width,
          locale: 'en',
        });
      } else {
        setTimeout(checkGoogle, 100);
      }
    };

    checkGoogle();
  }

  /**
   * Exchange Google ID Token with Backend API (Sets HttpOnly refresh cookie)
   */
  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/google`,
        { idToken },
        { withCredentials: true },
      )
      .pipe(
        tap((response) => {
          this.setSession(response);
        }),
      );
  }

  /**
   * Request silent token refresh via HttpOnly cookie.
   * Concurrency Safe: Uses shareReplay(1) to deduplicate simultaneous 401 refresh calls into a single HTTP request.
   */
  refreshToken(): Observable<AuthResponse> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    this.refreshInFlight$ = this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .pipe(
        tap((response) => {
          this.setSession(response);
        }),
        finalize(() => {
          this.refreshInFlight$ = null;
        }),
        shareReplay(1),
      );

    return this.refreshInFlight$;
  }

  setSession(response: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }
    this.token.set(response.accessToken);
    this.currentUser.set(response.user);
  }

  logout(): void {
    // Notify backend to purge session in Redis and clear HttpOnly cookie
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => undefined,
        error: (err) => console.warn('Logout notification error:', err),
      });

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.token.set(null);
    this.currentUser.set(null);

    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.disableAutoSelect();
    }

    this.router.navigate(['/']);
  }
}
