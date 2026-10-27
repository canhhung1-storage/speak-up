import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import {
  LearnerService,
  LearnerCourse,
  LearnerCourseDetail,
} from '../../core/services/learner.service';

@Component({
  selector: 'app-course-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-shell">
      <!-- Top Navigation Bar -->
      <header class="top-nav">
        <div class="nav-container">
          <div class="brand-group">
            <a routerLink="/" class="brand-link" title="SpeakUp Home">
              <span class="brand-icon">S</span>
              <span class="brand-title">SpeakUp</span>
            </a>
            <span class="badge-role">Learner</span>
          </div>

          <div class="nav-actions">
            <!-- Theme Toggle Button -->
            <button
              type="button"
              class="icon-btn theme-btn"
              (click)="themeService.toggleTheme()"
              [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              aria-label="Toggle Theme"
            >
              @if (themeService.isDark()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              }
            </button>

            <!-- Admin CMS Link (if Admin) -->
            @if (authService.isAdmin()) {
              <a routerLink="/admin" class="btn-admin-cms" title="Access Admin Studio">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <span class="btn-admin-label">Admin Studio</span>
              </a>
            }

            <!-- User Pill -->
            <div class="user-pill">
              @if (authService.currentUser()?.avatarUrl && !imageFailed()) {
                <img
                  [src]="authService.currentUser()?.avatarUrl"
                  class="user-avatar"
                  alt="Avatar"
                  referrerpolicy="no-referrer"
                  (error)="imageFailed.set(true)"
                />
              } @else {
                <div class="avatar-fallback">
                  {{ getInitials(authService.currentUser()?.fullName) }}
                </div>
              }
              <span class="user-name">{{ authService.currentUser()?.fullName || 'Learner' }}</span>
              <button
                type="button"
                class="btn-logout"
                (click)="authService.logout()"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Body -->
      <main class="main-body">
        <div class="content-container">
          <!-- Hero Greeting Banner (High Contrast & Vibrant Gradient) -->
          <section class="hero-banner">
            <div class="hero-decor-circle circle-1"></div>
            <div class="hero-decor-circle circle-2"></div>
            <div class="hero-content">
              <div class="hero-badge">
                <span class="badge-dot"></span>
                <span>Effortless English Methodology</span>
              </div>
              <h1 class="hero-title">
                Welcome, {{ authService.currentUser()?.fullName || 'Learner' }}!
              </h1>
              <p class="hero-desc">
                Master deep listening and effortless spoken English without grammar translation. Select a course below to continue your journey.
              </p>
            </div>
          </section>

          <!-- Level Filters & Section Header -->
          <section class="section-toolbar">
            <div class="toolbar-title">
              <h2>Courses For You</h2>
              <p>Select your proficiency level to start your reflex listening journey</p>
            </div>

            <!-- Scrollable Pill Tabs on Mobile -->
            <div class="filter-tab-wrapper">
              <div class="filter-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  class="tab-btn"
                  [class.active]="selectedLevel() === 'ALL'"
                  (click)="selectLevel('ALL')"
                >
                  All ({{ courses().length }})
                </button>
                <button
                  type="button"
                  role="tab"
                  class="tab-btn"
                  [class.active]="selectedLevel() === 'BEGINNER'"
                  (click)="selectLevel('BEGINNER')"
                >
                  Beginner
                </button>
                <button
                  type="button"
                  role="tab"
                  class="tab-btn"
                  [class.active]="selectedLevel() === 'INTERMEDIATE'"
                  (click)="selectLevel('INTERMEDIATE')"
                >
                  Intermediate
                </button>
                <button
                  type="button"
                  role="tab"
                  class="tab-btn"
                  [class.active]="selectedLevel() === 'ADVANCED'"
                  (click)="selectLevel('ADVANCED')"
                >
                  Advanced
                </button>
              </div>
            </div>
          </section>

          <!-- 3 UI States -->

          <!-- 1. Loading Skeleton State -->
          @if (isLoading()) {
            <div class="course-grid">
              @for (item of [1, 2, 3]; track item) {
                <div class="course-card skeleton-card">
                  <div class="skeleton-thumb"></div>
                  <div class="skeleton-content">
                    <div class="skeleton-line w-30"></div>
                    <div class="skeleton-line w-80"></div>
                    <div class="skeleton-line w-60"></div>
                    <div class="skeleton-line w-100 mt-16"></div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- 2. Error State -->
          @else if (errorMsg()) {
            <div class="status-card error-card">
              <div class="status-icon">⚠️</div>
              <h3>Unable to load courses</h3>
              <p>{{ errorMsg() }}</p>
              <button type="button" class="btn-retry" (click)="loadCourses()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                <span>Try Again</span>
              </button>
            </div>
          }

          <!-- 3. Empty State -->
          @else if (filteredCourses().length === 0) {
            <div class="status-card empty-card">
              <div class="status-icon">📚</div>
              <h3>No courses available yet</h3>
              <p>No published courses found for this level at the moment.</p>
              @if (selectedLevel() !== 'ALL') {
                <button type="button" class="btn-retry" (click)="selectLevel('ALL')">
                  View all courses
                </button>
              }
            </div>
          }

          <!-- 4. Course Grid -->
          @else {
            <div class="course-grid">
              @for (course of filteredCourses(); track course.id) {
                <div
                  class="course-card"
                  role="button"
                  tabindex="0"
                  (click)="openCourseModal(course)"
                  (keyup.enter)="openCourseModal(course)"
                >
                  <div class="card-thumb-wrap">
                    @if (course.thumbnailUrl) {
                      <img [src]="course.thumbnailUrl" class="card-thumb" [alt]="course.title" loading="lazy" />
                    } @else {
                      <div class="thumb-fallback">
                        <span class="fallback-icon">🎧</span>
                        <span class="fallback-text">Effortless English</span>
                      </div>
                    }
                    <span class="level-badge" [attr.data-level]="course.level">
                      {{ getLevelText(course.level) }}
                    </span>
                  </div>

                  <div class="card-content">
                    <h3 class="course-title">{{ course.title }}</h3>
                    <p class="course-desc">
                      {{ course.description || 'Deep English reflex training based on the Effortless English methodology.' }}
                    </p>

                    <div class="card-footer">
                      <div class="lesson-count">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                        <span>{{ course.totalLessons || 0 }} lessons</span>
                      </div>

                      <button
                        type="button"
                        class="btn-explore"
                        (click)="$event.stopPropagation(); openCourseModal(course)"
                        aria-label="View lessons"
                      >
                        <span>Explore Course</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </main>

      <!-- Course Curriculum Modal / Mobile Bottom Sheet -->
      @if (isDetailModalOpen()) {
        <div
          class="modal-backdrop"
          role="button"
          tabindex="0"
          (click)="closeCourseModal()"
          (keyup.escape)="closeCourseModal()"
        >
          <div
            class="modal-dialog"
            role="dialog"
            aria-modal="true"
            tabindex="0"
            (click)="$event.stopPropagation()"
            (keyup)="$event.stopPropagation()"
          >
            <!-- Mobile Sheet Drag Handle -->
            <div class="sheet-drag-handle"></div>

            <div class="modal-header">
              <div class="modal-title-wrap">
                <span class="level-badge" [attr.data-level]="selectedCourse()?.level">
                  {{ getLevelText(selectedCourse()?.level || 'BEGINNER') }}
                </span>
                <h2>{{ selectedCourse()?.title }}</h2>
              </div>
              <button
                type="button"
                class="btn-close-modal"
                (click)="closeCourseModal()"
                aria-label="Close curriculum modal"
              >✕</button>
            </div>

            <div class="modal-body">
              @if (selectedCourse()?.description) {
                <p class="modal-desc">
                  {{ selectedCourse()?.description }}
                </p>
              }

              <div class="curriculum-header">
                <h3>Course Curriculum ({{ selectedCourse()?.lessons?.length || 0 }})</h3>
                <span class="curriculum-hint">Tap any lesson to start</span>
              </div>

              @if (isLoadingCourseDetail()) {
                <div class="modal-skeleton-list">
                  <div class="skeleton-line w-100 mb-12" style="height: 60px;"></div>
                  <div class="skeleton-line w-100 mb-12" style="height: 60px;"></div>
                  <div class="skeleton-line w-100 mb-12" style="height: 60px;"></div>
                </div>
              } @else if (!selectedCourse()?.lessons?.length) {
                <div class="empty-lessons">
                  <p>Lessons are being prepared for this course. Please check back soon!</p>
                </div>
              } @else {
                <div class="lesson-list">
                  @for (lesson of selectedCourse()?.lessons; track lesson.id; let idx = $index) {
                    <div
                      class="lesson-row"
                      role="button"
                      tabindex="0"
                      (click)="startLesson(selectedCourse()!.slug, lesson.slug)"
                      (keyup.enter)="startLesson(selectedCourse()!.slug, lesson.slug)"
                    >
                      <div class="lesson-index">{{ idx + 1 }}</div>
                      <div class="lesson-info">
                        <h4 class="lesson-name">{{ lesson.title }}</h4>
                        <p class="lesson-sub">{{ lesson.description || 'Story reading, core vocabulary, and reflex audio' }}</p>
                      </div>
                      <div class="lesson-arrow-pill" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="closeCourseModal()">Close</button>
              @if (selectedCourse()?.lessons?.length) {
                <button
                  type="button"
                  class="btn-primary-action"
                  (click)="startLesson(selectedCourse()!.slug, selectedCourse()!.lessons[0].slug)"
                >
                  <span>Start Lesson 1</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }

      .dashboard-shell {
        min-height: 100vh;
        background: var(--bg-main, #fcfcfd);
        color: var(--text-primary, #0f172a);
        display: flex;
        flex-direction: column;
      }

      /* 1. TOP NAV */
      .top-nav {
        background: var(--bg-surface, #ffffff);
        border-bottom: 1px solid var(--border-color, #e2e8f0);
        position: sticky;
        top: 0;
        z-index: 40;
        backdrop-filter: blur(12px);
      }

      .nav-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .brand-group, .brand-link, .nav-actions, .user-pill {
        display: flex;
        align-items: center;
      }

      .brand-group { gap: 10px; }
      .brand-link { gap: 10px; text-decoration: none; color: inherit; }

      .brand-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #fff;
        font-weight: 800;
        font-size: 1.15rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .brand-title {
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }

      .badge-role {
        display: none;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 9999px;
        background: rgba(37, 99, 235, 0.1);
        color: #2563eb;
      }

      .nav-actions { gap: 8px; }

      .icon-btn {
        min-width: 44px;
        min-height: 44px;
        background: var(--bg-surface-elevated, #f8fafc);
        border: 1px solid var(--border-color, #e2e8f0);
        color: inherit;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s, border-color 0.2s;
        &:hover { transform: translateY(-2px); border-color: #3b82f6; }
      }

      .btn-admin-cms {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 14px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        background: rgba(37, 99, 235, 0.08);
        color: #2563eb;
        border: 1px solid rgba(37, 99, 235, 0.2);
        text-decoration: none;
        &:hover { background: #2563eb; color: #fff; transform: translateY(-2px); }
        .btn-admin-label { display: none; }
      }

      .user-pill {
        min-height: 44px;
        gap: 8px;
        padding: 4px 6px 4px 4px;
        background: var(--bg-surface-elevated, #f8fafc);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 9999px;
      }

      .user-avatar, .avatar-fallback {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        object-fit: cover;
      }

      .avatar-fallback {
        background: #2563eb;
        color: #fff;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-name {
        font-size: 0.875rem;
        font-weight: 600;
        max-width: 130px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: none;
      }

      .btn-logout {
        min-width: 36px;
        min-height: 36px;
        background: transparent;
        border: none;
        color: #ef4444;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        &:hover { background: rgba(239, 68, 68, 0.12); }
      }

      /* 2. MAIN & HERO BANNER */
      .main-body {
        flex: 1;
        padding: 20px 16px 64px;
      }

      .content-container {
        max-width: 1280px;
        margin: 0 auto;
      }

      .hero-banner {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
        padding: 28px 20px;
        margin-bottom: 32px;
        background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #4f46e5 100%);
        color: #ffffff;
        box-shadow: 0 16px 36px -8px rgba(37, 99, 235, 0.35);
      }

      .hero-decor-circle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }

      .circle-1 {
        top: -60px;
        right: -40px;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
      }

      .circle-2 {
        bottom: -80px;
        right: 120px;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(147, 197, 253, 0.25) 0%, transparent 75%);
      }

      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 720px;
      }

      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 0.78rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.18);
        border: 1px solid rgba(255, 255, 255, 0.28);
        margin-bottom: 14px;
      }

      .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #34d399;
        box-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
      }

      .hero-title {
        font-size: clamp(1.4rem, 4vw, 2.25rem);
        font-weight: 800;
        line-height: 1.25;
        margin-bottom: 12px;
        color: #ffffff !important;
      }

      .hero-desc {
        font-size: clamp(0.9rem, 2.5vw, 1.05rem);
        color: rgba(255, 255, 255, 0.92);
        line-height: 1.6;
      }

      /* 3. TOOLBAR & FILTER TABS */
      .section-toolbar { margin-bottom: 24px; }

      .toolbar-title {
        margin-bottom: 16px;
        h2 { font-size: clamp(1.25rem, 3vw, 1.5rem); font-weight: 800; margin-bottom: 4px; }
        p { font-size: 0.875rem; color: var(--text-secondary, #64748b); }
      }

      .filter-tab-wrapper {
        overflow-x: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar { display: none; }
        margin: 0 -16px;
        padding: 0 16px;
      }

      .filter-tabs {
        display: inline-flex;
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-color, #e2e8f0);
        padding: 4px;
        border-radius: 14px;
        gap: 4px;
      }

      .tab-btn {
        min-height: 40px;
        background: transparent;
        border: none;
        color: var(--text-secondary, #64748b);
        font-size: 0.85rem;
        font-weight: 600;
        padding: 8px 16px;
        border-radius: 10px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s;
        &:hover { color: var(--text-primary, #0f172a); }
        &.active {
          background: #2563eb;
          color: #fff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      }

      /* 4. COURSE GRID & CARDS */
      .course-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .course-card {
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        box-shadow: var(--card-shadow, 0 8px 30px rgba(0, 0, 0, 0.04));
        transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: var(--card-shadow-hover, 0 16px 40px rgba(0, 0, 0, 0.08));
          border-color: rgba(37, 99, 235, 0.4);
          .card-thumb { transform: scale(1.04); }
          .btn-explore { background: #2563eb; color: #fff; border-color: #2563eb; }
        }
      }

      .card-thumb-wrap {
        position: relative;
        height: 180px;
        width: 100%;
        background: var(--bg-surface-elevated, #f8fafc);
        overflow: hidden;
      }

      .card-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }

      .thumb-fallback {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(79, 70, 229, 0.1));
        border-bottom: 1px solid var(--border-color, #e2e8f0);
        .fallback-icon { font-size: 2rem; }
        .fallback-text { font-weight: 700; font-size: 0.95rem; }
      }

      .level-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        color: #fff;
        line-height: 1.2;
        &[data-level='BEGINNER'] { background: #10b981; }
        &[data-level='INTERMEDIATE'] { background: #2563eb; }
        &[data-level='ADVANCED'] { background: #8b5cf6; }
      }

      .card-thumb .level-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 2;
      }

      .card-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .course-title {
        font-size: 1.2rem;
        font-weight: 800;
        margin-bottom: 8px;
        line-height: 1.35;
      }

      .course-desc {
        font-size: 0.885rem;
        color: var(--text-secondary, #64748b);
        line-height: 1.5;
        margin-bottom: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-footer {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 14px;
        border-top: 1px solid var(--border-color, #e2e8f0);
      }

      .lesson-count {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: var(--text-secondary, #64748b);
        font-weight: 600;
      }

      .btn-explore {
        min-height: 38px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: 700;
        background: var(--bg-surface-elevated, #f8fafc);
        color: inherit;
        border: 1px solid var(--border-color, #e2e8f0);
        cursor: pointer;
        transition: all 0.2s;
      }

      /* Skeletons & Status */
      .skeleton-thumb {
        height: 180px;
        background: var(--bg-surface-elevated, #f8fafc);
        animation: pulse 1.5s infinite;
      }

      .skeleton-content { padding: 24px; }

      .skeleton-line {
        height: 16px;
        background: var(--bg-surface-elevated, #f8fafc);
        border-radius: 8px;
        margin-bottom: 12px;
        animation: pulse 1.5s infinite;
        &.w-30 { width: 30%; }
        &.w-60 { width: 60%; }
        &.w-80 { width: 80%; }
        &.w-100 { width: 100%; }
        &.mt-16 { margin-top: 16px; }
        &.mb-12 { margin-bottom: 12px; }
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 0.3; }
      }

      .status-card {
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 20px;
        padding: 40px 20px;
        text-align: center;
        max-width: 480px;
        margin: 40px auto;
        .status-icon { font-size: 3rem; margin-bottom: 16px; }
        h3 { font-size: 1.35rem; font-weight: 700; margin-bottom: 8px; }
        p { font-size: 0.95rem; color: var(--text-secondary, #64748b); margin-bottom: 24px; }
      }

      .btn-retry {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 22px;
        border-radius: 12px;
        font-weight: 600;
        background: #2563eb;
        color: #fff;
        border: none;
        cursor: pointer;
      }

      /* 5. MODAL / FULL SCREEN MOBILE VIEW */
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        background: var(--bg-surface, #ffffff);
        z-index: 100;
        display: flex;
        flex-direction: column;
        padding: 0;
        overflow: hidden;
      }

      .modal-dialog {
        background: var(--bg-surface, #ffffff);
        border: none;
        border-radius: 0;
        width: 100%;
        max-width: 100%;
        height: 100%;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideInPage 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes slideInPage {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      .sheet-drag-handle {
        display: none;
      }

      .modal-header {
        flex-shrink: 0;
        padding: calc(14px + env(safe-area-inset-top, 0px)) 16px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid var(--border-color, #e2e8f0);
        background: var(--bg-surface, #ffffff);
      }

      .modal-title-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        flex: 1;
        min-width: 0;

        .level-badge {
          position: static;
          display: inline-flex;
        }

        h2 {
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1.3;
          margin: 0;
          word-break: break-word;
        }
      }

      .btn-close-modal {
        width: 38px;
        height: 38px;
        background: var(--bg-surface-elevated, #f8fafc);
        border: 1px solid var(--border-color, #e2e8f0);
        color: var(--text-secondary, #64748b);
        font-size: 1.15rem;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s, color 0.2s;
        &:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }
      }

      .modal-body {
        padding: 14px 18px 24px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1 1 auto;
        min-height: 0;
      }

      .modal-desc {
        font-size: 0.875rem;
        color: var(--text-secondary, #64748b);
        line-height: 1.55;
        margin-bottom: 16px;
      }

      .curriculum-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 12px;
        h3 { font-size: 0.95rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; color: var(--text-secondary, #64748b); }
        .curriculum-hint { font-size: 0.78rem; color: var(--text-muted, #94a3b8); }
      }

      .lesson-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .lesson-row {
        min-height: 58px;
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 14px;
        background: var(--bg-surface-elevated, #f8fafc);
        border: 1px solid var(--border-color, #e2e8f0);
        border-radius: 14px;
        cursor: pointer;
        transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        &:hover, &:focus-visible {
          background: rgba(37, 99, 235, 0.05);
          border-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
          .lesson-arrow-pill {
            background: #2563eb;
            color: #ffffff;
            transform: translateX(2px);
          }
        }
        &:active {
          transform: scale(0.99);
        }
      }

      .lesson-index {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: rgba(37, 99, 235, 0.1);
        font-weight: 800;
        font-size: 0.88rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2563eb;
        flex-shrink: 0;
      }

      .lesson-info {
        flex: 1;
        min-width: 0;
        .lesson-name {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 2px;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lesson-sub {
          font-size: 0.8rem;
          color: var(--text-secondary, #64748b);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .lesson-arrow-pill {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: transparent;
        color: var(--text-secondary, #64748b);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s ease;
      }

      .modal-footer {
        flex-shrink: 0;
        padding: 12px 18px calc(14px + env(safe-area-inset-bottom, 0px));
        display: flex;
        align-items: center;
        gap: 12px;
        border-top: 1px solid var(--border-color, #e2e8f0);
        background: var(--bg-surface, #ffffff);
      }

      .empty-lessons {
        text-align: center;
        padding: 32px 16px;
        color: var(--text-secondary, #64748b);
      }

      .btn-cancel {
        display: none;
        min-height: 46px;
        padding: 10px 18px;
        border-radius: 12px;
        background: transparent;
        border: 1px solid var(--border-color, #e2e8f0);
        color: var(--text-secondary, #64748b);
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
          background: var(--bg-surface-elevated, #f8fafc);
        }
      }

      .btn-primary-action {
        flex: 1;
        min-height: 48px;
        padding: 12px 20px;
        border-radius: 14px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #fff;
        font-weight: 700;
        font-size: 0.95rem;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        transition: transform 0.2s, box-shadow 0.2s;
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
        }
        &:active {
          transform: translateY(0);
        }
      }

      /* 6. MEDIA QUERIES (Adaptive Responsive) */
      @media (min-width: 640px) {
        .badge-role { display: inline-block; }
        .btn-admin-cms .btn-admin-label { display: inline; }
        .hero-banner { border-radius: 24px; padding: 40px 36px; margin-bottom: 40px; }
        .course-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        
        .modal-backdrop {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          justify-content: center;
          align-items: center;
          padding: 24px;
        }
        .modal-dialog {
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 24px;
          max-width: 620px;
          height: auto;
          max-height: 85vh;
          max-height: 85dvh;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25);
          animation: popInModal 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes popInModal {
          from {
            transform: scale(0.96);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .sheet-drag-handle { display: none; }
        .modal-header { padding: 18px 24px; }
        .modal-body { padding: 20px 24px; }
        .modal-footer {
          padding: 18px 24px;
          justify-content: flex-end;
        }
        .btn-cancel {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-primary-action {
          flex: 0 0 auto;
        }
      }

      @media (min-width: 768px) {
        .nav-container { padding: 14px 24px; }
        .user-name { display: inline-block; }
        .main-body { padding: 32px 24px 80px; }
        .section-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 32px; }
        .toolbar-title { margin-bottom: 0; }
        .filter-tab-wrapper { margin: 0; padding: 0; }
      }

      @media (min-width: 1024px) {
        .course-grid { grid-template-columns: repeat(3, 1fr); gap: 28px; }
      }
    `,
  ],
})
export class CourseDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly learnerService = inject(LearnerService);
  private readonly router = inject(Router);

  courses = signal<LearnerCourse[]>([]);
  isLoading = signal<boolean>(true);
  errorMsg = signal<string | null>(null);
  selectedLevel = signal<string>('ALL');
  imageFailed = signal<boolean>(false);

  // Modal / Drawer state
  isDetailModalOpen = signal<boolean>(false);
  isLoadingCourseDetail = signal<boolean>(false);
  selectedCourse = signal<LearnerCourseDetail | null>(null);

  filteredCourses = computed(() => {
    const lvl = this.selectedLevel();
    const list = this.courses();
    if (lvl === 'ALL') return list;
    return list.filter((c) => c.level === lvl);
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.errorMsg.set(null);

    this.learnerService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load courses:', err);
        this.errorMsg.set('Unable to connect to server. Please check your network and try again!');
        this.isLoading.set(false);
      },
    });
  }

  selectLevel(level: string): void {
    this.selectedLevel.set(level);
  }

  openCourseModal(course: LearnerCourse): void {
    this.isDetailModalOpen.set(true);
    this.isLoadingCourseDetail.set(true);
    this.selectedCourse.set(null);

    this.learnerService.getCourseBySlug(course.slug).subscribe({
      next: (detail) => {
        this.selectedCourse.set(detail);
        this.isLoadingCourseDetail.set(false);
      },
      error: (err) => {
        console.error('Failed to load course detail:', err);
        this.isLoadingCourseDetail.set(false);
      },
    });
  }

  closeCourseModal(): void {
    this.isDetailModalOpen.set(false);
    this.selectedCourse.set(null);
  }

  startLesson(courseSlug: string, lessonSlug: string): void {
    this.closeCourseModal();
    this.router.navigate(['/courses', courseSlug, 'lessons', lessonSlug]);
  }

  getLevelText(level: string): string {
    switch (level) {
      case 'BEGINNER':
        return 'Beginner';
      case 'INTERMEDIATE':
        return 'Intermediate';
      case 'ADVANCED':
        return 'Advanced';
      default:
        return level;
    }
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
