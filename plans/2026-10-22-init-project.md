# 📋 Kế Hoạch Ngày: 2026-10-22 - Khởi Tạo & Brainstorming Ứng Dụng SpeakUp

> **Trạng thái:** 🟡 Đang thực hiện (In Progress)  
> **Người thực hiện:** Dev + AI Agent  
> **Workflow áp dụng:** `.agent/workflows/plan.md` (Pha 1: Brainstorming)

---

## 🎯 1. Mục tiêu trong ngày (Goals)
- [x] Khởi tạo thư mục quản lý công việc `plans/` kèm hướng dẫn và template.
- [x] **Pha 1: Brainstorming** — Hoàn thành thống nhất kiến trúc, sơ đồ hạ tầng, vai trò công nghệ và chốt thiết kế (Gate 1 Passed).
- [/] **Pha 2: Execute** — Triển khai cấu hình Docker Compose, Nginx, Database init, biến môi trường và cấu trúc thư mục Monorepo cho SpeakUp.
- [ ] **Pha 3: Save Learnings** — Ghi nhận các bài học và quyết định kiến trúc vào `.agent/learnings/`.

---

## 🛠️ 2. Checklist chi tiết (Tasks)

### Nhóm 1: Khởi tạo quy chuẩn quản lý & Tài liệu
- [x] Tạo `plans/README.md`
- [x] Tạo `plans/template.md`
- [x] Tạo file kế hoạch ngày đầu tiên `plans/2026-10-22-init-project.md`
- [x] Tạo `.gitignore` chuẩn Enterprise đa nền tảng
- [x] Tạo sơ đồ kiến trúc hạ tầng `docs/architecture/01-docker-infrastructure.md`
- [x] Tạo cẩm nang vai trò công nghệ `docs/architecture/02-tech-stack-roles.md`
- [x] Thực hiện commit đầu tiên (Initial commit: `e069903`)

### Nhóm 2: Pha 2 - Thực thi xây dựng Môi trường Docker (Execute)
- [x] **Task 2.1:** Tạo `.env.example` và `.env` chuẩn hóa toàn bộ tham số môi trường
- [x] **Task 2.2:** Tạo cấu hình Nginx Reverse Proxy (`docker/nginx/Dockerfile`, `docker/nginx/default.conf`)
- [x] **Task 2.3:** Tạo script khởi tạo Database PostgreSQL (`docker/postgres/init.sql`)
- [x] **Task 2.4:** Tạo khung khởi đầu và Dockerfile cho `apps/api` (NestJS) và `apps/web` (Angular)
- [x] **Task 2.5:** Viết file `docker-compose.yml` hoàn chỉnh (6 services, healthchecks, volumes, network)
- [x] **Task 2.6:** Verify cú pháp và cấu hình bằng lệnh `docker compose config` (Clean 100%, 0 warning)

---

## 📝 3. Quyết định kỹ thuật & Ghi chú (Notes & Decisions)
- **Mục tiêu của dự án:** Dự án phục vụ mục tiêu kép (Dual-purpose):
  1. Giúp người dùng thực hành học tiếng Anh hàng ngày hiệu quả.
  2. Nền tảng thực chiến để học hỏi công nghệ mới qua phong cách Vibe Coding có kỷ luật.
- **Tài liệu học tập:** Đã biên soạn cẩm nang chi tiết vai trò của 6 công nghệ (Nginx, RabbitMQ, Redis, Postgres, NestJS, Angular) tại `docs/architecture/02-tech-stack-roles.md`.

---

## ⏭️ 4. Tồn đọng cho buổi tiếp theo (Next Steps / Backlog)
- [ ] Khởi tạo source code dự án theo Tech stack đã thống nhất ở Pha 1.
