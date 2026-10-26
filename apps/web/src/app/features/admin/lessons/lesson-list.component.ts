import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminService, AdminCourse, AdminLessonDetail } from '../../../core/services/admin.service';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DragDropModule],
  template: `
    <div class="lessons-management">
      <!-- Breadcrumb -->
      <div class="breadcrumb-nav">
        <a routerLink="/admin/courses" class="btn-back">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Quay lại Quản lý Khóa học</span>
        </a>
      </div>

      <!-- Header -->
      <header class="page-header">
        <div class="header-info">
          <h2>Bài Học: {{ course()?.title || 'Đang tải...' }}</h2>
          <p>Quản lý nội dung bài đọc, từ vựng và hệ thống audio phản xạ của khóa học này</p>
        </div>

        <div class="header-actions">
          @if (isSavingOrder()) {
            <span class="order-status-badge saving">
              <span class="pulse-dot"></span>
              Đang lưu thứ tự...
            </span>
          } @else if (orderSaveSuccess()) {
            <span class="order-status-badge saved">
              ✓ Đã lưu thứ tự bài học
            </span>
          }

          <a
            [routerLink]="['/admin/courses', courseSlug(), 'lessons', 'create']"
            class="btn-primary"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm Bài Học Mới</span>
          </a>
        </div>
      </header>

      <!-- Table Card -->
      <div class="table-card">
        <!-- Loading -->
        <div *ngIf="isLoading()" class="state-box">
          <div class="spinner"></div>
          <p>Đang tải danh sách bài học...</p>
        </div>

        <!-- Error -->
        <div *ngIf="errorMessage() && !isLoading()" class="state-box" style="color: #ef4444;">
          <p>{{ errorMessage() }}</p>
          <button class="btn-action" style="margin: 1rem auto 0;" (click)="loadData()">Thử lại</button>
        </div>

        <!-- Empty -->
        <div *ngIf="!isLoading() && !errorMessage() && lessons().length === 0" class="state-box">
          <p>Khóa học này hiện chưa có bài học nào. Hãy thêm bài học đầu tiên!</p>
        </div>

        <!-- Lessons Table with Drag & Drop -->
        <div class="table-responsive" *ngIf="!isLoading() && !errorMessage() && lessons().length > 0">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 48px; text-align: center;" title="Kéo thả để sắp xếp">Sắp xếp</th>
                <th style="width: 70px;">Thứ tự</th>
                <th>Tên bài học</th>
                <th>Mô tả</th>
                <th>Dữ liệu thành phần</th>
                <th style="text-align: right;">Hành động</th>
              </tr>
            </thead>
            <tbody
              cdkDropList
              (cdkDropListDropped)="onDrop($event)"
              [cdkDropListData]="lessons()"
            >
              <tr
                *ngFor="let lesson of lessons()"
                cdkDrag
                [cdkDragData]="lesson"
                class="draggable-row"
              >
                <!-- Drag Handle -->
                <td
                  class="drag-handle-cell"
                  cdkDragHandle
                  title="Giữ chuột và kéo thả để đổi thứ tự"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="5" r="1"/>
                    <circle cx="9" cy="12" r="1"/>
                    <circle cx="9" cy="19" r="1"/>
                    <circle cx="15" cy="5" r="1"/>
                    <circle cx="15" cy="12" r="1"/>
                    <circle cx="15" cy="19" r="1"/>
                  </svg>
                </td>

                <!-- Order Index -->
                <td style="font-weight: 700; color: #3b82f6;">#{{ lesson.orderIndex }}</td>

                <!-- Title & Slug -->
                <td>
                  <div class="lesson-info">
                    <span class="title">{{ lesson.title }}</span>
                    <span class="slug">/lessons/{{ lesson.slug }}</span>
                  </div>
                </td>

                <!-- Description -->
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-secondary); font-size: 0.85rem;">
                  {{ lesson.description || 'Chưa có mô tả' }}
                </td>

                <!-- Components badges -->
                <td>
                  <div class="components-pill-group">
                    <span
                      class="content-badge badge-article"
                      *ngIf="lesson.hasArticle"
                      title="Có bài đọc"
                    >
                      ✓ Bài đọc
                    </span>
                    <span
                      class="content-badge badge-vocab"
                      *ngIf="lesson.totalVocabularies > 0"
                    >
                      {{ lesson.totalVocabularies }} Từ vựng
                    </span>
                    <span
                      class="content-badge badge-audio"
                      *ngIf="lesson.totalAudios > 0"
                    >
                      {{ lesson.totalAudios }} Audio phụ
                    </span>
                  </div>
                </td>

                <!-- Action Buttons -->
                <td>
                  <div class="actions-cell" style="justify-content: flex-end;">
                    <a
                      [routerLink]="['/admin/courses', courseSlug(), 'lessons', lesson.slug || lesson.id, 'edit']"
                      class="btn-action btn-studio"
                      title="Chỉnh sửa nội dung trong Studio"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Vào Studio</span>
                    </a>
                    <button
                      class="btn-action btn-delete"
                      (click)="confirmDelete(lesson)"
                      title="Xóa bài học"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./lesson-list.component.scss'],
})
export class LessonListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);

  readonly courseSlug = signal<string>('');
  readonly courseId = signal<string>('');
  readonly course = signal<AdminCourse | null>(null);
  readonly lessons = signal<AdminLessonDetail[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly isSavingOrder = signal<boolean>(false);
  readonly orderSaveSuccess = signal<boolean>(false);

  ngOnInit(): void {
    const param =
      this.route.snapshot.paramMap.get('courseSlug') ||
      this.route.snapshot.paramMap.get('courseId');
    if (param) {
      this.courseSlug.set(param);
      this.courseId.set(param);
      this.loadData();
    }
  }

  loadData(): void {
    const ref = this.courseSlug() || this.courseId();
    if (!ref) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Fetch Course info
    this.adminService.getCourse(ref).subscribe({
      next: (courseData: AdminCourse) => {
        this.course.set(courseData);
        if (courseData.slug) {
          this.courseSlug.set(courseData.slug);
        }
        this.courseId.set(courseData.id);
      },
      error: () => {
        this.errorMessage.set('Không thể tải thông tin khóa học.');
      },
    });

    // Fetch Lessons
    this.adminService.getLessonsByCourse(ref).subscribe({
      next: (lessonsData: AdminLessonDetail[]) => {
        this.lessons.set(lessonsData);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Không thể tải danh sách bài học.');
        this.isLoading.set(false);
      },
    });
  }

  onDrop(event: CdkDragDrop<AdminLessonDetail[]>): void {
    if (event.previousIndex === event.currentIndex) return;

    const currentList = [...this.lessons()];
    moveItemInArray(currentList, event.previousIndex, event.currentIndex);

    // Optimistic UI update: re-index orderIndex 1, 2, 3...
    const reindexedList = currentList.map((item, index) => ({
      ...item,
      orderIndex: index + 1,
    }));
    this.lessons.set(reindexedList);

    // Trigger backend reorder transaction
    const lessonIds = reindexedList.map((l) => l.id);
    this.isSavingOrder.set(true);

    this.adminService.reorderLessons(this.courseSlug() || this.courseId(), lessonIds).subscribe({
      next: () => {
        this.isSavingOrder.set(false);
        this.orderSaveSuccess.set(true);
        setTimeout(() => this.orderSaveSuccess.set(false), 3000);
      },
      error: (err: unknown) => {
        console.error('Failed to reorder lessons:', err);
        this.isSavingOrder.set(false);
        alert('Lỗi: Không thể lưu thứ tự bài học mới!');
        this.loadData(); // Rollback
      },
    });
  }

  confirmDelete(lesson: AdminLessonDetail): void {
    const confirmed = confirm(
      `Bạn có chắc chắn muốn xóa bài học "${lesson.title}"?\nNội dung bài đọc, từ vựng và audio phụ liên quan sẽ bị xóa!`,
    );
    if (!confirmed) return;

    this.adminService.deleteLesson(lesson.id).subscribe({
      next: () => {
        this.lessons.update((list: AdminLessonDetail[]) => list.filter((l: AdminLessonDetail) => l.id !== lesson.id));
      },
      error: () => {
        alert('Lỗi: Không thể xóa bài học.');
      },
    });
  }
}
