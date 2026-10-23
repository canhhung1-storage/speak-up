# 📋 Kế Hoạch Ngày: 2026-10-22 - Khởi Động Dự Án, Hạ Tầng Docker, Landing Page & Google Auth

> **Trạng thái:** 🟢 Hoàn thành 100% (Done)  
> **Người thực hiện:** Dev + AI Agent  
> **Nhánh thực hiện:** `master` ➔ `feature/web-landing-page-google-auth`  
> **Workflow áp dụng:** `.agent/workflows/plan.md` (Đã hoàn thành đủ 3 Pha: Brainstorm ➔ Execute ➔ Save Learnings)

---

## 🎯 1. Mục tiêu cốt lõi trong ngày (Goals)

1. **Khởi tạo quy chuẩn quản lý dự án & Hạ tầng Monorepo:**
   - Thiết lập cấu trúc thư mục Monorepo (`apps/api`, `apps/web`, `docker`, `docs`, `plans`).
   - Xây dựng hệ sinh thái Docker Compose gồm 6 services (Nginx, PostgreSQL 16, Redis, RabbitMQ, NestJS, Angular).
2. **Thiết kế Cơ sở dữ liệu & Backend Core:**
   - Bóc tách ERD 7 bảng chuẩn hóa cho phương pháp học tiếng Anh Effortless English.
   - Thay thế Prisma bằng TypeORM tối ưu cho môi trường mạng doanh nghiệp.
   - Seed data thực tế (Khóa học *Power English*, bài học *A Kiss* với văn bản highlight `<mark>`, 5 từ vựng, 3 audio).
   - Xây dựng các REST API endpoints 3 lớp chuẩn hóa DTO: `/api/courses`, `/api/courses/:slug`, `/api/courses/:courseSlug/lessons/:lessonSlug`.
3. **Frontend Web Landing Page & Google Sign-In (100% Tiếng Anh):**
   - Khởi tạo Angular mới nhất với SCSS thuần kết hợp CSS Variables theo [Web Design Backbone Rule](../../.agent/rules/web-design-backbone.md).
   - Thiết kế giao diện Landing Page cao cấp (Dark/Light mode, Hero Audio Card bay bổng, 4 Pillars of Fluency, How It Works, CTA Banner, Footer).
   - Trang Đăng nhập Split-Screen (`/login`) tích hợp Google Identity Services (GIS SDK).
   - Backend xác thực Google ID Token, upsert user vào PostgreSQL và cấp phát SpeakUp JWT Token.
   - Route `AuthGuard` bảo vệ trang Dashboard (`/courses`).
4. **Nâng cấp An ninh & Phòng thủ Đa tầng (Security Hardening):**
   - Chặn Account Takeover với `payload.email_verified`.
   - Cài đặt và cấu hình `@nestjs/throttler` (Rate limit 10 requests/phút cho login).
   - Cài đặt `helmet` thiết lập HTTP Security Headers.
   - Thắt chặt CORS Whitelist theo biến môi trường `ALLOWED_ORIGINS`.
   - Xây dựng `authInterceptor` trên Angular tự động đính kèm `Bearer Token` và xử lý `401 Unauthorized`.
   - Biên soạn tài liệu kiến trúc số 04: `docs/architecture/04-authentication-security.md`.

---

## 🛠️ 2. Danh sách công việc chi tiết (Detailed Checklist)

### 🔹 PHIÊN 1: Hạ Tầng Monorepo, Database ERD & Backend Core API

#### Nhóm 1.1: Quản lý & Tài liệu nền tảng
- [x] Tạo `plans/README.md` và `plans/template.md`.
- [x] Tạo `.gitignore` chuẩn Enterprise đa nền tảng.
- [x] Tạo sơ đồ hạ tầng `docs/architecture/01-docker-infrastructure.md`.
- [x] Tạo cẩm nang vai trò công nghệ `docs/architecture/02-tech-stack-roles.md`.
- [x] Tạo tài liệu tổng quan dự án `README.md` và cẩm nang vận hành `docs/GETTING_STARTED.md`.
- [x] Tạo tài liệu quy chuẩn Git `docs/GIT_STRATEGY.md`.
- [x] Thực hiện commit đầu tiên (Initial commit: `e069903`).

