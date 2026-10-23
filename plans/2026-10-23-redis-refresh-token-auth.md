# 📋 Kế Hoạch: Hoàn Thiện Xác Thực Chuẩn Enterprise - Refresh Token Rotation & Quản Lý Phiên Bằng Redis (Hybrid Web + Mobile)

> **Trạng thái:** 🟢 Hoàn thành (Done)  
> **Người thực hiện:** Dev + AI Agent  
> **Nhánh thực hiện:** `feature/auth-redis-refresh-token`  
> **Workflow áp dụng:** `.agent/workflows/plan.md`  

---

## 🎯 1. Mục tiêu cốt lõi (Core Goals)

1. **Kết nối hạ tầng Redis (`speakup-redis`):**
   - Tích hợp `ioredis` vào NestJS Backend (`apps/api`).
   - Xây dựng `RedisModule` & `RedisService` dùng chung, hỗ trợ `set`, `get`, `del`, `scan/keys` và xử lý kết nối an toàn.
2. **Cơ chế Cặp Token (Dual-Token Pattern):**
   - `accessToken`: Sống ngắn (**15 phút**), mang payload `{ sub, email, role }`.
   - `refreshToken`: Sống dài (**7 ngày**), mang payload `{ sub, tokenId, familyId }`.
   - Lưu trữ Refresh Token vào Redis theo cấu trúc `auth:refresh:<userId>:<tokenId>` kèm TTL 7 ngày.
3. **Mô hình Hybrid Đa nền tảng (Web + Mobile):**
   - **Web:** Server tự động set `refreshToken` vào `HttpOnly Cookie` (cấm JavaScript đọc $\rightarrow$ Miễn nhiễm XSS).
   - **Mobile App:** Trả `refreshToken` trong JSON Body để lưu vào iOS Keychain / Android Keystore.
4. **Endpoint `POST /api/auth/refresh` & Refresh Token Rotation:**
   - Đọc linh hoạt từ `req.cookies['refreshToken']` (Web) hoặc `dto.refreshToken` (Mobile).
   - **Xoay vòng (Rotation):** Thu hồi Refresh Token cũ và phát hành Refresh Token mới.
   - **Phát hiện tái sử dụng (Reuse Detection):** Nếu phát hiện token đã thu hồi bị dùng lại $\rightarrow$ Xóa sạch mọi phiên của tài khoản đó trên Redis (`delPattern("auth:refresh:<userId>:*")`) để phòng chống hacker đánh cắp token.
5. **Endpoint `POST /api/auth/logout` (Thu hồi phiên tức thì):**
   - Hủy Refresh Token của thiết bị hiện tại trong Redis ngay lập tức (dưới 1ms) và xóa Cookie.
6. **Nâng cấp Frontend Angular (`apps/web`):**
   - Cập nhật `AuthService`: `withCredentials: true`, cung cấp `refreshToken()` và `logout()`.
   - Cập nhật `authInterceptor`: Bắt lỗi `401 Unauthorized`, tự động gọi âm thầm `/api/auth/refresh` (Silent Refresh) để lấy token mới và retry request ban đầu mà người dùng không hề bị gián đoạn hay đăng xuất đột ngột.
7. **Kiểm thử toàn diện:**
   - Biên dịch thành công 100% cả `apps/api` và `apps/web`.
   - Cập nhật tài liệu kiến trúc chính thức: `docs/architecture/04-authentication-security.md`.

---

## 🛠️ 2. Danh sách công việc chi tiết (Detailed Checklist)

### 🔹 Nhóm 1: Xây dựng Redis Module trong Backend NestJS (`apps/api`)
- [x] **Task 1.1:** Cài đặt `ioredis`, `cookie-parser` và type definitions tương ứng vào `apps/api`.
- [x] **Task 1.2:** Xây dựng `RedisModule` và `RedisService` (`src/common/redis/`):
  - Khởi tạo kết nối tới host `REDIS_HOST`, port `REDIS_PORT`, password `REDIS_PASSWORD` từ `ConfigService`.
  - Các hàm tiện ích: `set(key, val, ttlSeconds)`, `get(key)`, `del(key)`, `delPattern(pattern)` bằng SCAN stream non-blocking.
  - Logging trạng thái kết nối và xử lý lỗi kết nối.
