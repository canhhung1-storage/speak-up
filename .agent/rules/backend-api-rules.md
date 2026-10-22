---
description: Rule chuẩn mực bắt buộc cho phát triển Backend API (Spring Boot, NodeJS, Python, Go, Java...). AI PHẢI tuân thủ 100% khi viết hoặc sửa đổi code backend.
globs: "**/*.{java,kt,ts,js,py,go,cs,php}"
trigger: always_on
---

# Backend API Backbone Rule

> **LUẬT KHÔNG THỂ THƯƠNG LƯỢNG.** Vi phạm bất kỳ mục nào → sản phẩm **FAILED**.

## 1. Architecture & Layering — Phân lớp kiến trúc
- **Bắt buộc phân tách 3 lớp (3-Tier Architecture):**
  - **Controller Layer:** Chỉ tiếp nhận HTTP Request, validate dữ liệu đầu vào (DTO), gọi Service và trả về HTTP Response. **TUYỆT ĐỐI KHÔNG** viết business logic hoặc truy vấn DB trực tiếp ở Controller.
  - **Service Layer:** Chứa toàn bộ business logic. Xử lý tính toán, gọi Repository, quản lý transaction.
  - **Repository/DAO Layer:** Chỉ chịu trách nhiệm giao tiếp với Database (ORM/SQL).
- **Luôn sử dụng DTO (Data Transfer Object):** KHÔNG bao giờ trả thẳng Entity/Model của Database ra ngoài API Response. Luôn ánh xạ (map) sang DTO để bảo mật và kiểm soát dữ liệu trả về.

## 2. API Design & HTTP Status Codes — Chuẩn RESTful API
- Sử dụng đúng HTTP Methods: `GET` (lấy), `POST` (tạo mới), `PUT/PATCH` (cập nhật), `DELETE` (xóa).
- Trả về HTTP Status Codes chuẩn xác:
  - `200 OK` cho yêu cầu thành công, `201 Created` khi tạo mới thành công.
  - `400 Bad Request` khi dữ liệu đầu vào không hợp lệ (lỗi validation).
  - `401 Unauthorized` khi chưa đăng nhập / token hết hạn, `403 Forbidden` khi không đủ quyền.
  - `404 Not Found` khi không tìm thấy tài nguyên.
  - `500 Internal Server Error` cho lỗi hệ thống không mong muốn.

## 3. Exception Handling & Logging — Xử lý lỗi & Ghi log
- **Global Exception Handler:** Bắt buộc sử dụng cơ chế xử lý lỗi tập trung (Ví dụ: `@ControllerAdvice` trong Spring Boot hoặc Middleware error handler trong Node/Express). Trả về chuẩn format JSON thống nhất cho mọi lỗi.
- **Logging có ý nghĩa:** Ghi log ở các điểm quan trọng (bắt đầu nghiệp vụ lớn, lỗi hệ thống, giao tiếp bên ngoài). Luôn kèm theo Context (User ID, Request ID). **KHÔNG** log thông tin nhạy cảm (Mật khẩu, Token, thẻ tín dụng).
- **KHÔNG nuốt lỗi (Swallow exceptions):** Block `catch` luôn phải ghi log hoặc ném tiếp exception có ý nghĩa. Không để block `catch` rỗng.

## 4. Security & Database Optimization — Bảo mật & Tối ưu DB
- **Luôn Validate Input:** Kiểm tra chặt chẽ dữ liệu từ phía client gửi lên trước khi xử lý (dùng Validation annotations/libraries).
- **Chống SQL Injection:** Luôn dùng Prepared Statements / ORM binding. Tuyệt đối không cộng chuỗi SQL trực tiếp.
- **Tối ưu truy vấn:** Tránh lỗi N+1 Query (dùng JOIN / Fetch Join hợp lý). Đánh chỉ mục (Index) cho các trường thường xuyên `WHERE` hoặc `ORDER BY`.