#### Nhóm 1.2: Triển khai Môi trường Docker Compose
- [x] Tạo `.env.example` và `.env` chuẩn hóa toàn bộ tham số môi trường.
- [x] Tạo cấu hình Nginx Reverse Proxy (`docker/nginx/Dockerfile`, `docker/nginx/default.conf`) chạy cổng `8080` (tránh xung đột System PID 4 Windows).
- [x] Tạo script khởi tạo Database PostgreSQL (`docker/postgres/init.sql`).
- [x] Tạo khung khởi đầu và Dockerfile cho `apps/api` (NestJS) và `apps/web` (Angular).
- [x] Viết file `docker-compose.yml` hoàn chỉnh (6 services, healthchecks, volumes, network).
- [x] Verify cú pháp bằng lệnh `docker compose config` (Clean 100%, 0 warning).

#### Nhóm 1.3: Thiết kế Cơ sở dữ liệu (Database Schema & ERD)
- [x] Bóc tách 7 thực thể cốt lõi: `users`, `courses`, `lessons`, `lesson_articles`, `lesson_vocabularies`, `lesson_audios`, `user_lesson_progress`.
- [x] Bổ sung `slug` cho `lessons` với ràng buộc duy nhất `UNIQUE(course_id, slug)`.
- [x] Đổi tên bảng từ vựng thành `lesson_vocabularies` cho đồng bộ với `lesson_articles` và `lesson_audios`.
- [x] Hoàn thiện sơ đồ Mermaid ERD và Từ điển Dữ liệu (Data Dictionary) chi tiết tại `docs/architecture/03-database-erd.md`.

#### Nhóm 1.4: Backend NestJS, TypeORM & Seed Data (`apps/api`)
- [x] Thay thế Prisma ORM bằng TypeORM (`@nestjs/typeorm`, `typeorm`, `pg`) nhằm tối ưu cho môi trường mạng doanh nghiệp.
- [x] Xây dựng 7 Entities TypeORM (`User`, `Course`, `Lesson`, `LessonArticle`, `LessonVocabulary`, `LessonAudio`, `UserLessonProgress`).
- [x] Cấu hình `TypeOrmModule` trong `app.module.ts` kết nối PostgreSQL với cơ chế auto sync.
- [x] Viết kịch bản Seed Data mẫu (`src/database/seeds/seed.ts`): Khóa học *Power English*, bài học *A Kiss* (Article có `<mark>`, 5 từ vựng, 3 bài audio Mini Story / POV / Commentary).
- [x] Xây dựng các REST API endpoints chuẩn hóa 3 lớp (3-Tier Architecture) kèm DTO:
  - `GET /api/courses`: Danh sách khóa học.
  - `GET /api/courses/:slug`: Chi tiết khóa học kèm danh sách bài học.
  - `GET /api/courses/:courseSlug/lessons/:lessonSlug`: Chi tiết bài học Effortless English.
- [x] Thiết lập Global Exception Filter (`HttpExceptionFilter`) chuẩn hóa phản hồi lỗi JSON đồng nhất.

---

### 🔹 PHIÊN 2: Frontend Landing Page, Google Sign-In & Security Hardening

#### Nhóm 2.1: Khởi tạo Angular & Design Tokens (`apps/web`)
- [x] Khởi tạo nhánh Git `feature/web-landing-page-google-auth`.
- [x] Cập nhật biến môi trường `GOOGLE_CLIENT_ID` vào `.env.example`, `.env`, Docker Compose và tạo hướng dẫn `docs/guides/google-oauth-setup.md`.
- [x] Khởi tạo dự án Angular mới nhất với SCSS: Standalone components, hệ thống Design Tokens SCSS (màu sắc, typography, glassmorphism, responsive).
- [x] Cấu hình Angular Router (`/` ➔ Landing Page, `/login` ➔ Login Page, `/courses` ➔ Learning Dashboard có AuthGuard).

#### Nhóm 2.2: Thiết kế Giao diện Landing Page & Login Page (100% Tiếng Anh)
- [x] Header / Navbar (Fixed, logo gradient, menu The Method / How It Works, Dark/Light mode toggle, trạng thái User / Sign In).
- [x] Hero Section (Pill badge, headline, Floating Audio Player Card bay bổng với bài *The Story of Dragons*).
- [x] The 4 Pillars of Fluency (4 Cards với số watermark 01 - 04, icon Inline SVG native tránh bị DomSanitizer strip).
- [x] How It Works (4 Step Cards lộ trình học ngấm).
- [x] Bottom Dark Radial CTA Banner (*"Ready to Speak English Effortlessly?"*).
- [x] Footer đa cột chuẩn mực và hệ thống `ThemeService` chuyển đổi Dark/Light mode.
- [x] Trang Login Split-Screen (`/login`): Branding, trích dẫn A.J. Hoge, form email/password và nút Google Sign-In chuẩn Google Identity Services.

