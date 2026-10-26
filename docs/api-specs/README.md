# 📐 SpeakUp - Hệ Thống Tài Liệu Phân Tích & Thiết Kế API (API Design Specs)

> **Mục tiêu:** Lưu trữ các bản phân tích thiết kế kỹ thuật chuyên sâu (Deep Technical Specs) cho từng API cốt lõi trong hệ thống SpeakUp.
> Swagger UI (`/api/docs`) chịu trách nhiệm về **Giao diện/Hợp đồng dữ liệu (Contract - DTOs, HTTP Status)**, trong khi tài liệu này chịu trách nhiệm về **Kiến trúc ngầm (Architecture, Business Logic, Transaction, Caching, Concurrency, Security, Error Catalog)**.

---

## 1. Nguyên Tắc Thiết Kế API (Core Principles)

Tuân thủ nghiêm ngặt theo [Backend API Backbone Rule](file:///d:/MY_PROJECT/speak-up/.agent/rules/backend-api-rules.md) và [General Clean Code Rule](file:///d:/MY_PROJECT/speak-up/.agent/rules/general-coding-rules.md):

1. **3-Tier Architecture:** Controller (HTTP Routing, Input Validation) ➔ Service (Business Logic, Transaction, Orchestration) ➔ Repository/DAO (Database IO).
2. **Strict DTO Mapping:** Tuyệt đối không trả thẳng Database Entity ra Response. Mọi dữ liệu vào/ra đều qua DTO với `class-validator` whitelist.
3. **Fail-safe & Transactional Integrity:** Mọi thao tác ghi chạm từ 2 bảng trở lên bắt buộc dùng TypeORM Transaction (`DataSource.transaction` hoặc `QueryRunner`).
4. **Idempotency & Race Condition Prevention:** Chống ghi đè dữ liệu, xử lý concurrency với token rotation và composite unique indexes.
5. **Multi-layer Security:** Dual-token JWT (Access Token 15m trong Header + Refresh Token 7d trong HttpOnly Cookie), RBAC `@Roles(UserRole.ADMIN)` qua `RolesGuard`.

---

## 2. Ma Trận Phân Loại API Trong Hệ Thống

| Nhóm Phân Hệ | Tài liệu Thiết kế (API Design Spec) | Swagger / OpenAPI | Ghi chú Trọng tâm |
| :--- | :---: | :---: | :--- |
| **Auth & Security** | [auth-and-token-rotation.md](./auth/auth-and-token-rotation.md) | `GET /api/docs` (`Auth`) | Google OAuth 2.0, Dual-token, Token Rotation, Token Reuse Detection, Redis Session Storage. |
| **Admin Studio** | [lesson-studio-transaction.md](./admin/lesson-studio-transaction.md) | `GET /api/docs` (`Admin - Lessons Studio`) | Transactional atomic multi-table save across `lessons`, `articles`, `vocabularies`, `audios`. |
| **Learner Access** | [course-and-lesson-access.md](./learner/course-and-lesson-access.md) | `GET /api/docs` (`Learner - Courses`) | Truy vấn bài học kết hợp quan hệ lồng nhau, kiểm tra trạng thái publish, cấu trúc response an toàn. |

---

## 3. Khung Chuẩn Bản Phân Tích Thiết Kế (Template Guideline)

Mỗi tài liệu API Spec bao gồm 7 phần cốt lõi:
1. **Tổng quan & Mục tiêu Nghiệp vụ (Overview & Business Purpose):** Endpoint, HTTP Method, Role, Rate Limit.
2. **Sơ đồ Luồng Nghiệp vụ (Flow & Sequence Diagram):** Trình tự tương tác Client ➔ Gateway ➔ Controller ➔ Service ➔ Database / Redis / MQ.
3. **Database Impact & Data Integrity:** Các bảng bị ảnh hưởng, Foreign Keys, Unique Indexes, Transaction Isolation Level.
4. **Caching & Redis Strategy:** Cache Key Pattern, TTL, Chiến lược Invalidation khi ghi dữ liệu.
5. **Security, Concurrency & Edge Cases:** Token reuse detection, Race condition, Idempotency, Silent Refresh deduplication.
6. **Danh mục Mã Lỗi Nghiệp vụ (Error Matrix):** Bảng ánh xạ HTTP Status + Error Message + Nguyên nhân + Giải pháp xử lý từ Client.
7. **Kịch bản Kiểm thử Tự động (Testing Verification Scenarios):** Happy Path và Bad Path (Boundary tests).
