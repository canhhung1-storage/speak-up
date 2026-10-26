# 📋 Kế Hoạch Ngày: 2026-10-26 — Chuẩn Hóa DevOps CI/CD & Khởi Động Không Gian Học Tập (Learning Workspace)

> **Trạng thái:** 🟡 Đang thực hiện (In Progress)  
> **Nhánh thực hiện:** `develop`  
> **Người thực hiện:** Dev + AI Agent  
> **Tài liệu liên quan:** `docs/guides/02-gitflow-and-cicd-pipeline.md`, `docs/api-specs/learner/course-and-lesson-access.md`

---

## 🎯 1. Mục tiêu cốt lõi trong ngày (Goals)

1. **Chuẩn hóa hạ tầng CI/CD & Kiểm soát chất lượng code (ĐÃ HOÀN THÀNH 100%):**
   - Hoàn tất pipeline GitHub Actions tự động kiểm thử song song Backend và Frontend.
   - Tích hợp `@angular-eslint` vào Frontend Angular 18, đưa toàn bộ mã nguồn về trạng thái sạch 100% (**0 errors, 0 warnings**).
   - Thiết lập quy chuẩn phân nhánh GitFlow (`master`, `develop`, `feature/*`) và tài liệu hướng dẫn vận hành.
   - Đẩy nhánh `develop` lên GitHub, kiểm thử CI đạt tích xanh và hoàn tất Merge Pull Request #1 vào `master`.
2. **Khởi động phân hệ Không gian Học tập cho Học viên (Learner Core Experience - TRỌNG TÂM TIẾP THEO):**
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
- [x] **Task 1.7:** Khởi tạo nhánh `develop` và commit toàn bộ thay đổi (`commit: 831aa5d`, `commit: 2fd3487`, `commit: ff687ea`).
- [x] **Task 1.8:** Đẩy nhánh `develop` lên GitHub remote (`git push -u origin develop`).
- [x] **Task 1.9:** Kiểm thử xác thực tự động trên GitHub Actions: Cả 2 job `backend-ci` (19s) và `frontend-ci` (36s) đều đạt tích xanh (Passed 100%).
- [x] **Task 1.10:** Tạo Pull Request #1 (`develop ➔ master`) trên GitHub, xác nhận CI pass và hoàn tất Merge vào nhánh `master` an toàn (`merge commit: 4eec793`).

---

### ⏳ Nhóm 2: Công việc tồn đọng cần làm tiếp hôm nay (PENDING / IN PROGRESS)

#### 🔹 Pha 1: Cổng Khóa Học Học Viên (Learner Course Dashboard - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 2.1:** Tạo `LearnerService` tại `apps/web/src/app/core/services/learner.service.ts`:
  - `getCourses()` ➔ `GET /api/courses` (Danh sách khóa học đã xuất bản).
  - `getCourseBySlug(slug)` ➔ `GET /api/courses/:slug` (Chi tiết khóa học & danh sách bài học).
  - `getLessonDetail(courseSlug, lessonSlug)` ➔ `GET /api/courses/:courseSlug/lessons/:lessonSlug` (Đầy đủ article, vocabularies, audios).
