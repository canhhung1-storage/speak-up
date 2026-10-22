# 📋 Kế Hoạch: Xây Dựng Landing Page 100% English & Tích Hợp Đăng Nhập Google (Google OAuth 2.0)

> **Mục tiêu:** Xây dựng trang Landing Page chuyên nghiệp, truyền cảm hứng về phương pháp Effortless English với giao diện 100% Tiếng Anh bằng Angular mới nhất + SCSS; đồng thời tích hợp luồng xác thực Google Sign-In bảo vệ khu vực học tập.  
> **Người thực hiện:** Dev + AI Agent  
> **Quy tắc làm việc:** Làm từng bước một, báo cáo sau mỗi bước, chỉ tiếp tục khi người dùng xác nhận. Tuyệt đối KHÔNG tự ý commit code.

---

## 🎯 1. Mục tiêu cốt lõi (Core Goals)
- [ ] Giao diện website sử dụng **100% Tiếng Anh** chuẩn mực, cao cấp theo quy chuẩn [Web Design Backbone](../../.agent/rules/web-design-backbone.md).
- [ ] Ứng dụng **Angular phiên bản mới nhất** với **SCSS** (Standalone components, KHÔNG dùng Tailwind CSS).
- [ ] Trang Landing Page hấp dẫn giới thiệu phương pháp Effortless English của thầy A.J. Hoge (Main Story, Mini-Story, POV, Deep Learning) tại route `/`.
- [ ] Tích hợp xác thực **Google Sign-In** thật (Google Identity Services trên Frontend, `google-auth-library` trên Backend NestJS).
- [ ] Thiết lập `AuthGuard` bảo vệ trang học tập (`/courses`, `/learn`).

---

## 🛠️ 2. Danh sách các bước thực hiện chi tiết (Checklist)

- [x] **Bước 1:** Khởi tạo nhánh Git `feature/web-landing-page-google-auth` và thiết lập kế hoạch theo dõi.
- [x] **Bước 2:** Cập nhật biến môi trường `GOOGLE_CLIENT_ID` vào `.env.example`, `.env`, Docker Compose và tạo tài liệu hướng dẫn chi tiết `docs/guides/google-oauth-setup.md`.
- [x] **Bước 3:** Khởi tạo dự án **Angular mới nhất** với **SCSS** trong `apps/web`:
  - Khởi tạo cấu trúc Standalone Components, hệ thống Design Tokens SCSS (màu sắc, typography, glassmorphism, responsive).
  - Cấu hình Angular Router (`/` ➔ Landing Page, `/courses` ➔ Learning Dashboard có AuthGuard).
  - Cập nhật `Dockerfile` cho `apps/web` để chạy mượt mà trong Docker Compose.
- [x] **Bước 4:** Thiết kế chi tiết các Section của **Landing Page (100% Tiếng Anh)** khớp 100% theo ảnh mẫu:
  - Header / Navbar (Sticky, logo gradient, menu The Method / How It Works, nút toggle Dark/Light mode, nút Dashboard CTA).
  - Hero Section (Pill badge, headline, sub-headline, nút CTA, Floating Audio Player Card với hiệu ứng bay và highlight câu chuyện *Dragons*).
  - The 4 Pillars of Fluency (4 Cards pastel: Audio Article, Vocabulary, Mini-Story có viền active nổi bật, Point of View).
  - How It Works (4 Step Cards lộ trình với số watermark lớn mờ nhạt 01 - 04).
  - Bottom Dark Radial CTA Banner (*"Ready to Speak English Effortlessly?"*).
  - Footer chuẩn mực và hệ thống ThemeService hỗ trợ chuyển đổi mượt mà giữa Dark và Light mode.
- [ ] **Bước 5:** Xây dựng **Backend Google Auth (`apps/api`)**:
  - Cài đặt `google-auth-library` và `@nestjs/jwt`.
  - Xây dựng `AuthModule` với endpoint `POST /api/auth/google`.
  - Verify Google ID Token, tự động tạo / cập nhật tài khoản vào bảng `users` PostgreSQL, trả về SpeakUp JWT.
- [ ] **Bước 6:** Tích hợp **Google Sign-In trên Frontend Angular**:
  - Tích hợp Google Identity Services SDK trên nút Sign-In của Navbar và Hero CTA.
  - Xây dựng `AuthService` quản lý JWT, thông tin user và trạng thái đăng nhập.
  - Xây dựng `AuthGuard` bảo vệ các route học tập.
  - Cập nhật Navbar hiển thị Avatar và nút Sign Out khi đã đăng nhập.
- [ ] **Bước 7:** Kiểm thử toàn diện trên trình duyệt qua cổng `:8080` và xác nhận hoàn thành tính năng.

---

## 📝 3. Quyết định kỹ thuật (Technical Decisions)
- **Frontend Stack**: Angular mới nhất (Standalone Components, Signals, SCSS thuần kết hợp CSS Custom Properties).
- **Ngôn ngữ**: 100% English trên toàn bộ UI/UX.
- **Xác thực**: Google Identity Services + Google OAuth ID Token Verification trên NestJS.
- **Git Branch**: `feature/web-landing-page-google-auth`.
