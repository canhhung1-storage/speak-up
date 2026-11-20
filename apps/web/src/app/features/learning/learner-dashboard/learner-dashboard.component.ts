import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import {
  LearnerService,
  DashboardSummaryResponse,
  LessonStudyTimeItem,
} from '../../../core/services/learner.service';

@Component({
  selector: 'app-learner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.scss'],
})
export class LearnerDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly learnerService = inject(LearnerService);
  private readonly router = inject(Router);

  readonly summary = signal<DashboardSummaryResponse | null>(null);
  readonly lessonTimes = signal<LessonStudyTimeItem[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  readonly imageFailed = signal<boolean>(false);

  // Filtered Lessons computed by search query
  readonly filteredLessonTimes = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.lessonTimes();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.lessonTitle.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q),
    );
  });

  // Calculate maximum minutes in weekly activity for dynamic chart scaling
  readonly maxWeeklyMinutes = computed(() => {
    const s = this.summary();
    if (!s || !s.weeklyActivity || s.weeklyActivity.length === 0) return 60;
    const maxVal = Math.max(...s.weeklyActivity.map((a) => a.minutes), 30);
    // Round up to nearest multiple of 15
    return Math.ceil(maxVal / 15) * 15;
  });

  // Formatted Total Study Time
  readonly formattedTotalHours = computed(() => {
    const mins = this.summary()?.totalStudyMinutes || 0;
    return this.formatMinutes(mins);
  });

  // Formatted Today Study Time
  readonly formattedTodayStudyTime = computed(() => {
    const mins = this.summary()?.todayStudyMinutes || 0;
    return this.formatMinutes(mins);
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Call both endpoints in parallel
    this.learnerService.getDashboardAnalytics().subscribe({
      next: (summaryData) => {
        this.summary.set(summaryData);

        // Fetch detailed lesson times
        this.learnerService.getLessonStudyTimes().subscribe({
          next: (lessonData) => {
            this.lessonTimes.set(lessonData);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Failed to load lesson study times:', err);
            this.isLoading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Failed to load dashboard analytics:', err);
        this.errorMessage.set(
          'Unable to load your learning dashboard. Please check your network and try again.',
        );
        this.isLoading.set(false);
      },
    });
  }

  formatMinutes(totalMins: number): string {
    if (!totalMins || totalMins <= 0) return '0m';
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  getBarHeightPercent(minutes: number): number {
    const max = this.maxWeeklyMinutes();
    if (!max || max <= 0) return 0;
    return Math.min(100, Math.max(8, (minutes / max) * 100));
  }

  navigateToLesson(courseSlug: string, lessonSlug: string): void {
    this.router.navigate(['/courses', courseSlug, 'lessons', lessonSlug]);
  }

  onSearchChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}
