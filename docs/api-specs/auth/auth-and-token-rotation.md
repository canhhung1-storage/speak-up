# 🔐 [API Spec] Xác Thực Người Dùng & Quản Lý Phiên (Auth & Dual-Token Rotation)

- **Phân hệ:** Authentication & Security
- **Endpoints:**
  - `POST /api/auth/google` (Đăng nhập Google OAuth 2.0 & Cấp Dual Token)
  - `POST /api/auth/refresh` (Xoay vòng Refresh Token & Cấp Access Token mới)
  - `POST /api/auth/logout` (Thu hồi phiên làm việc & Hủy bỏ Refresh Token trong Redis)
  - `GET /api/auth/me` (Lấy thông tin tài khoản đang đăng nhập)
- **Quyền hạn (RBAC):** Public (Google/Refresh/Logout), Authenticated (`GET /api/auth/me`)
- **Tần suất giới hạn (Rate Limit):** 100 requests/phút (Global Throttler)

---

## 1. Mục Tiêu Nghiệp Vụ & Kiến Trúc Dual-Token

Hệ thống học tập SpeakUp đòi hỏi trải nghiệm liền mạch cho học viên (nghe audio nhiều giờ không bị ngắt quãng đăng nhập lại), đồng thời phải đạt chuẩn an toàn thông tin cao cấp:

1. **Access Token (Short-lived - 15 phút):**
   - Định dạng: JWT (HMAC-SHA256) chứa `sub` (User ID), `email`, `role`, `type: 'access'`.
   - Vị trí lưu trữ Client: Bộ nhớ RAM (Angular Signal) + LocalStorage.
   - Truyền tải: Gửi kèm tiêu đề HTTP `Authorization: Bearer <access_token>`.
2. **Refresh Token (Long-lived - 7 ngày):**
   - Định dạng: JWT (HMAC-SHA256) ký bằng secret riêng (`JWT_REFRESH_SECRET`) chứa `sub`, `tokenId` (UUID v4), `familyId` (UUID v4), `type: 'refresh'`.
   - Vị trí lưu trữ Client: **HttpOnly Cookie** (`refresh_token`, `SameSite=Lax`, `Secure` trên Production) chống tấn công XSS hoàn toàn.
   - Vị trí lưu trữ Server: **Redis Key-Value** với TTL 7 ngày: `auth:refresh:<userId>:<tokenId>`.
3. **Cơ chế Refresh Token Rotation (Xoay vòng Token):**
   - Mỗi lần Client dùng Refresh Token để lấy Access Token mới, Refresh Token đó sẽ **bị hủy ngay lập tức** và một cặp Dual-Token hoàn toàn mới được sinh ra.
4. **Cơ chế Phát Hiện Tái Sử Dụng Token (Token Reuse Detection):**
   - Nếu một Refresh Token cũ đã bị xoay vòng (không còn tồn tại trong Redis) nhưng lại được gửi lên server ➔ **Hệ thống phát hiện có kẻ gian đánh cắp token** ➔ Lập tức thu hồi (purge) **TOÀN BỘ phiên đăng nhập** của User đó trong Redis và chặn truy cập ngay.

---

## 2. Sơ Đồ Luồng Nghiệp Vụ (Sequence Diagrams)

