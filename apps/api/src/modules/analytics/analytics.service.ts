import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  UserLessonProgress,
  ProgressStatus,
} from '../../database/entities/user-lesson-progress.entity';
import { UserDailyStudyLog } from '../../database/entities/user-daily-study-log.entity';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { DailyActivityItemDto } from './dto/daily-activity-item.dto';
import { LessonStudyTimeItemDto } from './dto/lesson-study-time-item.dto';

const DEFAULT_DAILY_GOAL_MINUTES = 30;
const MIN_STREAK_SECONDS = 60; // Minimum 1 minute of active learning to count towards streak
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(UserLessonProgress)
    private readonly progressRepository: Repository<UserLessonProgress>,
    @InjectRepository(UserDailyStudyLog)
    private readonly dailyStudyLogRepository: Repository<UserDailyStudyLog>,
  ) {}

  /**
   * Computes high-level dashboard metrics for the authenticated learner.
   */
  async getDashboardSummary(userId: string): Promise<DashboardSummaryDto> {
    const today = new Date();
    const todayStr = this.formatDate(today);

    // 1. Total study seconds across all lessons
    const totalTimeResult = await this.progressRepository
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.total_time_spent_seconds), 0)', 'totalSeconds')
      .where('p.user_id = :userId', { userId })
      .getRawOne();

    const totalStudySeconds = parseInt(totalTimeResult?.totalSeconds || '0', 10);
    const totalStudyMinutes = Math.round(totalStudySeconds / 60);

    // 2. Completed & In-progress lesson counts
    const completedCount = await this.progressRepository.count({
      where: { userId, status: ProgressStatus.COMPLETED },
    });

    const inProgressCount = await this.progressRepository.count({
      where: { userId, status: ProgressStatus.IN_PROGRESS },
    });

    // 3. Weekly Activity: Last 7 days bucket
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    const sevenDaysAgoStr = this.formatDate(sevenDaysAgo);

    const logsLast7Days = await this.dailyStudyLogRepository.find({
      where: {
        userId,
        studyDate: Between(sevenDaysAgoStr, todayStr),
      },
    });

    const logMap = new Map<string, number>();
    logsLast7Days.forEach((l) => {
      // In PostgreSQL, DATE columns can be string "YYYY-MM-DD" or Date object
      const dateKey = typeof l.studyDate === 'string'
        ? l.studyDate.substring(0, 10)
        : this.formatDate(new Date(l.studyDate));
      logMap.set(dateKey, l.totalSeconds);
    });

    const weeklyActivity: DailyActivityItemDto[] = [];
    let todayStudySeconds = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = this.formatDate(d);
      const dayLabel = DAY_NAMES[d.getDay()];
      const isToday = dStr === todayStr;
      const seconds = logMap.get(dStr) || 0;
      const minutes = Math.round(seconds / 60);

      if (isToday) {
        todayStudySeconds = seconds;
      }

      weeklyActivity.push({
        date: dStr,
        dayLabel,
        minutes,
        isToday,
      });
    }

    const todayStudyMinutes = Math.round(todayStudySeconds / 60);
    const goalProgressPercent = Math.min(
      100,
      Math.round((todayStudyMinutes / DEFAULT_DAILY_GOAL_MINUTES) * 100),
    );

    // 4. Calculate Daily Streak
    const currentStreak = await this.calculateStreak(userId, todayStr);

    return {
      totalStudyMinutes,
      todayStudyMinutes,
      dailyGoalMinutes: DEFAULT_DAILY_GOAL_MINUTES,
      goalProgressPercent,
      currentStreak,
      completedLessonsCount: completedCount,
      inProgressLessonsCount: inProgressCount,
      weeklyActivity,
    };
  }

  /**
   * Returns per-lesson study time breakdown for the authenticated learner.
   */
  async getLessonStudyTimes(userId: string): Promise<LessonStudyTimeItemDto[]> {
    const progresses = await this.progressRepository.find({
      where: { userId },
      relations: ['lesson', 'lesson.course'],
      order: { lastListenedAt: 'DESC' },
    });

    return progresses
      .filter((p) => p.lesson)
      .map((p) => ({
        lessonId: p.lesson.id,
        lessonTitle: p.lesson.title,
        lessonSlug: p.lesson.slug,
        courseTitle: p.lesson.course?.title || 'Course',
        courseSlug: p.lesson.course?.slug || '',
        totalMinutesSpent: Math.round((p.totalTimeSpentSeconds || 0) / 60),
        status: p.status,
        lastListenedAt: p.lastListenedAt,
      }));
  }

  /**
   * Calculates consecutive days streak of learning.
   */
  private async calculateStreak(userId: string, todayStr: string): Promise<number> {
    const logs = await this.dailyStudyLogRepository
      .createQueryBuilder('log')
      .select('log.study_date', 'studyDate')
      .where('log.user_id = :userId', { userId })
      .andWhere('log.total_seconds >= :minSeconds', { minSeconds: MIN_STREAK_SECONDS })
      .orderBy('log.study_date', 'DESC')
      .getRawMany();

    if (!logs || logs.length === 0) {
      return 0;
    }

    const uniqueDates = Array.from(
      new Set(
        logs.map((l) =>
          typeof l.studyDate === 'string'
            ? l.studyDate.substring(0, 10)
            : this.formatDate(new Date(l.studyDate)),
        ),
      ),
    );

    const mostRecentDateStr = uniqueDates[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.formatDate(yesterday);

    // If the latest study date is neither today nor yesterday, streak is broken
    if (mostRecentDateStr !== todayStr && mostRecentDateStr !== yesterdayStr) {
      return 0;
    }

    let streak = 0;
    let expectedDate = new Date(mostRecentDateStr);

    for (const dateStr of uniqueDates) {
      const expDateStr = this.formatDate(expectedDate);
      if (dateStr === expDateStr) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Helper utility to format Date to YYYY-MM-DD string.
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
