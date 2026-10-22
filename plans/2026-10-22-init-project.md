# 📋 Kế Hoạch Ngày: 2026-10-22 - Khởi Tạo & Brainstorming Ứng Dụng SpeakUp

> **Trạng thái:** 🟡 Đang thực hiện (In Progress)  
> **Người thực hiện:** Dev + AI Agent  
> **Workflow áp dụng:** `.agent/workflows/plan.md` (Pha 1: Brainstorming)

---

## 🎯 1. Mục tiêu trong ngày (Goals)
- [x] Khởi tạo thư mục quản lý công việc `plans/` kèm hướng dẫn và template.
- [/] **Pha 1: Brainstorming** — Lập kế hoạch chi tiết xây dựng môi trường Docker hoàn chỉnh cho hệ thống SpeakUp:
  - Frontend: Angular
  - Backend: NestJS
  - Database: PostgreSQL
  - Cache: Redis
  - Message Queue: RabbitMQ
  - Reverse Proxy: Nginx
- [ ] Chốt **Understanding Lock** & Kiến trúc Docker Compose.
- [ ] Lập Task Checklist triển khai (Pha 2: Execute).

---

## 🛠️ 2. Checklist chi tiết (Tasks)

### Nhóm 1: Khởi tạo quy chuẩn quản lý
- [x] Tạo `plans/README.md`
- [x] Tạo `plans/template.md`
- [x] Tạo file kế hoạch ngày đầu tiên `plans/2026-10-22-init-project.md`
- [x] Tạo `.gitignore` chuẩn Enterprise đa nền tảng
- [x] Thực hiện commit đầu tiên (Initial commit) lưu trữ bộ khung quản lý và kiến trúc

### Nhóm 2: Pha 1 - Brainstorming Môi trường Docker
- [x] Xác định công nghệ: Angular, NestJS, Postgres, Redis, RabbitMQ, Nginx, Docker.
- [x] Tạo thư mục kiến trúc `docs/architecture/` và vẽ sơ đồ hạ tầng Docker bằng Mermaid.
- [x] Khóa hiểu biết (Understanding Lock) cho kế hoạch Docker Environment.
- [/] **Bước 1.2:** Đề xuất cấu trúc thư mục Docker và các service trong `docker-compose.yml`.
- [ ] **Bước 1.3:** Chốt thiết kế môi trường Docker với người dùng (Gate 1).

---

## 📝 3. Quyết định kỹ thuật & Ghi chú (Notes & Decisions)
- **Mục tiêu của dự án:** Dự án phục vụ mục tiêu kép (Dual-purpose):
  1. Giúp người dùng thực hành học tiếng Anh hàng ngày hiệu quả.
  2. Nền tảng thực chiến để học hỏi công nghệ mới qua phong cách Vibe Coding có kỷ luật.
- **Tài liệu học tập:** Đã biên soạn cẩm nang chi tiết vai trò của 6 công nghệ (Nginx, RabbitMQ, Redis, Postgres, NestJS, Angular) tại `docs/architecture/02-tech-stack-roles.md`.

---

## ⏭️ 4. Tồn đọng cho buổi tiếp theo (Next Steps / Backlog)
- [ ] Khởi tạo source code dự án theo Tech stack đã thống nhất ở Pha 1.
