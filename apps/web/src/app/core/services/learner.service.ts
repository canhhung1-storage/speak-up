import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  content: string;
  audioUrl?: string;
  durationSeconds?: number;
}

export interface LearnerVocabulary {
  id: string;
  word: string;
  ipa?: string;
  meaningVi: string;
  definitionEn?: string;
  exampleSentence?: string;
  audioUrl?: string;
  orderIndex: number;
}

export interface LearnerAudioTrack {
  id: string;
  audioType: 'MAIN_STORY' | 'MINI_STORY' | 'POINT_OF_VIEW' | 'COMMENTARY' | string;
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
  vocabAudioUrl?: string;
  article?: LearnerArticle;
  vocabularies: LearnerVocabulary[];
  audios: LearnerAudioTrack[];
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
}
