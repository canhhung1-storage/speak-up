# Coding Patterns & Conventions

> Lưu trữ các mẫu code (patterns), quy chuẩn viết code và cách dùng thư viện/API chuẩn trong dự án này.
> AI sẽ tự động append nội dung vào đây sau các session làm việc.

---


### [Docker Network] Quy chuẩn giao tiếp giữa các Container qua Service Name
- **Ngày**: 2026-10-22
- **Task**: Xây dựng môi trường Docker hoàn chỉnh cho hệ thống SpeakUp
- **Chi tiết**:
  Trong cùng mạng nội bộ Docker (`speakup_network`), các service gọi nhau bằng Tên Service (DNS nội bộ do Docker phân giải), TUYỆT ĐỐI KHÔNG dùng `localhost` hoặc `127.0.0.1` bên trong code chạy trong container.
  - NestJS kết nối DB: `postgres:5432` (user/pass từ env).
  - NestJS kết nối Redis: `redis:6379` (kèm password).
  - NestJS kết nối RabbitMQ: `rabbitmq:5672`.
  - Nginx chuyển tiếp reverse proxy: `http://api:3000` cho `/api/` và `http://web:4200` cho `/`.
- **Files liên quan**: `docker-compose.yml`, `docker/nginx/default.conf`, `.env`
