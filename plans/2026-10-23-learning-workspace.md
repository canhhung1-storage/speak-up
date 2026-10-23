# 📋 Kế Hoạch Triển Khai: Không Gian Học Tập Effortless English (Learning Workspace)

> **Mã tính năng:** `EFFORTLESS-WORKSPACE`  
> **Nhánh thực hiện:** `feature/effortless-learning-workspace`  
> **Kiến trúc:** Clean 3-Tier (NestJS) + Component Architecture (Angular Standalone, Signals, SCSS thuần)  
> **Tài liệu tham chiếu:** `docs/architecture/01-system-overview.md`, `docs/database/01-erd-database-design.md`  

---

## 🎯 1. Mục tiêu cốt lõi (Core Objectives)

Biến nền tảng SpeakUp thành **trung tâm rèn luyện phản xạ tiếng Anh tự nhiên** theo đúng triết lý của Effortless English (thầy AJ Hoge):
1. **Học qua nghe sâu (Deep Listening):** Audio Player chuyên dụng với tính năng tua nhanh/chậm (-5s/+5s), đổi tốc độ (0.75x - 1.5x), hỗ trợ chuyển đổi mượt mà giữa các track âm thanh:
   - **Main Article Audio:** Bài đọc câu chuyện gốc.
   - **Mini-Story Audio:** Phần hỏi - đáp kích hoạt phản xạ vô thức.
   - **Point of View (POV) Audio:** Luyện ngữ pháp trực quan qua thay đổi thì mà không cần học công thức.
   - **Commentary Audio:** Bài chia sẻ tạo động lực và tư duy.
2. **Interactive Vocabulary Reader:** Bài đọc bài học chứa các thẻ `<mark>word</mark>`. Khi người dùng click hoặc rê chuột vào, hiển thị popup từ vựng trực quan (Phiên âm IPA, Nghĩa tiếng Việt, Định nghĩa tiếng Anh, Nút nghe phát âm chuẩn).
3. **Luồng điều hướng liền mạch (Navigation Flow):**
   - `/courses`: Dashboard danh sách các khóa học (kết nối API thực).
   - `/courses/:courseSlug`: Trang chi tiết khóa học và danh sách bài học.
   - `/courses/:courseSlug/lessons/:lessonSlug`: Không gian học tập tương tác toàn màn hình (Learning Workspace).

---

## 🛠️ 2. Danh sách công việc chi tiết (Detailed Tasks)

### 🔹 Giai đoạn 1: Course Dashboard & Chi tiết khóa học (`apps/web`)
- [ ] **Task 1.1:** Tạo `CoursesService` trên Angular (`apps/web/src/app/core/services/courses.service.ts`):
  - `getCourses()`: Gọi `GET /api/courses`
  - `getCourseBySlug(slug)`: Gọi `GET /api/courses/:slug`
  - `getLessonDetail(courseSlug, lessonSlug)`: Gọi `GET /api/courses/:courseSlug/lessons/:lessonSlug`
- [ ] **Task 1.2:** Cập nhật `CourseDashboardComponent`:
  - Hiển thị danh sách khóa học thực tế từ API (thay thế giao diện chào mừng tạm thời).
  - Thẻ khóa học chuẩn UI cao cấp: Thumbnail, Badge cấp độ (Intermediate/Beginner), số bài học, thanh tiến độ.
- [ ] **Task 1.3:** Tạo `CourseDetailComponent` (`/courses/:courseSlug`):
  - Hiển thị banner khóa học, mô tả phương pháp học sâu.
  - Danh sách bài học (Lessons) có thứ tự, icon trạng thái, nút "Bắt đầu học" dẫn vào bài học đầu tiên.

### 🔹 Giai đoạn 2: Không Gian Học Tập Tương Tác (`LearningWorkspaceComponent`)
- [ ] **Task 2.1:** Tạo route `/courses/:courseSlug/lessons/:lessonSlug`.
- [ ] **Task 2.2:** Xây dựng Sidebar điều hướng bài học (Collapsible):
  - Danh sách bài học trong khóa để chuyển bài nhanh.
  - Đánh dấu bài học đang học hiện tại.
- [ ] **Task 2.3:** Xây dựng Interactive Article Reader:
  - Hiển thị bài đọc `article.content`.
  - Bắt sự kiện click vào các thẻ `<mark>` từ vựng.
  - Modal/Tooltip từ vựng: Hiển thị từ, IPA, nghĩa tiếng Việt, câu ví dụ và audio phát âm.
- [ ] **Task 2.4:** Xây dựng Audio Player Studio (Effortless Multi-track Player):
  - Thanh chọn Audio Track: `Main Story` | `Mini-Story` | `Point of View` | `Commentary`.
  - Nút Play/Pause, Thanh tiến trình (Seek bar), Thời gian hiện tại / Tổng thời lượng.
  - Phím tắt hoặc nút bấm tua lại **-5 giây** (để nghe lại câu hỏi), tua tới **+5 giây**.
  - Bộ điều chỉnh tốc độ đọc: `0.75x`, `1.0x`, `1.25x`, `1.5x`.
  - Hiển thị Transcript đồng bộ bên dưới trình phát audio.

### 🔹 Giai đoạn 3: Kiểm thử, Thẩm mỹ UI & Hoàn thiện
- [ ] **Task 3.1:** Kiểm tra Responsive trên Mobile và Desktop (tuân thủ Mobile App & Web Design Backbone Rules).
- [ ] **Task 3.2:** Build kiểm tra TypeScript và Angular production bundle.
- [ ] **Task 3.3:** Nghiệm thu trực quan qua Nginx Gateway `http://localhost:8080`.
