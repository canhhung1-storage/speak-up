import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LearnerCourse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  orderIndex: number;
  totalLessons: number;
  createdAt?: string;
}

export interface CourseLessonItem {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  description?: string;
}

export interface LearnerCourseDetail extends LearnerCourse {
  lessons: CourseLessonItem[];
}

export interface LearnerArticle {
  id: string;
  title: string;
  content?: string;
  audioUrl?: string;
  durationSeconds?: number;
}

export interface LearnerVocabulary {
  id: string;
  word: string;
  definitionEn?: string;
  exampleSentence?: string;
  orderIndex: number;
}

export interface LearnerAudioTrack {
  id: string;
  audioType: 'VOCABULARY' | 'MAIN_STORY' | 'MINI_STORY' | 'POINT_OF_VIEW' | 'COMMENTARY' | string;
  title: string;
  audioUrl: string;
  transcript?: string;
  durationSeconds?: number;
  orderIndex: number;
}

export interface LearnerLessonDetail {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  title: string;
  slug: string;
  orderIndex: number;
  description?: string;
  article?: LearnerArticle;
  vocabularies: LearnerVocabulary[];
  audios: LearnerAudioTrack[];
}

export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface LessonProgressResponse {
  lessonId: string;
  lessonSlug: string;
  status: ProgressStatus;
  isCompleted: boolean;
  lastTrackId?: string;
  lastPlayedSeconds: number;
  playbackPositions: Record<string, number>;
  lastListenedAt: string;
  completedAt?: string;
}

export interface CourseProgressResponse {
  courseId: string;
  courseSlug: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  lastAccessedLessonSlug?: string;
  lessons: LessonProgressResponse[];
}

export interface UpdateProgressDto {
  status?: ProgressStatus;
  lastTrackId?: string;
  lastPlayedSeconds?: number;
  playbackPositions?: Record<string, number>;
  isCompleted?: boolean;
  timeSpentDeltaSeconds?: number;
}

export interface DailyActivityItem {
  date: string;
  dayLabel: string;
  minutes: number;
  isToday: boolean;
}

export interface DashboardSummaryResponse {
  totalStudyMinutes: number;
  todayStudyMinutes: number;
  dailyGoalMinutes: number;
  goalProgressPercent: number;
  currentStreak: number;
  completedLessonsCount: number;
  inProgressLessonsCount: number;
  weeklyActivity: DailyActivityItem[];
}

export interface LessonStudyTimeItem {
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  courseTitle: string;
  courseSlug: string;
  totalMinutesSpent: number;
  status: ProgressStatus;
  lastListenedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class LearnerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Lấy danh sách tất cả khóa học công khai đã xuất bản
   */
  getCourses(): Observable<LearnerCourse[]> {
    return this.http.get<LearnerCourse[]>(`${this.baseUrl}/courses`);
  }

  /**
   * Lấy chi tiết khóa học theo slug kèm danh sách bài học
   */
  getCourseBySlug(slug: string): Observable<LearnerCourseDetail> {
    return this.http.get<LearnerCourseDetail>(`${this.baseUrl}/courses/${slug}`);
  }

  /**
   * Lấy thông tin bài học đầy đủ (Bài đọc, từ vựng, audios) cho phòng học Effortless Studio
   */
  getLessonDetail(courseSlug: string, lessonSlug: string): Observable<LearnerLessonDetail> {
    return this.http.get<LearnerLessonDetail>(
      `${this.baseUrl}/courses/${courseSlug}/lessons/${lessonSlug}`,
    );
  }

  /**
   * Lấy tiến độ học tập tổng thể của một khóa học
   */
  getCourseProgress(courseSlugOrId: string): Observable<CourseProgressResponse> {
    return this.http.get<CourseProgressResponse>(
      `${this.baseUrl}/progress/courses/${courseSlugOrId}`,
    );
  }

  /**
   * Lấy tiến độ học tập của một bài học cụ thể
   */
  getLessonProgress(
    lessonSlugOrId: string,
    courseSlugOrId?: string,
  ): Observable<LessonProgressResponse> {
    let params = new HttpParams();
    if (courseSlugOrId) {
      params = params.set('course', courseSlugOrId);
    }
    return this.http.get<LessonProgressResponse>(
      `${this.baseUrl}/progress/lessons/${lessonSlugOrId}`,
      { params },
    );
  }

  /**
   * Cập nhật tiến độ học tập bài học (vị trí giây nghe, track đang phát, trạng thái hoàn thành)
   */
  updateLessonProgress(
    lessonSlugOrId: string,
    dto: UpdateProgressDto,
    courseSlugOrId?: string,
  ): Observable<LessonProgressResponse> {
    let params = new HttpParams();
    if (courseSlugOrId) {
      params = params.set('course', courseSlugOrId);
    }
    return this.http.put<LessonProgressResponse>(
      `${this.baseUrl}/progress/lessons/${lessonSlugOrId}`,
      dto,
      { params },
    );
  }

  /**
   * Lấy số liệu phân tích tổng quan cho trang Dashboard (Tổng thời gian, Streak, Biểu đồ tuần)
   */
  getDashboardAnalytics(): Observable<DashboardSummaryResponse> {
    return this.http.get<DashboardSummaryResponse>(`${this.baseUrl}/analytics/dashboard`);
  }

  /**
   * Lấy chi tiết thời gian học tập trên từng bài học
   */
  getLessonStudyTimes(): Observable<LessonStudyTimeItem[]> {
    return this.http.get<LessonStudyTimeItem[]>(`${this.baseUrl}/analytics/lessons`);
  }
}
