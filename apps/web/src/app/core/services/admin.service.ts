import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished: boolean;
  orderIndex: number;
  totalLessons: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  title: string;
  slug?: string;
  description?: string;
  thumbnailUrl?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished?: boolean;
  orderIndex?: number;
}

export type UpdateCourseDto = Partial<CreateCourseDto>;

export interface AdminArticle {
  id?: string;
  title: string;
  content: string;
  audioUrl?: string;
  durationSeconds?: number;
}

export interface AdminVocabulary {
  id?: string;
  word: string;
  ipa?: string;
  meaningVi: string;
  definitionEn?: string;
  exampleSentence?: string;
  audioUrl?: string;
  orderIndex?: number;
}

export interface AdminAudio {
  id?: string;
  audioType: 'MINI_STORY' | 'COMMENTARY' | 'POV';
  title: string;
  audioUrl: string;
  transcript?: string;
  durationSeconds?: number;
  orderIndex?: number;
}

export interface AdminLessonDetail {
  id: string;
  courseId: string;
  courseSlug?: string;
  title: string;
  slug: string;
  description?: string;
  vocabAudioUrl?: string;
  orderIndex: number;
  hasArticle: boolean;
  totalVocabularies: number;
  totalAudios: number;
  createdAt: string;
  updatedAt: string;
  article?: AdminArticle | null;
  vocabularies?: AdminVocabulary[];
  audios?: AdminAudio[];
}

export interface CreateLessonDto {
  title: string;
  slug?: string;
  description?: string;
  vocabAudioUrl?: string;
  orderIndex?: number;
  article?: AdminArticle;
  vocabularies?: AdminVocabulary[];
  audios?: AdminAudio[];
}

export type UpdateLessonDto = Partial<CreateLessonDto>;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/admin';

  // --- Course APIs (Support both ID and Slug) ---
  getCourses(): Observable<AdminCourse[]> {
    return this.http.get<AdminCourse[]>(`${this.baseUrl}/courses`);
  }

  getCourse(idOrSlug: string): Observable<AdminCourse> {
    return this.http.get<AdminCourse>(`${this.baseUrl}/courses/${idOrSlug}`);
  }

  createCourse(dto: CreateCourseDto): Observable<AdminCourse> {
    return this.http.post<AdminCourse>(`${this.baseUrl}/courses`, dto);
  }

  updateCourse(idOrSlug: string, dto: UpdateCourseDto): Observable<AdminCourse> {
    return this.http.put<AdminCourse>(`${this.baseUrl}/courses/${idOrSlug}`, dto);
  }

  toggleCoursePublish(idOrSlug: string, isPublished: boolean): Observable<AdminCourse> {
    return this.http.patch<AdminCourse>(`${this.baseUrl}/courses/${idOrSlug}/publish`, {
      isPublished,
    });
  }

  deleteCourse(idOrSlug: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/courses/${idOrSlug}`,
    );
  }

  // --- Lesson APIs (Support both ID and Slug) ---
  getLessonsByCourse(courseIdOrSlug: string): Observable<AdminLessonDetail[]> {
    return this.http.get<AdminLessonDetail[]>(
      `${this.baseUrl}/courses/${courseIdOrSlug}/lessons`,
    );
  }

  getLesson(idOrSlug: string, courseIdOrSlug?: string): Observable<AdminLessonDetail> {
    if (courseIdOrSlug) {
      return this.http.get<AdminLessonDetail>(
        `${this.baseUrl}/courses/${courseIdOrSlug}/lessons/${idOrSlug}`,
      );
    }
    return this.http.get<AdminLessonDetail>(`${this.baseUrl}/lessons/${idOrSlug}`);
  }

  createLesson(courseIdOrSlug: string, dto: CreateLessonDto): Observable<AdminLessonDetail> {
    return this.http.post<AdminLessonDetail>(
      `${this.baseUrl}/courses/${courseIdOrSlug}/lessons`,
      dto,
    );
  }

  updateLesson(
    idOrSlug: string,
    dto: UpdateLessonDto,
    courseIdOrSlug?: string,
  ): Observable<AdminLessonDetail> {
    if (courseIdOrSlug) {
      return this.http.put<AdminLessonDetail>(
        `${this.baseUrl}/courses/${courseIdOrSlug}/lessons/${idOrSlug}`,
        dto,
      );
    }
    return this.http.put<AdminLessonDetail>(`${this.baseUrl}/lessons/${idOrSlug}`, dto);
  }

  deleteLesson(idOrSlug: string, courseIdOrSlug?: string): Observable<{ success: boolean; message: string }> {
    if (courseIdOrSlug) {
      return this.http.delete<{ success: boolean; message: string }>(
        `${this.baseUrl}/courses/${courseIdOrSlug}/lessons/${idOrSlug}`,
      );
    }
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/lessons/${idOrSlug}`,
    );
  }

  reorderLessons(courseIdOrSlug: string, lessonIds: string[]): Observable<AdminLessonDetail[]> {
    return this.http.patch<AdminLessonDetail[]>(
      `${this.baseUrl}/courses/${courseIdOrSlug}/lessons/reorder`,
      { lessonIds },
    );
  }
}
