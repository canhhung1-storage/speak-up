# 📋 Kế Hoạch Ngày: 2026-10-22 - Khởi Tạo & Thiết Lập Môi Trường Docker Cho SpeakUp

> **Trạng thái:** 🟢 Hoàn thành (Done)  
> **Người thực hiện:** Dev + AI Agent  
> **Workflow áp dụng:** `.agent/workflows/plan.md` (Đã hoàn thành đủ 3 Pha: Brainstorm ➔ Execute ➔ Save Learnings)

---

## 🎯 1. Mục tiêu trong ngày (Goals)
- [x] Khởi tạo thư mục quản lý công việc `plans/` kèm hướng dẫn và template.
- [x] **Pha 1: Brainstorming** — Hoàn thành thống nhất kiến trúc, sơ đồ hạ tầng, vai trò công nghệ và chốt thiết kế (Gate 1 Passed).
- [x] **Pha 2: Execute** — Triển khai cấu hình Docker Compose, Nginx, Database init, biến môi trường và cấu trúc thư mục Monorepo cho SpeakUp.
- [x] **Pha 3: Save Learnings** — Ghi nhận các bài học và quyết định kiến trúc vào `.agent/learnings/` (Đã lưu vào `architecture.md` và `patterns.md`).
- [x] **Thiết kế Database Schema & ERD** — Bóc tách 7 bảng thực thể chuẩn hóa cho phương pháp học tiếng Anh Effortless English (Main Article, Vocabulary, Mini Story, Commentary, POV).

---

## 🛠️ 2. Checklist chi tiết (Tasks)

### Nhóm 1: Khởi tạo quy chuẩn quản lý & Tài liệu
- [x] Tạo `plans/README.md`
- [x] Tạo `plans/template.md`
- [x] Tạo file kế hoạch ngày đầu tiên `plans/2026-10-22-init-project.md`
- [x] Tạo `.gitignore` chuẩn Enterprise đa nền tảng
- [x] Tạo sơ đồ kiến trúc hạ tầng `docs/architecture/01-docker-infrastructure.md`
- [x] Tạo cẩm nang vai trò công nghệ `docs/architecture/02-tech-stack-roles.md`
- [x] Tạo tài liệu tổng quan dự án `README.md` ở thư mục gốc
- [x] Tạo cẩm nang khởi động và vận hành từ A-Z `docs/GETTING_STARTED.md`
- [x] Thực hiện commit đầu tiên (Initial commit: `e069903`)

### Nhóm 2: Pha 2 - Thực thi xây dựng Môi trường Docker (Execute)
- [x] **Task 2.1:** Tạo `.env.example` và `.env` chuẩn hóa toàn bộ tham số môi trường
- [x] **Task 2.2:** Tạo cấu hình Nginx Reverse Proxy (`docker/nginx/Dockerfile`, `docker/nginx/default.conf`)
- [x] **Task 2.3:** Tạo script khởi tạo Database PostgreSQL (`docker/postgres/init.sql`)
- [x] **Task 2.4:** Tạo khung khởi đầu và Dockerfile cho `apps/api` (NestJS) và `apps/web` (Angular)
- [x] **Task 2.5:** Viết file `docker-compose.yml` hoàn chỉnh (6 services, healthchecks, volumes, network)
- [x] **Task 2.6:** Verify cú pháp và cấu hình bằng lệnh `docker compose config` (Clean 100%, 0 warning)

### Nhóm 3: Pha 3 - Lưu trữ tri thức (Save Learnings)
- [x] Trích xuất kiến thức kiến trúc 6 container & healthcheck vào `.agent/learnings/architecture.md`
- [x] Trích xuất quy chuẩn giao tiếp Service Name vào `.agent/learnings/patterns.md`

### Nhóm 4: Thiết kế Cơ sở dữ liệu (Database Schema & ERD)
- [x] **Task 4.1:** Bóc tách 7 thực thể cốt lõi: `users`, `courses`, `lessons`, `lesson_articles`, `lesson_vocabularies`, `lesson_audios`, `user_lesson_progress`.
- [x] **Task 4.2:** Bổ sung `slug` cho `lessons` với ràng buộc duy nhất trong khóa học `UNIQUE(course_id, slug)`.
- [x] **Task 4.3:** Thống nhất đổi tên bảng từ vựng thành `lesson_vocabularies` cho đồng bộ với `lesson_articles` và `lesson_audios`.
- [x] **Task 4.4:** Hoàn thiện sơ đồ Mermaid ERD và Từ điển Dữ liệu (Data Dictionary) chi tiết tại `docs/architecture/03-database-erd.md`.

