# 📋 Kế Hoạch Ngày: 2026-11-20 — Bảng Thống Kê Thời Gian Học Tập Theo Từng Bài & Phân Tích Hoạt Động (Learner Study Time Dashboard & Analytics)

> **Trạng thái:** 🟢 Đã hoàn thành (Completed)  
> **Nhánh thực hiện:** `develop` ➔ Tạo nhánh `feature/learner-study-time-dashboard`  
> **Người thực hiện:** Dev + AI Agent  
> **Tài liệu liên quan:** `docs/architecture/03-database-erd.md`, `docs/api-specs/learner/course-and-lesson-access.md`, `docs/api-specs/learner/study-time-and-analytics-dashboard.md`

---

## 🎯 1. Mục tiêu cốt lõi trong ngày (Goals)

1. **Theo dõi Thời gian Học thực tế (Active Study Time Tracking):**
   - Đo lường và tích lũy số phút/giờ học thực tế của học viên trên từng bài học (`totalTimeSpentSeconds`), không chỉ dừng lại ở vị trí thanh phát audio.
   - Ghi nhận nhật ký học tập theo ngày (`user_daily_study_logs`) để thống kê xu hướng học tập trong tuần và tính toán chuỗi ngày học liên tục (**Daily Streak 🔥**).
2. **Xây dựng Backend Analytics & Tracking APIs (NestJS):**
   - `GET /api/analytics/dashboard`: Trả về dữ liệu bảng điều khiển tổng quan (Tổng thời gian học, Streak ngày, Phút học hôm nay so với Mục tiêu ngày, Biểu đồ hoạt động 7 ngày gần nhất).
   - `GET /api/analytics/lessons`: Trả về danh sách chi tiết thời gian đã học trên từng bài học, sắp xếp theo bài học gần nhất hoặc bài học nhiều thời gian nhất.
   - Cập nhật cơ chế tích lũy thời gian học khi học viên đang tương tác trong Không gian học tập (`LessonWorkspace`).
3. **Thiết kế Giao diện Dashboard Học Tập Cao Cấp (Angular 18):**
   - Tạo trang `/dashboard` trực quan, hiện đại, sống động, hỗ trợ hoàn hảo cả Light & Dark mode.
   - **Thẻ chỉ số tổng quan (Stat Cards):** ⏱️ Tổng thời gian học, 🔥 Chuỗi học liên tục (Streak), 📚 Số bài hoàn thành, 🎯 Mục tiêu trong ngày (% đạt được).
   - **Biểu đồ Cột Hoạt Động Tuần (Weekly Activity Chart):** Thể hiện số phút học từ Thứ 2 đến Chủ nhật dạng cột tương tác trực quan.
   - **Bảng Thống Kê Chi Tiết Từng Bài Học (Lesson Time Breakdown Table):** Tên bài, Khóa học, Thời lượng đã học (vd: *42 phút*), Tiến độ %, Lần học cuối và nút "Học tiếp".

---

## 🛠️ 2. Checklist chi tiết (Tasks)

### 🌿 Nhóm 1: Thiết Kế Database & Model Dữ Liệu (Backend Database - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 1.1:** Khởi tạo nhánh làm việc mới: `git checkout -b feature/learner-study-time-dashboard`.
- [x] **Task 1.2:** Cập nhật Entity `UserLessonProgress` trong `apps/api/src/database/entities/user-lesson-progress.entity.ts`:
  - Thêm trường `total_time_spent_seconds` (type `integer`, default `0`): Tổng số giây học viên đã học bài này.
- [x] **Task 1.3:** Tạo Entity `UserDailyStudyLog` trong `apps/api/src/database/entities/user-daily-study-log.entity.ts`:
  - `id`: UUID.
  - `userId`: UUID (FK `users`, Indexed).
  - `studyDate`: Date (`YYYY-MM-DD`, Indexed).
  - `totalSeconds`: Integer (Tổng số giây học trong ngày).
  - `lessonsCount`: Integer (Số bài học tương tác trong ngày).
  - `Unique constraint`: `uq_user_study_date` (`user_id` + `study_date`).
- [x] **Task 1.4:** Đăng ký Entity mới vào `apps/api/src/database/entities/index.ts` và `app.module.ts`.

---

### 🚀 Nhóm 2: Backend Analytics Module & APIs (NestJS - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 2.1:** Khởi tạo `AnalyticsModule`, `AnalyticsController`, `AnalyticsService` trong `apps/api/src/modules/analytics/`.
- [x] **Task 2.2:** Xây dựng các DTOs chuẩn mực:
  - `DashboardSummaryDto`: Tổng thời gian (phút), Streak hiện tại (ngày), Thời gian học hôm nay, Mục tiêu ngày (mặc định 30 phút), Số bài hoàn thành.
  - `DailyActivityItemDto`: Ngày trong tuần (Mon, Tue,...), Ngày (`YYYY-MM-DD`), Số phút học.
  - `LessonStudyTimeItemDto`: `lessonId`, `lessonTitle`, `lessonSlug`, `courseTitle`, `courseSlug`, `totalMinutesSpent`, `status`, `progressPercent`, `lastListenedAt`.
- [x] **Task 2.3:** Triển khai các Endpoints:
  - `GET /api/analytics/dashboard` (Authenticated Learner).
  - `GET /api/analytics/lessons` (Authenticated Learner).
  - Nâng cấp `PUT /api/progress/lessons/:lessonSlugOrId`: Cho phép nhận thêm `timeSpentDeltaSeconds` để tự động cộng dồn vào `total_time_spent_seconds` và cập nhật `UserDailyStudyLog` của ngày hiện tại.

