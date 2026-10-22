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
