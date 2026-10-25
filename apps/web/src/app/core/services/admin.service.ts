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

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

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

export interface UpdateLessonDto extends Partial<CreateLessonDto> {}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/admin';

  // --- Course APIs ---
  getCourses(): Observable<AdminCourse[]> {
    return this.http.get<AdminCourse[]>(`${this.baseUrl}/courses`);
  }

  getCourse(id: string): Observable<AdminCourse> {
    return this.http.get<AdminCourse>(`${this.baseUrl}/courses/${id}`);
  }

  createCourse(dto: CreateCourseDto): Observable<AdminCourse> {
    return this.http.post<AdminCourse>(`${this.baseUrl}/courses`, dto);
  }

  updateCourse(id: string, dto: UpdateCourseDto): Observable<AdminCourse> {
    return this.http.put<AdminCourse>(`${this.baseUrl}/courses/${id}`, dto);
  }

  toggleCoursePublish(id: string, isPublished: boolean): Observable<AdminCourse> {
    return this.http.patch<AdminCourse>(`${this.baseUrl}/courses/${id}/publish`, {
      isPublished,
    });
  }

  deleteCourse(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/courses/${id}`,
    );
  }

  // --- Lesson APIs ---
  getLessonsByCourse(courseId: string): Observable<AdminLessonDetail[]> {
    return this.http.get<AdminLessonDetail[]>(
      `${this.baseUrl}/courses/${courseId}/lessons`,
    );
  }

  getLesson(id: string): Observable<AdminLessonDetail> {
    return this.http.get<AdminLessonDetail>(`${this.baseUrl}/lessons/${id}`);
  }

  createLesson(courseId: string, dto: CreateLessonDto): Observable<AdminLessonDetail> {
    return this.http.post<AdminLessonDetail>(
      `${this.baseUrl}/courses/${courseId}/lessons`,
      dto,
    );
  }

  updateLesson(id: string, dto: UpdateLessonDto): Observable<AdminLessonDetail> {
    return this.http.put<AdminLessonDetail>(`${this.baseUrl}/lessons/${id}`, dto);
  }

  deleteLesson(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/lessons/${id}`,
    );
  }
}