---

### 🅰️ Nhóm 3: Frontend Dashboard & Giao Diện Thống Kê (Angular 18 - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 3.1:** Thêm methods vào `LearnerService` (`apps/web/src/app/core/services/learner.service.ts`):
  - `getDashboardAnalytics(): Observable<DashboardSummaryResponse>`
  - `getLessonStudyTimes(): Observable<LessonStudyTimeItem[]>`
- [x] **Task 3.2:** Khởi tạo Component `LearnerDashboardComponent` tại `apps/web/src/app/features/learning/learner-dashboard/`:
  - Khai báo route `/dashboard` trong `app.routes.ts` (gắn `authGuard`).
  - Cập nhật thanh Navigation trên Header của app (Home / Dashboard / Courses / Admin).
- [x] **Task 3.3:** Xây dựng giao diện Dashboard với các thành phần:
  - **Banner Chào mừng & Daily Streak:** Lời chào, câu châm ngôn học tiếng Anh tạo động lực, huy hiệu Streak rực rỡ (`🔥 3 Days Streak`).
  - **4 Stat Cards:**
    - ⏱️ **Total Time:** Tổng thời gian đã học (đổi sang giờ & phút dễ hiểu).
    - 🎯 **Today's Goal:** Thanh đo % hoàn thành mục tiêu 30 phút hôm nay.
    - 📚 **Completed Lessons:** Tỷ lệ bài đã hoàn thành.
    - ⚡ **Study Habit:** Đánh giá mức độ chuyên cần.
  - **Biểu đồ Cột Hoạt Động 7 Ngày (Weekly Activity Chart):** Cột biểu diễn số phút từng ngày, hover hiển thị tooltip chi tiết, highlight ngày hôm nay.
  - **Bảng Thống Kê Thời Gian Theo Từng Bài Học (Lesson Time Breakdown):**
    - Tìm kiếm / lọc bài học.
    - Cột: Tên bài học, Khóa học, Thời gian đã học, Trạng thái, Lần học cuối.
    - Nút CTA **"Học tiếp"** chuyển ngay vào `LessonWorkspace`.
  - Đảm bảo xử lý đủ **3 trạng thái UI** (Skeleton Loading, Error State with Retry, Empty State).

---

### ⏱️ Nhóm 4: Tự Động Tích Lũy Thời Gian Từ Phòng Học (`LessonWorkspace` - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 4.1:** Cập nhật `LessonWorkspaceComponent`:
  - Khi học viên nghe audio hoặc đọc bài, đếm số giây học thực tế qua `activeStudySecondsDelta` và `studyTimer`.
  - Cứ mỗi 5 giây, khi pause, đổi track hoặc khi rời phòng (`ngOnDestroy`), gửi `timeSpentDeltaSeconds` về server để ghi nhận thời gian học thực tế vào bảng thống kê.
- [x] **Task 4.2:** Kiểm tra đồng bộ số liệu: Vừa nghe xong bài ➔ Mở `/dashboard` kiểm tra số phút học và biểu đồ lập tức cập nhật chính xác.

---

### 🧪 Nhóm 5: Kiểm Thử & Kiểm Soát Chất Lượng (Quality Gate - ĐÃ HOÀN THÀNH ✅)
- [x] **Task 5.1:** Kiểm tra Linting Frontend & Backend (0 errors, 0 warnings, tuân thủ Clean Architecture & 3-Tier Layering).
- [x] **Task 5.2:** Kiểm tra UI/UX tuân thủ Web Design Backbone (Google Fonts, Spacing 4px/8px, WCAG AA, Light & Dark Theme, Responsive Mobile/Desktop).
- [x] **Task 5.3:** Chuẩn bị commit code theo chuẩn Conventional Commits trên nhánh `feature/learner-study-time-dashboard`.

---

## 📝 3. Quyết định kỹ thuật & Ghi chú (Notes & Decisions)

1. **Cách tính Daily Streak 🔥 chuẩn xác:**
   - Một ngày được tính vào streak nếu học viên có ít nhất **1 phút** học thực tế (`totalSeconds >= 60`).
   - Streak được tính bằng cách đếm lùi các ngày liên tiếp có bản ghi trong `user_daily_study_logs`. Nếu hôm nay chưa học nhưng hôm qua có học, streak vẫn được giữ để học viên có cơ hội học trong ngày hôm nay mà không bị reset về 0.
2. **Tối ưu hóa UI Chart:**
   - Sử dụng CSS Flexbox & CSS Custom Properties thuần kết hợp SVG, không cần cài đặt thêm thư viện chart nặng nề (như Chart.js hay D3.js) để giữ cho bundle frontend luôn siêu nhẹ (< 15KB).
3. **Tránh gian lận thời gian (Anti-idle Tracking):**
   - Chỉ tích lũy thời gian khi audio đang phát hoặc khi học viên có tương tác với bài học (cuộn trang, lật flashcard), tối đa 30 giây mỗi block gửi lên server.

---

## ⏭️ 4. Tồn đọng cho các buổi tiếp theo (Backlog)
- [ ] Cho phép học viên tùy chỉnh mục tiêu học hàng ngày (15 phút, 30 phút, 45 phút, 60 phút).
- [ ] Thêm huy hiệu thành tích (Badges / Achievements: *Cú đêm chăm chỉ*, *Nghe 5 giờ đầu tiên*, *Bậc thầy Flashcard*).