### 2.1. Đăng nhập Google SSO (`POST /api/auth/google`)

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Học viên (Browser)
    participant GIS as Google Identity Services
    participant Nginx as Nginx Gateway (:8080)
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant GoogleAPI as Google OAuth2 Server
    participant DB as PostgreSQL (users)
    participant Redis as Redis Cache (:6379)

    Learner->>GIS: Chọn tài khoản Google đăng nhập
    GIS-->>Learner: Trả về Google credential (ID Token)
    Learner->>Nginx: POST /api/auth/google { idToken }
    Nginx->>AuthCtrl: Chuyển tiếp Request
    AuthCtrl->>AuthSvc: authenticateWithGoogle(dto)
    AuthSvc->>GoogleAPI: verifyIdToken(idToken, audience)
    GoogleAPI-->>AuthSvc: TokenPayload { email, sub, name, picture, email_verified }
    
    alt Email chưa xác thực trên Google
        AuthSvc-->>AuthCtrl: 401 Unauthorized (Email not verified)
        AuthCtrl-->>Learner: Thông báo lỗi
    else Email hợp lệ
        AuthSvc->>DB: findOne(googleId OR email)
        alt User chưa tồn tại
            AuthSvc->>DB: INSERT INTO users (role: LEARNER, ...)
        else User đã tồn tại
            AuthSvc->>DB: UPDATE users (cập nhật avatar, name, googleId nếu thiếu)
        end
        DB-->>AuthSvc: User Entity
        
        AuthSvc->>AuthSvc: Sinh tokenId (UUID), familyId (UUID)
        AuthSvc->>AuthSvc: Ký Access Token (15m) + Refresh Token (7d)
        AuthSvc->>Redis: SETEX "auth:refresh:<userId>:<tokenId>" 604800 { familyId, createdAt }
        
        AuthSvc-->>AuthCtrl: AuthResponseDto
        AuthCtrl-->>Nginx: Trả JSON + Set-Cookie (refresh_token, HttpOnly)
        Nginx-->>Learner: 200 OK { accessToken, expiresIn: 900, user }
    end
```

---

### 2.2. Xoay vòng Refresh Token & Phát hiện Tấn công (`POST /api/auth/refresh`)

```mermaid
sequenceDiagram
    autonumber
    actor Client as Angular App (authInterceptor)
    participant Nginx as Nginx Gateway
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthService
    participant Redis as Redis Store
    participant DB as PostgreSQL (users)

    Client->>Nginx: POST /api/auth/refresh (Kèm Cookie: refresh_token)
    Nginx->>AuthCtrl: Chuyển tiếp
    AuthCtrl->>AuthSvc: refreshTokens(cookieToken)
    
    AuthSvc->>AuthSvc: jwtService.verify(refreshToken, refreshSecret)
    Note over AuthSvc: Trích xuất sub (userId), tokenId, familyId
    
    AuthSvc->>Redis: GET "auth:refresh:<userId>:<tokenId>"
    
    alt Key KHÔNG TỒN TẠI trong Redis (Token đã dùng hoặc bị đánh cắp)
        Note over AuthSvc,Redis: 🚨 PHÁT HIỆN REUSE TOKEN! BỊ TẤN CÔNG ĐÁNH CẮP TOKEN!
        AuthSvc->>Redis: delPattern "auth:refresh:<userId>:*" (Hủy TẤT CẢ phiên của User)
        AuthSvc-->>AuthCtrl: Ném 401 Unauthorized (Security alert: All sessions terminated)
        AuthCtrl-->>Client: 401 Unauthorized -> Buộc đăng xuất toàn bộ thiết bị
    else Token hợp lệ trong Redis
        AuthSvc->>Redis: DEL "auth:refresh:<userId>:<tokenId>" (Thu hồi token hiện tại)
        AuthSvc->>DB: findOne(userId)
        
        AuthSvc->>AuthSvc: Sinh new-tokenId, giữ nguyên familyId
        AuthSvc->>AuthSvc: Ký new-AccessToken (15m) + new-RefreshToken (7d)
        AuthSvc->>Redis: SETEX "auth:refresh:<userId>:<new-tokenId>" 604800 { familyId }
        
        AuthSvc-->>AuthCtrl: AuthResponseDto
        AuthCtrl-->>Client: 200 OK + Set-Cookie mới
    end
