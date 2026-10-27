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


### [Admin Studio] Lỗi ValidationPipe (forbidNonWhitelisted) khi đồng bộ dữ liệu Lesson, Article, Vocabulary và Audio
- **Ngày**: 2026-10-25
- **Task**: Xây dựng Admin Studio biên tập bài học 3 tab cho SpeakUp CMS
- **Chi tiết**:
  1. **Hiện tượng:** Khi ấn lưu bài học trên Admin Studio, API trả về 400 Bad Request với các lỗi:
     `property durationMinutes should not exist`, `article.property contentHtml should not exist`, `article.content must be a string`, `vocabularies.0.property exampleEn should not exist`, v.v.
  2. **Nguyên nhân gốc rễ:** 
     - NestJS cấu hình `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`. Khi client gửi lên các field không có trong DTO (`durationMinutes` thay vì `description`, `contentHtml` thay vì `content`, `exampleEn/exampleVi` thay vì `exampleSentence/definitionEn`, `transcriptHtml` thay vì `transcript`), server sẽ lập tức từ chối request.
     - `CreateLessonDto` ban đầu chỉ có các trường cơ bản của Lesson mà thiếu quan hệ lồng nhau (`article`, `vocabularies`, `audios`).
  3. **Giải pháp triệt để:**
     - Bổ sung `article`, `vocabularies`, `audios` vào `CreateLessonDto` và triển khai TypeORM transaction trong cả `create` và `update` của `AdminLessonsService`.
     - Đồng bộ hóa toàn bộ Model Frontend (`AdminArticle`, `AdminVocabulary`, `AdminAudio`, `AdminLessonDetail`) với DTO Backend.
- **Files liên quan**: `apps/api/src/modules/admin/dto/`, `apps/api/src/modules/admin/services/admin-lessons.service.ts`, `apps/web/src/app/core/services/admin.service.ts`, `apps/web/src/app/features/admin/lessons/lesson-editor.component.ts`


### [Mobile UI & CSS Flexbox] Course Modal Bottom Sheet vỡ layout & Badge trôi lên góc trên màn hình
- **Ngày**: 2026-10-27
- **Task**: Sửa lỗi giao diện Mobile Bottom Sheet khi click vào khóa học trên màn hình Dashboard (`/courses`)
- **Chi tiết**:
  1. **Hiện tượng:**
     - Badge "CƠ BẢN" (`.level-badge`) bị bay ra ngoài modal, trôi lơ lửng ở góc trên bên trái màn hình (`top: 12px; left: 12px;`) đè lên Navbar.
     - Bottom sheet bị cắt cụt phần dưới: chỉ thấy tiêu đề và heading "Danh sách bài học", danh sách các bài học và nút bấm dưới footer ("Đóng", "Bắt đầu bài 1") bị tràn xuống ngoài màn hình không cuộn tới được.
  2. **Nguyên nhân gốc rễ:**
     - `.level-badge` có CSS `position: absolute; top: 12px; left: 12px;` ở phạm vi toàn component thay vì scope trong `.card-thumb`. Khi đặt trong modal header mà các thẻ cha (`.modal-title-wrap`, `.modal-header`, `.modal-dialog`) không có `position: relative`, badge nhận `.modal-backdrop` (`position: fixed; inset: 0;`) làm gốc tọa độ.
     - `.modal-dialog` dùng Flexbox dạng cột nhưng `.modal-header` và `.modal-footer` không có `flex-shrink: 0`, đồng thời `.modal-body` dùng `flex: 1` mà thiếu `min-height: 0` (mặc định flex item có `min-height: auto`), khiến modal container bị bung chiều cao vượt qua viewport điện thoại mà không kích hoạt thanh cuộn nội dung.
  3. **Giải pháp triệt để:**
     - Chuyển `.level-badge` mặc định sang `display: inline-flex; align-items: center; position: static;` và chỉ đặt `position: absolute` khi nằm trong `.card-thumb .level-badge`.
     - Quy định rõ ràng trong modal flex column: `.modal-header` và `.modal-footer` có `flex-shrink: 0;`, `.modal-body` có `flex: 1 1 auto; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;`.
     - Bổ sung `max-height: 85dvh` và `env(safe-area-inset-bottom)` cho vùng an toàn trên thiết bị di động.
- **Files liên quan**: `apps/web/src/app/features/learning/course-dashboard.component.ts`

### [Admin CMS & Flexbox] Giao diện Admin bị tràn và che khuất lề phải (Right Overflow & Cutoff)
- **Ngày**: 2026-10-27
- **Task**: Khắc phục lỗi trang Quản lý Khóa học (`/admin/courses`) bị che khuất mép phải (nút Thêm Khóa Học, card stats và các nút thao tác Sửa/Xóa bị cắt cụt)
- **Chi tiết**:
  1. **Hiện tượng:** Trên màn hình tablet/laptop nhỏ (độ rộng ~1024px), nút `+ Thêm Khóa Học Mới` bị cắt thành `+ Thêm K...`, card thống kê thứ 3 và các nút thao tác Sửa/Xóa ở cột cuối của bảng bị tràn khỏi mép phải màn hình mà không thể cuộn tới được.
  2. **Nguyên nhân gốc rễ:**
     - Trong CSS Flexbox, `.admin-main` và `.admin-content-body` là flex item có `min-width: auto;` mặc định. Khi bảng `<table>` bên trong có kích thước nội tại lớn (tổng các cột > 800px) và component host element `<app-course-list>` không có `display: block; min-width: 0;`, toàn bộ container `.admin-main` bị kéo giãn vượt quá chiều rộng còn lại của màn hình (`100vw - 270px`).
     - Đồng thời `body` có `overflow-x: hidden;` khiến phần nội dung bị tràn ra ngoài cửa sổ bị trình duyệt cắt đứt hoàn toàn.
  3. **Giải pháp triệt để:**
     - Giới hạn cứng kích thước cho `.admin-main`: `width: calc(100vw - 270px); max-width: calc(100vw - 270px); min-width: 0;` (và `100vw` khi mobile <= 900px).
     - Bổ sung `min-width: 0; width: 100%; box-sizing: border-box;` cho `.admin-content-body`.
     - Thêm `:host { display: block; width: 100%; min-width: 0; }` cho các component Admin (`course-list`, `lesson-list`, `lesson-editor`).
     - Đặt `width: 100%; min-width: 0;` cho `.table-card` và `width: 100%; overflow-x: auto;` cho `.table-responsive` kèm `min-width: 820px;` cho `<table>`.
- **Files liên quan**: `apps/web/src/app/features/admin/layout/admin-layout.component.scss`, `apps/web/src/app/features/admin/courses/course-list.component.scss`, `apps/web/src/app/features/admin/lessons/lesson-list.component.scss`