#### Nhóm 2.3: Backend Google OAuth 2.0 & JWT Session (`apps/api`)
- [x] Cài đặt `google-auth-library`, `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`.
- [x] Cập nhật entity `User` (thêm `googleId`, cho phép `passwordHash` nullable).
- [x] Xây dựng `AuthModule`, `AuthController`, `AuthService` với endpoint `POST /api/auth/google` và `GET /api/auth/me`.
- [x] Xác thực Google ID Token với Google Client ID, upsert user vào PostgreSQL, phát hành SpeakUp JWT Bearer Token.

#### Nhóm 2.4: Tích hợp Google Sign-In & Bảo vệ Route trên Frontend (`apps/web`)
- [x] Xây dựng `AuthService` tích hợp Google Identity Services (GIS SDK), quản lý session bằng Angular Signals.
- [x] Nút `Continue with Google` tự động đồng bộ theo Dark/Light Theme.
- [x] Thiết lập `authGuard` tự động điều hướng về `/login?returnUrl=...` khi chưa đăng nhập.
- [x] Navbar hiển thị Avatar người dùng (kèm fallback initials `CN` và `referrerpolicy="no-referrer"`), nút Dashboard và Sign Out.
- [x] Màn hình chào đón `CourseDashboardComponent` hiển thị thông tin học viên sau khi đăng nhập.

#### Nhóm 2.5: Nâng cấp An ninh & Phòng thủ Đa tầng (Security Hardening)
- [x] **Vá lỗi Account Takeover:** Bắt buộc kiểm tra `payload.email_verified === true` từ Google Token trong `AuthService`.
- [x] **Rate Limiting:** Cài đặt `@nestjs/throttler`, cấu hình 100 req/phút toàn hệ thống và giới hạn tối đa 10 lần đăng nhập/phút cho `POST /api/auth/google`.
- [x] **Security Headers:** Cài đặt `helmet` bảo vệ ứng dụng khỏi clickjacking, MIME sniffing, ép chính sách HTTPS.
- [x] **Thắt chặt CORS Whitelist:** Cấu hình Whitelist đọc từ `ALLOWED_ORIGINS` hoặc fallback localhost, sẵn sàng cho Production domain.
- [x] **Angular HTTP Interceptor:** Xây dựng `authInterceptor` tự động gắn Bearer Token vào mọi request `/api` và bắt mã `401 Unauthorized` để tự động logout.
- [x] **Tài liệu hóa kiến trúc:** Biên soạn cẩm nang bảo mật `docs/architecture/04-authentication-security.md` kèm Mermaid Sequence Diagram 13 bước.

---

## 📝 3. Quyết định kỹ thuật & Ghi chú (Decisions & Notes)

- **Mục tiêu dự án kép:** Vừa là công cụ học tiếng Anh hàng ngày theo phương pháp Effortless English, vừa là dự án thực chiến rèn luyện kỹ năng Vibe Coding có kỷ luật.
- **Hạ tầng đã chạy ổn định:** 6 container Docker chạy trên cổng `http://localhost:8080`.
- **Thay thế Prisma bằng TypeORM:** Giúp giải quyết triệt để lỗi timeout tải query-engine binary trong môi trường mạng nội bộ doanh nghiệp.
- **Quy tắc làm việc với Git:** **TUYỆT ĐỐI KHÔNG tự ý commit code**. Chỉ commit khi có chỉ thị rõ ràng từ người dùng.
- **Bảo mật đa tầng:** Đã lưu lại 5 bài học lỗi vào `.agent/learnings/bugs-solutions.md` và tài liệu hóa chi tiết tại `docs/architecture/04-authentication-security.md`.

---

## ⏭️ 4. Tồn đọng cho ngày tiếp theo (Next Steps: 2026-10-23)

- [ ] Merge nhánh `feature/web-landing-page-google-auth` vào `master`.
- [ ] Khởi tạo nhánh mới `feature/effortless-learning-workspace`.
- [ ] Xây dựng Course Dashboard (`/courses`) kết nối REST API thật `/api/courses` và `/api/courses/:slug`.
- [ ] Xây dựng Không gian Học bài Effortless English Workspace (`/courses/:courseSlug/lessons/:lessonSlug`):
  - Sidebar điều hướng các phần bài học (Story, Vocab, Mini-Story, POV, Commentary).
  - Vùng đọc văn bản tương tác: Click từ vựng nổi bật (`<mark>`) mở tooltip giải thích nghĩa.
  - Interactive Audio Player chuyên dụng: Tua lùi 5s / tiến 5s, điều khiển tốc độ (0.75x, 1x, 1.25x, 1.5x) phục vụ việc nghe ngấm và phản xạ.
- [ ] API lưu tiến độ học tập của người dùng vào bảng `user_lesson_progress`.
