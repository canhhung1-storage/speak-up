import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminCourse } from '../../../core/services/admin.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="courses-management">
      <!-- Header -->
      <header class="page-header">
        <div class="header-info">
          <h2>Quản Lý Khóa Học</h2>
          <p>Tạo mới, biên tập và cấu hình phát hành các khóa học trên nền tảng SpeakUp</p>
        </div>
        <button class="btn-primary" (click)="openCreateModal()">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Thêm Khóa Học Mới</span>
        </button>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Tổng số khóa học</span>
          <span class="stat-value">{{ courses().length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Đang phát hành</span>
          <span class="stat-value" style="color: #10b981;">{{ publishedCount() }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Tổng số bài học</span>
          <span class="stat-value" style="color: #3b82f6;">{{ totalLessonsCount() }}</span>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="table-card">
        <div class="table-toolbar">
          <div class="search-box">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
            />
          </div>
        </div>

        <!-- 3-State Rule: Loading -->
        <div *ngIf="isLoading()" class="state-box">
          <div class="spinner"></div>
          <p>Đang tải danh sách khóa học...</p>
        </div>

        <!-- 3-State Rule: Error -->
        <div *ngIf="errorMessage() && !isLoading()" class="state-box" style="color: #ef4444;">
          <p>{{ errorMessage() }}</p>
          <button class="btn-action" style="margin: 1rem auto 0;" (click)="loadCourses()">Thử lại</button>
        </div>

        <!-- 3-State Rule: Empty -->
        <div *ngIf="!isLoading() && !errorMessage() && filteredCourses().length === 0" class="state-box">
          <p>Chưa có khóa học nào hoặc không khớp với từ khóa tìm kiếm.</p>
        </div>

        <!-- Table View -->
        <div class="table-responsive" *ngIf="!isLoading() && !errorMessage() && filteredCourses().length > 0">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 60px;">Thứ tự</th>
                <th>Khóa học</th>
                <th>Cấp độ</th>
                <th>Bài học</th>
                <th>Phát hành</th>
                <th style="text-align: right;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let course of filteredCourses()">
                <td style="font-weight: 600; color: var(--text-muted);">#{{ course.orderIndex }}</td>
                <td>
                  <div class="course-cell">
                    <img
                      [src]="course.thumbnailUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80'"
                      [alt]="course.title"
                      class="course-thumb"
                    />
                    <div class="course-info">
                      <span class="title">{{ course.title }}</span>
                      <span class="slug">/courses/{{ course.slug }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    class="badge-level"
                    [ngClass]="{
                      'level-beginner': course.level === 'BEGINNER',
                      'level-intermediate': course.level === 'INTERMEDIATE',
                      'level-advanced': course.level === 'ADVANCED'
                    }"
                  >
                    {{ course.level }}
                  </span>
                </td>
                <td>
                  <strong>{{ course.totalLessons }}</strong> bài
                </td>
                <td>
                  <label class="toggle-switch" title="Chuyển trạng thái xuất bản">
                    <input
                      type="checkbox"
                      [checked]="course.isPublished"
                      (change)="togglePublish(course, $event)"
                    />
                    <span class="slider"></span>
                  </label>
                </td>
                <td>
                  <div class="actions-cell" style="justify-content: flex-end;">
                    <a
                      [routerLink]="['/admin/courses', course.id, 'lessons']"
                      class="btn-action btn-lessons"
                      title="Quản lý danh sách bài học"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Bài học ({{ course.totalLessons }})</span>
                    </a>
                    <button
                      class="btn-action"
                      (click)="openEditModal(course)"
                      title="Sửa thông tin khóa học"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Sửa</span>
                    </button>
                    <button
                      class="btn-action btn-delete"
                      (click)="confirmDelete(course)"
                      title="Xóa khóa học"
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

      <!-- Add / Edit Modal -->
      <div class="modal-backdrop" *ngIf="isModalOpen()">
        <div class="modal-card">
          <div class="modal-header">
            <h3>{{ editingCourseId() ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Mới' }}</h3>
            <button class="close-btn" (click)="closeModal()">✕</button>
          </div>

          <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
            <div class="modal-body">
              <div class="form-group">
                <label>Tên Khóa Học *</label>
                <input
                  type="text"
                  formControlName="title"
                  placeholder="Ví dụ: Power English, VIP Global..."
                  (input)="onTitleChange()"
                />
              </div>

              <div class="form-group">
                <label>Đường dẫn tĩnh (Slug)</label>
                <input
                  type="text"
                  formControlName="slug"
                  placeholder="power-english"
                />
                <span class="helper-text">Để trống để hệ thống tự tạo tự động từ tiêu đề.</span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Cấp độ (Level) *</label>
                  <select formControlName="level">
                    <option value="BEGINNER">BEGINNER (Cơ bản)</option>
                    <option value="INTERMEDIATE">INTERMEDIATE (Trung cấp)</option>
                    <option value="ADVANCED">ADVANCED (Nâng cao)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Thứ tự hiển thị</label>
                  <input type="number" formControlName="orderIndex" min="1" />
                </div>
              </div>

              <div class="form-group">
                <label>Ảnh đại diện (Thumbnail URL)</label>
                <input
                  type="text"
                  formControlName="thumbnailUrl"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div class="form-group">
                <label>Mô tả chi tiết</label>
                <textarea
                  rows="3"
                  formControlName="description"
                  placeholder="Mô tả mục tiêu, đối tượng và phương pháp học của khóa..."
                ></textarea>
              </div>

              <div class="checkbox-group">
                <input type="checkbox" id="isPublished" formControlName="isPublished" />
                <label for="isPublished">Xuất bản công khai cho học viên truy cập ngay</label>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="closeModal()">Hủy</button>
              <button
                type="submit"
                class="btn-submit"
                [disabled]="courseForm.invalid || isSaving()"
              >
                {{ isSaving() ? 'Đang lưu...' : (editingCourseId() ? 'Cập nhật' : 'Tạo mới') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly courses = signal<AdminCourse[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly isModalOpen = signal<boolean>(false);
  readonly editingCourseId = signal<string | null>(null);
  readonly isSaving = signal<boolean>(false);

  readonly courseForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    slug: [''],
    description: [''],
    thumbnailUrl: [''],
    level: ['INTERMEDIATE', [Validators.required]],
    orderIndex: [1, [Validators.min(1)]],
    isPublished: [true],
  });

  // Filtered courses based on search
  readonly filteredCourses = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.courses();
    if (!query) return list;
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query),
    );
  });

  // Stats computed
  readonly publishedCount = computed(() => {
    return this.courses().filter((c) => c.isPublished).length;
  });

  readonly totalLessonsCount = computed(() => {
    return this.courses().reduce((sum, c) => sum + (c.totalLessons || 0), 0);
  });

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.adminService.getCourses().subscribe({
      next: (data: AdminCourse[]) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Không thể tải danh sách khóa học. Vui lòng thử lại!');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.editingCourseId.set(null);
    this.courseForm.reset({
      title: '',
      slug: '',
      description: '',
      thumbnailUrl: '',
      level: 'INTERMEDIATE',
      orderIndex: this.courses().length + 1,
      isPublished: true,
    });
    this.isModalOpen.set(true);
  }

  openEditModal(course: AdminCourse): void {
    this.editingCourseId.set(course.id);
    this.courseForm.patchValue({
      title: course.title,
      slug: course.slug,
      description: course.description || '',
      thumbnailUrl: course.thumbnailUrl || '',
      level: course.level,
      orderIndex: course.orderIndex,
      isPublished: course.isPublished,
    });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingCourseId.set(null);
  }

  onTitleChange(): void {
    // Only auto-generate slug for new course if user hasn't explicitly customized it
    if (!this.editingCourseId()) {
      const title = this.courseForm.get('title')?.value || '';
      const autoSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      this.courseForm.patchValue({ slug: autoSlug }, { emitEvent: false });
    }
  }

  togglePublish(course: AdminCourse, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newStatus = input.checked;

    this.adminService.toggleCoursePublish(course.id, newStatus).subscribe({
      next: (updated: AdminCourse) => {
        this.courses.update((list: AdminCourse[]) =>
          list.map((c: AdminCourse) => (c.id === course.id ? { ...c, isPublished: updated.isPublished } : c)),
        );
      },
      error: () => {
        // Revert toggle state on error
        input.checked = !newStatus;
        alert('Lỗi: Không thể cập nhật trạng thái xuất bản.');
      },
    });
  }

  confirmDelete(course: AdminCourse): void {
    const confirmed = confirm(
      `CẢNH BÁO: Bạn có chắc chắn muốn xóa khóa học "${course.title}"?\nToàn bộ bài học, từ vựng và audio liên quan sẽ bị xóa!`,
    );
    if (!confirmed) return;

    this.adminService.deleteCourse(course.id).subscribe({
      next: () => {
        this.courses.update((list: AdminCourse[]) => list.filter((c: AdminCourse) => c.id !== course.id));
      },
      error: () => {
        alert('Không thể xóa khóa học. Vui lòng kiểm tra lại quyền truy cập!');
      },
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    this.isSaving.set(true);
    const formVal = this.courseForm.value;
    const courseId = this.editingCourseId();

    if (courseId) {
      // Update
      this.adminService.updateCourse(courseId, formVal).subscribe({
        next: (updated: AdminCourse) => {
          this.courses.update((list: AdminCourse[]) =>
            list.map((c: AdminCourse) => (c.id === courseId ? { ...c, ...updated } : c)),
          );
          this.isSaving.set(false);
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          alert('Lỗi khi cập nhật khóa học: ' + (err.error?.message || err.message));
        },
      });
    } else {
      // Create
      this.adminService.createCourse(formVal).subscribe({
        next: (created: AdminCourse) => {
          this.courses.update((list: AdminCourse[]) => [...list, { ...created, totalLessons: 0 }]);
          this.isSaving.set(false);
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          alert('Lỗi khi tạo mới khóa học: ' + (err.error?.message || err.message));
        },
      });
    }
  }
}
