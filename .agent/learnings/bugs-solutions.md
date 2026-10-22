# Bugs & Solutions Log

> Lưu trữ các bug đã gặp, nguyên nhân gốc rễ (root cause) và giải pháp khắc phục triệt để.
> AI sẽ tự động append nội dung vào đây sau các session làm việc để tránh lặp lại lỗi cũ.

---


### [Docker Windows] Xung đột Port 80 với System PID 4 và Container cũ không tương thích
- **Ngày**: 2026-10-22
- **Task**: Khởi động hệ sinh thái Docker Compose cho SpeakUp
- **Chi tiết**:
  1. **Lỗi cổng 80:** Trên Windows, port 80 bị chiếm giữ mặc định bởi tiến trình System PID 4 (IIS/HTTP.sys), gây lỗi `bind: An attempt was made to access a socket in a way forbidden by its access permissions`. Khắc phục: Đổi `NGINX_PORT=8080` trong `.env`.
  2. **Lỗi Postgres version mismatch:** Volume `speak-up_postgres_data` cũ khởi tạo bằng Postgres 15 gây crash khi dùng image Postgres 16 (`FATAL: database files are incompatible with server`). Khắc phục: Xóa container và volume cũ để Postgres 16 khởi tạo mới.
  3. **Lỗi Container Name Conflict:** Dọn dẹp các container `Exited` cũ bằng `docker rm -f`.
- **Files liên quan**: `docker-compose.yml`, `.env`, `.env.example`

### [Database & Proxy] Prisma engine binary timeout trên mạng doanh nghiệp & chuyển dịch sang TypeORM
- **Ngày**: 2026-10-22
- **Task**: Khởi tạo ORM kết nối PostgreSQL cho SpeakUp API
- **Chi tiết**:
  1. **Lỗi Prisma Engine:** Prisma yêu cầu download file nhị phân `query-engine` từ internet (`binaries.prisma.sh`). Trong môi trường mạng nội bộ công ty (corporate proxy/SSL inspection), tiến trình download bị treo vô tận hoặc lỗi chứng chỉ SSL.
  2. **Giải pháp triệt để:** Thay thế bằng **TypeORM** (`typeorm`, `@nestjs/typeorm`, `pg`). TypeORM là 100% JavaScript/TypeScript thuần, không yêu cầu bất kỳ file nhị phân ngoại lai nào, tích hợp sâu vào hệ sinh thái Dependency Injection của NestJS.
- **Files liên quan**: `apps/api/package.json`, `apps/api/src/app.module.ts`, `apps/api/src/database/entities/`


### [Frontend & Security] Google Avatar URL 403 Forbidden do Referrer Policy
- **Ngày**: 2026-10-22
- **Task**: Tích hợp Google OAuth 2.0 Avatar vào Navbar & Dashboard
- **Chi tiết**:
  1. **Hiện tượng:** Ảnh đại diện người dùng từ Google CDN (`lh3.googleusercontent.com`) bị lỗi ảnh vỡ (Broken image icon) mặc dù URL hoàn toàn hợp lệ.
  2. **Nguyên nhân gốc rễ:** Google CDN chặn truy cập (HTTP 403 Forbidden) nếu trình duyệt gửi tiêu đề `Referer` từ tên miền ngoài (như `http://localhost:8080/`).
  3. **Giải pháp triệt để:** 
     - Thêm thuộc tính `referrerpolicy="no-referrer"` vào thẻ `<img>` (`<img [src]="avatarUrl" referrerpolicy="no-referrer" />`).
     - Bổ sung cơ chế fallback `(error)="imageFailed.set(true)"` để tự động render avatar chữ cái đầu (`CN` - Canh Nguyen) trên nền tròn tinh tế nếu ảnh Google bị chặn hoặc mất mạng.
- **Files liên quan**: `apps/web/src/app/features/learning/course-dashboard.component.ts`, `apps/web/src/app/features/landing/components/navbar/navbar.component.ts`

### [Angular Security] DomSanitizer strip thẻ `<svg>` khi binding `[innerHTML]`
- **Ngày**: 2026-10-22
- **Task**: Render các icon SVG trong các card "4 Pillars" và "How It Works"
- **Chi tiết**:
  1. **Hiện tượng:** Truyền chuỗi SVG qua `[innerHTML]="step.iconSvg"` làm icon bị biến mất hoàn toàn trên giao diện.
  2. **Nguyên nhân gốc rễ:** Bộ lọc bảo mật `DomSanitizer` mặc định của Angular tự động loại bỏ (strip) các thẻ `<svg>` và các phần tử con (`<path>`, `<polygon>`) để phòng tránh lỗ hổng bảo mật XSS.
  3. **Giải pháp triệt để:** Chuyển sang Inline SVG native trong template kết hợp với cấu trúc điều khiển `@switch (step.iconType)` / `@case`. Cách này vừa an toàn 100%, vừa giúp CSS dễ dàng điều khiển màu sắc qua `currentColor`.
- **Files liên quan**: `apps/web/src/app/features/landing/components/pillars/pillars.component.ts`, `apps/web/src/app/features/landing/components/how-it-works/how-it-works.component.ts`

### [Docker & Node.js] Google OAuth verifyIdToken lỗi TLS Certificate trong môi trường mạng nội bộ
- **Ngày**: 2026-10-22
- **Task**: Xác thực Google ID Token với `google-auth-library` trên NestJS Backend
- **Chi tiết**:
  1. **Hiện tượng:** Khi gọi `OAuth2Client.verifyIdToken()`, request đến `https://www.googleapis.com/oauth2/v1/certs` bị lỗi: `Failed to retrieve verification certificates: request to ... failed, reason: unable to get local issuer certificate`.
  2. **Nguyên nhân gốc rễ:** Mạng doanh nghiệp hoặc VPN sử dụng tường lửa kiểm tra gói tin SSL (SSL/TLS Inspection), khiến Node.js trong container Alpine không tìm thấy chứng chỉ Root CA nội bộ trong kho Mozilla CA mặc định.
  3. **Giải pháp triệt để:** Bổ sung biến môi trường `NODE_TLS_REJECT_UNAUTHORIZED="0"` trong cấu hình môi trường phát triển (Development) tại `docker-compose.yml`.
- **Files liên quan**: `docker-compose.yml`, `apps/api/src/modules/auth/auth.service.ts`
