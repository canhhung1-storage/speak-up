import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-shell">
      <!-- Mobile Backdrop -->
      <div
        class="sidebar-overlay"
        [class.visible]="isSidebarOpen()"
        role="button"
        tabindex="0"
        (click)="closeSidebar()"
        (keyup.escape)="closeSidebar()"
      ></div>

      <!-- Left Sidebar -->
      <aside class="admin-sidebar" [class.open]="isSidebarOpen()">
        <div class="sidebar-header">
          <div class="logo-box">
            <div class="brand-icon">S</div>
            <div class="brand-meta">
              <span class="brand-name">SpeakUp</span>
              <span class="brand-tag">Admin Studio</span>
            </div>
          </div>
          <button class="close-btn" (click)="closeSidebar()" aria-label="Close Sidebar">✕</button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-label">Quản lý nội dung</div>
          <a
            routerLink="/admin/courses"
            routerLinkActive="active"
            class="nav-item"
            (click)="closeSidebar()"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Khóa học & Bài học</span>
          </a>

          <div class="nav-divider"></div>
          <div class="nav-label">Chuyển hướng</div>
          <a
            routerLink="/courses"
            class="nav-item"
            (click)="closeSidebar()"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Về Cổng Học Viên</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-profile">
            <ng-container *ngIf="user()?.avatarUrl; else fallbackAvatar">
              <img [src]="user()?.avatarUrl" [alt]="user()?.fullName" class="avatar" />
            </ng-container>
            <ng-template #fallbackAvatar>
              <div class="avatar">{{ user()?.fullName?.charAt(0) || 'A' }}</div>
            </ng-template>

            <div class="info">
              <span class="name" [title]="user()?.fullName">{{ user()?.fullName }}</span>
              <span class="role-badge">ADMIN</span>
            </div>
          </div>

          <div class="footer-actions">
            <button class="btn-action" (click)="toggleTheme()" title="Đổi giao diện Sáng / Tối">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="isDarkMode()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                <path *ngIf="!isDarkMode()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span>{{ isDarkMode() ? 'Sáng' : 'Tối' }}</span>
            </button>
            <button class="btn-action" (click)="logout()" title="Đăng xuất">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Thoát</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Shell Area -->
      <div class="admin-main">
        <header class="admin-topbar">
          <div class="topbar-left">
            <button class="mobile-menu-btn" (click)="openSidebar()" aria-label="Open Navigation">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="topbar-title">Hệ Thống Quản Trị Nội Dung</h1>
          </div>

          <div class="topbar-right">
            <a href="/api/docs" target="_blank" class="swagger-pill" title="Mở Interactive Swagger OpenAPI Documentation">
              <span class="dot"></span>
              <span>OpenAPI Docs</span>
            </a>
          </div>
        </header>

        <main class="admin-content-body">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;
  readonly isDarkMode = computed(() => this.themeService.isDark());
  readonly isSidebarOpen = signal<boolean>(false);

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
