# Architecture Decisions & System Design

> Lưu trữ các quyết định về kiến trúc hệ thống, giải pháp kỹ thuật và lý do lựa chọn (Trade-offs).
> AI sẽ tự động append nội dung vào đây sau các session làm việc.

---


### [Hạ tầng Docker] Kiến trúc 6 Container & Khởi động tuần tự bằng Healthcheck
- **Ngày**: 2026-10-22
- **Task**: Xây dựng môi trường Docker hoàn chỉnh cho hệ thống SpeakUp
- **Chi tiết**:
  Hệ thống SpeakUp chạy trên Docker Compose gồm 6 services: Nginx (cổng 80 - Gateway duy nhất), Angular (cổng 4200), NestJS (cổng 3000), PostgreSQL (5432), Redis (6379), RabbitMQ (5672/15672).
  Để triệt tiêu lỗi NestJS khởi động khi DB hoặc Message Queue chưa kịp sẵn sàng, cấu hình `depends_on` bắt buộc dùng `condition: service_healthy` với healthcheck tương ứng (`pg_isready`, `redis-cli ping`, `rabbitmq-diagnostics ping`). Toàn bộ 6 service kết nối chung qua Bridge Network `speakup_network`.
- **Files liên quan**: `docker-compose.yml`, `docker/nginx/default.conf`, `.env.example`
