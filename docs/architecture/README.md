# 📐 System Architecture Documentation (`docs/architecture/`)

Tài liệu thiết kế kiến trúc hệ thống, sơ đồ luồng dữ liệu và hạ tầng của dự án **SpeakUp**.

---

## 🎯 Mục đích
- Làm chuẩn thiết kế kiến trúc trực quan (Visual Single Source of Truth) cho toàn bộ dự án.
- Giúp Lập trình viên và AI Agent luôn có chung bức tranh tổng thể khi mở rộng tính năng mới.
- Toàn bộ sơ đồ được viết bằng **Mermaid.js** để dễ dàng chỉnh sửa, quản lý phiên bản qua Git và hiển thị trực quan ngay trong trình soạn thảo Markdown.

---

## 📂 Danh mục tài liệu kiến trúc

| STT | Tài liệu | Mô tả |
| :---: | :--- | :--- |
| **01** | [`01-docker-infrastructure.md`](./01-docker-infrastructure.md) | Kiến trúc hạ tầng Docker Compose, Network, Port mapping & Persistent Volumes |
| **02** | [`02-tech-stack-roles.md`](./02-tech-stack-roles.md) | Cẩm nang giải thích vai trò, chức năng và bài toán thực tế của từng công nghệ (Nginx, RabbitMQ, Redis, Postgres...) |
| **03** | [`03-database-erd.md`](./03-database-erd.md) | Sơ đồ quan hệ thực thể cơ sở dữ liệu PostgreSQL (ERD) theo phương pháp Effortless English |
| **04** | `04-nginx-routing.md` | *(Kế hoạch)* Cấu hình Reverse Proxy, SSL termination, CORS và chuyển tiếp routing |
| **05** | `05-async-event-flow.md` | *(Kế hoạch)* Luồng xử lý bất đồng bộ qua RabbitMQ Exchange/Queue và Redis Cache |

---

## 🛠️ Công cụ & Quy chuẩn vẽ sơ đồ
- **Engine:** Mermaid.js (`flowchart TD`, `sequenceDiagram`, `erDiagram`).
- **Quy tắc cập nhật:** Bất kỳ thay đổi nào liên quan đến cổng (port), service mới, hoặc luồng dữ liệu đều phải được cập nhật đồng bộ vào thư mục này.