```

---

## 3. Tác Động Cơ Sở Dữ Liệu & Lưu Trữ Phiên (Storage Impact)

### 3.1. PostgreSQL (`users` Table)
- **Truy vấn khi Login:**
  ```sql
  SELECT * FROM users 
  WHERE google_id = $1 OR email = $2 
  LIMIT 1;
  ```
- **Chỉ mục tối ưu:**
  - `users_pkey` (`id` UUID PRIMARY KEY)
  - `users_email_key` (`email` UNIQUE INDEX)
  - `users_google_id_key` (`google_id` UNIQUE INDEX)

### 3.2. Redis In-Memory Key Design
| Key Pattern | Cấu trúc dữ liệu | Giá trị lưu trữ | TTL | Mục đích |
| :--- | :---: | :--- | :---: | :--- |
| `auth:refresh:{userId}:{tokenId}` | String | JSON `{ familyId, createdAt, userAgent }` | 604,800 giây (7 ngày) | Theo dõi trạng thái active của Refresh Token theo từng thiết bị. |

---

## 4. Xử Lý Concurrency & Khử Lặp Gọi API Phía Frontend

Trong ứng dụng Angular, khi Access Token 15 phút vừa hết hạn, nếu học viên mở trang tải đồng thời 5 request API (`/api/courses`, `/api/auth/me`, `/api/learning/progress`...):
- Cả 5 request sẽ đồng thời nhận `401 Unauthorized`.
- Nếu cả 5 request đều gọi `POST /api/auth/refresh`, request đầu tiên sẽ thu hồi token, 4 request sau sẽ bị coi là **Token Reuse** và học viên bị văng ra ngoài bất đắc dĩ!

### ✅ Giải pháp triệt để: In-flight Request Deduplication trong [`AuthService`](file:///d:/MY_PROJECT/speak-up/apps/web/src/app/core/services/auth.service.ts)
```typescript
private refreshInFlight$: Observable<AuthResponse> | null = null;

refreshToken(): Observable<AuthResponse> {
  if (!this.refreshInFlight$) {
    this.refreshInFlight$ = this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res) => this.setSession(res)),
        finalize(() => {
          this.refreshInFlight$ = null; // Giải phóng khi xong
        }),
        shareReplay(1) // Chia sẻ chung 1 response duy nhất cho tất cả các subscriber cùng thời điểm
      );
  }
  return this.refreshInFlight$;
}
```
Nhờ `shareReplay(1)` và cờ `X-Auth-Retry` trong [`authInterceptor`](file:///d:/MY_PROJECT/speak-up/apps/web/src/app/core/interceptors/auth.interceptor.ts), toàn bộ 5 request chờ chung kết quả của 1 lần refresh duy nhất, loại bỏ hoàn toàn Race Condition.

---

## 5. Danh Mục Mã Lỗi Nghiệp Vụ (Error Matrix)

| HTTP Status | Message Phản Hồi | Nguyên Nhân | Hành Vi Xử Lý Phía Client |
| :---: | :--- | :--- | :--- |
| `400` | `Bad Request: idToken should not be empty` | Client gửi body rỗng hoặc thiếu token | Báo lỗi đăng nhập Google |
| `401` | `Invalid or expired Google token` | Token Google đã quá hạn hoặc sai Client ID | Mở lại popup Google SSO |
| `401` | `Google account does not provide an email address` | Tài khoản Google bị ẩn email | Thông báo cần cấp quyền email |
| `401` | `Google email address is not verified` | Email Google chưa xác nhận bảo mật | Yêu cầu xác thực tài khoản Google |
| `401` | `Invalid or expired refresh token` | Refresh token hết hạn 7 ngày hoặc sai chữ ký | Xóa localStorage, điều hướng về `/login` |
| `401` | `Security alert: Refresh token reuse detected. All sessions terminated.` | Phát hiện token đã sử dụng bị gọi lại (nghi vấn bị đánh cắp) | Cảnh báo bảo mật, bắt đăng nhập lại từ đầu |
| `403` | `Access denied: Required role [ADMIN], but your role is [LEARNER]` | Learner cố gọi API quản trị | Chuyển hướng về `/courses` |
| `429` | `ThrottlerException: Too Many Requests` | Vượt quá 100 requests/phút | Chặn gửi request, hiển thị đếm ngược |

---

## 6. Kịch Bản Kiểm Thử Xác Minh (Testing Scenarios)

1. **Happy Path Login:** Gửi Google ID Token hợp lệ ➔ Nhận về Access Token và Cookie `refresh_token` ➔ Kiểm tra Redis có key `auth:refresh:<userId>:<tokenId>`.
2. **Happy Path Silent Refresh:** Gọi `POST /api/auth/refresh` với Cookie hợp lệ ➔ Nhận token mới, key cũ trong Redis bị xóa, key mới được tạo.
3. **Attack Scenario (Token Reuse):** Lưu lại refresh token cũ, sau khi đã refresh xong, cố tình gửi lại refresh token cũ đó ➔ Server phải trả về `401`, toàn bộ key `auth:refresh:<userId>:*` trong Redis bị xóa sạch, các session khác trên thiết bị khác cũng bị đăng xuất.
