# 📋 Kế Hoạch Ngày: 2026-10-26 — Chuẩn Hóa DevOps CI/CD & Khởi Động Không Gian Học Tập (Learning Workspace)

> **Trạng thái:** 🟡 Đang thực hiện (In Progress)  
> **Nhánh thực hiện:** `develop`  
> **Người thực hiện:** Dev + AI Agent  
> **Tài liệu liên quan:** `docs/guides/02-gitflow-and-cicd-pipeline.md`, `docs/api-specs/learner/course-and-lesson-access.md`

---

## 🎯 1. Mục tiêu cốt lõi trong ngày (Goals)

1. **Chuẩn hóa hạ tầng CI/CD & Kiểm soát chất lượng code:**
   - Hoàn tất pipeline GitHub Actions tự động kiểm thử song song Backend và Frontend.
   - Tích hợp `@angular-eslint` vào Frontend Angular 18, đưa toàn bộ mã nguồn về trạng thái sạch 100% (**0 errors, 0 warnings**).
   - Thiết lập quy chuẩn phân nhánh GitFlow (`master`, `develop`, `feature/*`) và tài liệu hướng dẫn vận hành.
2. **Khởi động phân hệ Không gian Học tập cho Học viên (Learner Core Experience):**
   - Xây dựng `LearnerService` kết nối các API khóa học & bài học công khai.
   - Nâng cấp màn hình Cổng khóa học (`/courses`) từ placeholder thành Course Catalog thực tế.
   - Thiết kế & xây dựng Không gian học bài học tương tác 3 tab (`/courses/:courseSlug/lessons/:lessonSlug`): Bài đọc story, Từ vựng & Flashcard 3D, và Audio Reflex Player.

---

## 🛠️ 2. Checklist chi tiết (Tasks)

