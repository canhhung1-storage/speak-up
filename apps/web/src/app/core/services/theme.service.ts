import { Injectable, signal, effect } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'speakup-theme';
  readonly currentTheme = signal<AppTheme>(this.getInitialTheme());

  constructor() {
    // Tự động áp dụng data-theme lên thẻ <html> mỗi khi signal thay đổi
    effect(() => {
      const theme = this.currentTheme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.THEME_KEY, theme);
      }
    });
  }

  private getInitialTheme(): AppTheme {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as AppTheme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // Mặc định ban đầu theo giao diện mẫu sáng (Light Mode)
      return 'light';
    }
    return 'light';
  }

  toggleTheme(): void {
    const nextTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(nextTheme);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