- [x] **Task 1.3:** Đăng ký `@Global() RedisModule` vào `AppModule`.

### 🔹 Nhóm 2: Nâng cấp `AuthService` Backend hỗ trợ Cặp Token & Redis
- [x] **Task 2.1:** Cấu hình thời hạn JWT trong `auth.module.ts`:
  - `accessToken`: Hết hạn trong `15m` (qua `JWT_ACCESS_EXPIRES_IN`).
  - Hỗ trợ ký và giải mã `refreshToken` với secret `JWT_REFRESH_SECRET` sống `7d`.
- [x] **Task 2.2:** Cập nhật hàm `authenticateWithGoogle`:
  - Cấp đồng thời `accessToken` (15m) và `refreshToken` (7d).
  - Tạo `tokenId` (UUID) và `familyId` (UUID).
  - Lưu vào Redis: `auth:refresh:<userId>:<tokenId>` với TTL `7 * 24 * 3600` giây.
  - Cập nhật `AuthResponseDto` trả về `accessToken` và `refreshToken` (cho Mobile).
- [x] **Task 2.3:** Tạo DTO `RefreshTokenDto` (chấp nhận `refreshToken` tùy chọn từ body cho Mobile).
- [x] **Task 2.4:** Xây dựng logic xoay vòng `refreshTokens(token)` trong `AuthService`:
  - Giải mã `refreshToken`, kiểm tra tính hợp lệ.
  - Kiểm tra sự tồn tại trong Redis:
    - *Hợp lệ:* Xóa token cũ, tạo cặp token mới cùng `familyId`, lưu vào Redis, trả về client.
    - *Bị lộ (Key không có trong Redis):* Quét và xóa toàn bộ key `auth:refresh:<userId>:*` để bảo vệ tài khoản, ném lỗi `401 Unauthorized`.
- [x] **Task 2.5:** Thêm endpoint `POST /api/auth/refresh` và `POST /api/auth/logout` vào `AuthController` kèm cơ chế tự động set/clear `HttpOnly Cookie`.

### 🔹 Nhóm 3: Nâng cấp Frontend Angular (`apps/web`)
- [x] **Task 3.1:** Cập nhật `AuthService`:
  - Thêm `withCredentials: true` khi gọi Google login, refresh và logout.
  - Hàm `refreshToken()`: Gọi API `POST /api/auth/refresh`, cập nhật lại session mới.
  - Cập nhật hàm `logout()`: Gọi `POST /api/auth/logout` lên backend để xóa Redis session và clear cookie.
- [x] **Task 3.2:** Nâng cấp `authInterceptor`:
  - Khi API nhận lỗi `401`: Tự động gọi `authService.refreshToken()`, sau đó retry lại request gốc với Access Token mới.
  - Nếu refresh thất bại: Mới thực hiện logout và chuyển hướng về `/login`.

### 🔹 Nhóm 4: Kiểm thử, Nghiệm thu & Cập nhật Docs
- [x] **Task 4.1:** Build và verify Backend (`apps/api`) ➔ `0 errors`.
- [x] **Task 4.2:** Build và verify Frontend (`apps/web`) ➔ `0 errors`.
- [x] **Task 4.3:** Cập nhật trạng thái "Đã triển khai thực tế" trong tài liệu `docs/architecture/04-authentication-security.md`.

---

## 📝 3. Quyết định kỹ thuật (Technical Decisions)

- **Mô hình Hybrid:**
  - Web: Dùng `HttpOnly Cookie` (Path: `/api/auth`, SameSite: `Lax`) bảo vệ 100% trước XSS.
  - Mobile App: Nhận `refreshToken` trong JSON Body để lưu vào iOS Keychain / Android Keystore.
- **Phát hiện tái sử dụng Token (Reuse Detection):**
  - Sử dụng cơ chế `familyId` và xoay vòng ngay lập tức để phát hiện sớm các hành vi copy token từ kẻ tấn công.
- **Redis Resilience:**
  - Nếu Redis gặp sự cố gián đoạn kết nối, hệ thống log warning và có cơ chế reconnect tự động không làm crash server.