- [x] **Task 2.2:** Nâng cấp [course-dashboard.component.ts](file:///d:/MY_PROJECT/speak-up/apps/web/src/app/features/learning/course-dashboard.component.ts) (`/courses`):
  - Grid danh sách khóa học thực tế: Thumbnail, Tiêu đề, Cấp độ, Số bài học, Nút "Xem bài học".
  - Drawer/Modal xem lộ trình các bài học của từng khóa học và nút "Học ngay".
  - Bộ lọc khóa học theo cấp độ (Tất cả, Cơ bản, Trung cấp, Nâng cao).
  - Xử lý đủ 3 trạng thái: Skeleton loading, Error state (Retry button), Empty state.

#### 🔹 Pha 2: Không Gian Học Tập Tương Tác Cốt Lõi (Learning Workspace Player - ĐANG THỰC HIỆN 🟡)
- [ ] **Task 2.3:** Khai báo route `/courses/:courseSlug/lessons/:lessonSlug` trong `apps/web/src/app/app.routes.ts` (gắn `authGuard`).
- [ ] **Task 2.4:** Xây dựng `LessonWorkspaceComponent` với layout 2 cột:
  - Sidebar danh sách bài học trong khóa học để chuyển bài nhanh.
  - Khung học tập chính 3 tab:
    - 📖 **Tab 1: Bài đọc (Story Viewer):** Typography cao cấp, tra cứu từ vựng nhanh dạng popup khi click từ nổi bật.
    - 💡 **Tab 2: Từ vựng & Flashcard 3D:** Danh sách từ vựng kèm phát âm âm thanh độc lập, chế độ Flashcard lật mặt trước/sau 3D.
    - 🎧 **Tab 3: Trình phát Audio Phản Xạ (Audio Reflex Player):** Đổi track Main Story/Mini-Story/POV, chỉnh tốc độ phát (`0.75x`, `1.0x`, `1.25x`), tua lại 5s.

#### 🔹 Pha 3: Nâng Cấp Admin CMS — Kéo Thả Sắp Xếp Thứ Tự Bài Học (Drag & Drop Reordering - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 2.5 (Backend):** Thêm endpoint `PATCH /api/admin/courses/:courseId/lessons/reorder` trong `AdminLessonsController` và `AdminLessonsService`:
  - Nhận mảng các bài học kèm thứ tự mới: `[lessonId1, lessonId2, ...]`.
  - Thực thi cập nhật hàng loạt trong một Database Transaction (ACID) an toàn, trả về danh sách bài học sắp xếp mới.
- [x] **Task 2.6 (Frontend Admin):** Tích hợp tính năng kéo thả vào [lesson-list.component.ts](file:///d:/MY_PROJECT/speak-up/apps/web/src/app/features/admin/lessons/lesson-list.component.ts):
  - Cài đặt `@angular/cdk@18` và import `DragDropModule`, `CdkDragDrop`, `moveItemInArray`.
  - Bổ sung cột tay cầm kéo thả (Drag Handle `⋮⋮`) ở đầu mỗi hàng bài học.
  - Hiệu ứng kéo thả mượt mà (smooth reorder animation, preview hàng khi di chuột).
  - Tự động đánh lại số thứ tự hiển thị `#1`, `#2`, `#3` trực quan ngay khi thả chuột (Optimistic UI) và gửi API lưu DB kèm thông báo trạng thái `Đang lưu...` / `✓ Đã lưu thứ tự`.

#### 🔹 Pha 4: Chuẩn Hóa Đường Dẫn SEO Thân Thiện Bằng Slug (Slug-Based Routing - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 2.7 (Backend Hybrid Lookup):** Nâng cấp `AdminCoursesService`, `AdminLessonsService`, `CoursesService`, và `LessonsService` hỗ trợ tìm kiếm linh hoạt theo cả **Slug** (`flow-english`, `baseball-pig`) và **UUID** để không bao giờ bị gãy link cũ, xử lý triệt để khác biệt kiểu dữ liệu PostgreSQL (UUID vs VARCHAR).
- [x] **Task 2.8 (Frontend URL Refactoring):** Chuyển đổi toàn bộ route Admin và Learner sang dạng Slug thân thiện:
  - Danh sách bài học Admin: `/admin/courses/:courseSlug/lessons`
  - Tạo bài học mới: `/admin/courses/:courseSlug/lessons/create`
  - Chỉnh sửa bài học: `/admin/courses/:courseSlug/lessons/:lessonSlug/edit`
  - Phòng học Learner: `/courses/:courseSlug/lessons/:lessonSlug`
  - Đảm bảo 0 lint errors, 0 lint warnings và 0 build warnings.

#### 🔹 Pha 5: Theo Dõi & Đồng Bộ Tiến Độ (Progress Tracking)
- [ ] **Task 2.9:** Kết nối API ghi nhận tiến độ khi học viên hoàn thành bài học và hiển thị % hoàn thành trên Dashboard.

---

## 📝 3. Quyết định kỹ thuật & Ghi chú (Notes & Decisions)

1. **ESLint Flat Config v9:** Angular 18 và `@angular-eslint` v18 hỗ trợ cấu hình hiện đại `eslint.config.js`. Dự án đã áp dụng thành công kiến trúc Flat Config giúp giảm bớt các file cấu hình cồng kềnh cũ (`.eslintrc.json`).
2. **Template Accessibility (A11y):** Cấu hình linh hoạt các quy tắc A11y cho Reactive Forms giúp nhà phát triển dễ dàng quan sát gợi ý mà không làm gãy build pipeline một cách phi lý.
3. **Mô hình Monorepo CI:** Sử dụng bộ lọc `path` trong GitHub Actions đảm bảo không tốn phút chạy CI khi các commit chỉ sửa tài liệu (`docs/**`).
4. **Đồng bộ hóa GitFlow:** Sau khi hoàn thành merge PR #1 trên GitHub, nhánh `master` và `develop` đã được chốt và đồng bộ phiên bản ổn định nhất.