### Nhóm 5: Khởi tạo Backend NestJS & TypeORM (apps/api)
- [x] **Task 5.1:** Thay thế Prisma ORM bằng TypeORM (`@nestjs/typeorm`, `typeorm`, `pg`) nhằm tối ưu cho môi trường mạng doanh nghiệp và tương thích sâu với NestJS.
- [x] **Task 5.2:** Xây dựng 7 Entities TypeORM (`User`, `Course`, `Lesson`, `LessonArticle`, `LessonVocabulary`, `LessonAudio`, `UserLessonProgress`) chuẩn hóa theo tài liệu ERD.
- [x] **Task 5.3:** Cấu hình `TypeOrmModule` trong `app.module.ts` kết nối PostgreSQL với cơ chế `synchronize: true` tự động tạo bảng.
- [x] **Task 5.4:** Khởi động NestJS container và kiểm tra các bảng được tự động tạo trong PostgreSQL.
- [x] **Task 5.5:** Viết kịch bản Seed Data mẫu (`apps/api/src/database/seeds/seed.ts`) tạo tài khoản Admin/Learner, khóa học *Power English*, bài học *A Kiss* (Article có `<mark>`, 5 từ vựng, 3 bài audio Mini Story / POV / Commentary).
- [x] **Task 5.6:** Xây dựng các REST API endpoints chuẩn hóa 3 lớp (3-Tier Architecture) kèm DTO:
  - `GET /api/courses`: Danh sách khóa học xuất bản.
  - `GET /api/courses/:slug`: Chi tiết khóa học kèm danh sách bài học.
  - `GET /api/courses/:courseSlug/lessons/:lessonSlug`: Toàn bộ nội dung bài học Effortless English.
- [x] **Task 5.7:** Thiết lập Global Exception Filter (`HttpExceptionFilter`) chuẩn hóa phản hồi lỗi JSON đồng nhất cho toàn hệ thống.

---

## 📝 3. Quyết định kỹ thuật & Ghi chú (Notes & Decisions)
- **Mục tiêu của dự án:** Dự án phục vụ mục tiêu kép (Dual-purpose):
  1. Giúp người dùng thực hành học tiếng Anh hàng ngày hiệu quả.
  2. Nền tảng thực chiến để học hỏi công nghệ mới qua phong cách Vibe Coding có kỷ luật.
- **Tài liệu học tập:** Đã biên soạn cẩm nang chi tiết vai trò của 6 công nghệ (Nginx, RabbitMQ, Redis, Postgres, NestJS, Angular) tại `docs/architecture/02-tech-stack-roles.md`.
- **Hạ tầng đã sẵn sàng:** 6 container đã chạy thực tế trên máy host tại `http://localhost:8080`.
- **Quy tắc làm việc với Git:** **TUYỆT ĐỐI KHÔNG tự ý commit code**. Chỉ thực hiện `git commit` khi người dùng yêu cầu rõ ràng.
- **Thay thế Prisma bằng TypeORM:** Loại bỏ hoàn toàn sự phụ thuộc vào file nhị phân `query-engine` của Prisma vốn dễ bị timeout trên mạng doanh nghiệp có proxy; TypeORM tương thích trực tiếp 100% với TypeScript và NestJS.
- **Thiết kế Database linh hoạt:** Hỗ trợ tiến hóa schema thông qua Database Migrations mà không làm mất dữ liệu cũ.

---

## ⏭️ 4. Tồn đọng cho buổi tiếp theo (Next Steps / Backlog)
- [ ] Xây dựng Frontend Angular (`apps/web`): Cấu trúc màn hình Học bài Effortless English (Sidebar danh sách bài, Main Article hiển thị đoạn văn đánh dấu từ vựng, Audio Player tương tác phát bài nghe).
- [ ] Xây dựng Auth Module (NestJS JWT Authentication): Đăng nhập, đăng ký, bảo vệ tiến độ học cho từng học viên.
- [ ] Tích hợp Redis Caching: Cache danh sách khóa học và chi tiết bài học để giảm tải truy vấn cơ sở dữ liệu.
- [ ] Tích hợp RabbitMQ: Bắn event cập nhật tiến độ học tập (`user.lesson.progress_updated`) để xử lý bất đồng bộ.