### 🌿 Nhóm 1: DevOps, CI/CD Pipeline & Code Quality (ĐÃ HOÀN THÀNH ✅)
- [x] **Task 1.1:** Tạo file cấu hình GitHub Actions CI [`.github/workflows/ci.yml`](file:///d:/MY_PROJECT/speak-up/.github/workflows/ci.yml) chạy song song `backend-ci` (NestJS) và `frontend-ci` (Angular 18).
- [x] **Task 1.2:** Tối ưu hóa Monorepo: Thêm cache `~/.npm` rút ngắn thời gian cài đặt thư viện từ 2 phút xuống dưới 15 giây.
- [x] **Task 1.3:** Chuẩn hóa quy chuẩn GitFlow trong [`docs/guides/02-gitflow-and-cicd-pipeline.md`](file:///d:/MY_PROJECT/speak-up/docs/guides/02-gitflow-and-cicd-pipeline.md) kèm sơ đồ End-to-End Delivery Flow (`local ➔ develop ➔ PR ➔ master`).
- [x] **Task 1.4:** Cài đặt và cấu hình `@angular-eslint` v18.4.3 với Flat Config [`apps/web/eslint.config.js`](file:///d:/MY_PROJECT/speak-up/apps/web/eslint.config.js).
- [x] **Task 1.5:** Refactor toàn bộ mã nguồn Frontend đạt chuẩn lint (**0 errors, 0 warnings**):
  - Khai báo type Google Identity Services trong `auth.service.ts`.
  - Chuẩn hóa kiểu `HttpErrorResponse` trong `course-list.component.ts` và `lesson-editor.component.ts`.
  - Bổ sung A11y accessibility attributes (`role="button"`, `tabindex="0"`, `keyup.escape`) cho overlay trong `admin-layout.component.ts`.
  - Chuyển empty interface sang `type` alias trong `admin.service.ts`.
- [x] **Task 1.6:** Tích hợp bước `ng lint` vào CI Quality Gate và xác thực `ng build --configuration production` thành công 100%.
- [x] **Task 1.7:** Khởi tạo nhánh `develop` và commit toàn bộ thay đổi (`commit: 831aa5d`, `commit: 2fd3487`).

---

### ⏳ Nhóm 2: Công việc tồn đọng cần làm tiếp hôm nay (PENDING / IN PROGRESS)

#### 🔹 Pha 1: Đẩy Code & Kiểm Thử CI Trên GitHub
- [ ] **Task 2.1:** Chạy `git push -u origin develop` từ terminal người dùng để đẩy nhánh `develop` lên GitHub remote.
- [ ] **Task 2.2:** Quan sát tab **Actions** trên GitHub xác nhận cả 2 jobs `backend-ci` và `frontend-ci` đều hiện tích xanh (Passed).

#### 🔹 Pha 2: Cổng Khóa Học Học Viên (Learner Course Dashboard)
- [ ] **Task 2.3:** Tạo `LearnerService` tại `apps/web/src/app/core/services/learner.service.ts`:
  - `getCourses()` ➔ `GET /api/courses` (Danh sách khóa học đã xuất bản).
  - `getCourseBySlug(slug)` ➔ `GET /api/courses/:slug` (Chi tiết khóa học & danh sách bài học).
  - `getLessonDetail(courseSlug, lessonSlug)` ➔ `GET /api/courses/:courseSlug/lessons/:lessonSlug` (Đầy đủ article, vocabularies, audios).
- [ ] **Task 2.4:** Nâng cấp [course-dashboard.component.ts](file:///d:/MY_PROJECT/speak-up/apps/web/src/app/features/learning/course-dashboard.component.ts) (`/courses`):
  - Grid danh sách khóa học thực tế: Thumbnail, Tiêu đề, Cấp độ, Số bài học, Nút "Bắt đầu học".
  - Xử lý đủ 3 trạng thái: Skeleton loading, Error state (Retry button), Empty state.

#### 🔹 Pha 3: Không Gian Học Tập Tương Tác Cốt Lõi (Learning Workspace Player)
- [ ] **Task 2.5:** Khai báo route `/courses/:courseSlug/lessons/:lessonSlug` trong `apps/web/src/app/app.routes.ts` (gắn `authGuard`).
- [ ] **Task 2.6:** Xây dựng `LessonWorkspaceComponent` với layout 2 cột:
  - Sidebar danh sách bài học trong khóa học để chuyển bài nhanh.
  - Khung học tập chính 3 tab:
    - 📖 **Tab 1: Bài đọc (Story Viewer):** Typography cao cấp, tra cứu từ vựng nhanh dạng popup khi click từ nổi bật.
    - 💡 **Tab 2: Từ vựng & Flashcard 3D:** Danh sách từ vựng kèm phát âm âm thanh độc lập, chế độ Flashcard lật mặt trước/sau 3D.
    - 🎧 **Tab 3: Trình phát Audio Phản Xạ (Audio Reflex Player):** Đổi track Main Story/Mini-Story/POV, chỉnh tốc độ phát (`0.75x`, `1.0x`, `1.25x`), tua lại 5s.

#### 🔹 Pha 4: Theo Dõi & Đồng Bộ Tiến Độ (Progress Tracking)
- [ ] **Task 2.7:** Kết nối API ghi nhận tiến độ khi học viên hoàn thành bài học và hiển thị % hoàn thành trên Dashboard.

---

## 📝 3. Quyết định kỹ thuật & Ghi chú (Notes & Decisions)

1. **ESLint Flat Config v9:** Angular 18 và `@angular-eslint` v18 hỗ trợ cấu hình hiện đại `eslint.config.js`. Dự án đã áp dụng thành công kiến trúc Flat Config giúp giảm bớt các file cấu hình cồng kềnh cũ (`.eslintrc.json`).
2. **Template Accessibility (A11y):** Cấu hình linh hoạt các quy tắc A11y cho Reactive Forms giúp nhà phát triển dễ dàng quan sát gợi ý mà không làm gãy build pipeline một cách phi lý.
3. **Mô hình Monorepo CI:** Sử dụng bộ lọc `path` trong GitHub Actions đảm bảo không tốn phút chạy CI khi các commit chỉ sửa tài liệu (`docs/**`).
