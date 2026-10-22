# Documentation & Sync Rule (Docs-as-Code)

> **LUẬT KHÔNG THỂ THƯƠNG LƯỢNG.** Mọi tính năng mới hoặc thay đổi kiến trúc/API phải đi kèm việc cập nhật tài liệu tương ứng trong thư mục `docs/`.

## 1. Đồng bộ Tài liệu & Code (Documentation Sync)
- **Khi THÊM tính năng mới:**
  - BẮT BUỘC tạo hoặc cập nhật file mô tả luồng nghiệp vụ tương ứng trong `docs/03-features/<feature-name>.md`.
  - Nếu có thay đổi API, phải cập nhật `docs/02-api/`.
  - Nếu có thay đổi Cơ sở dữ liệu (Entity/Schema), phải cập nhật `docs/01-architecture/database-schema.md`.

- **Khi SỬA ĐỔI tính năng hiện có:**
  - BẮT BUỘC kiểm tra và cập nhật file tài liệu liên quan trong `docs/` để phản ánh chính xác hành vi mới của hệ thống.
  - TUYỆT ĐỐI KHÔNG để xảy ra tình trạng Code một đằng, Docs một nẻo (Outdated docs).

## 2. Tiêu chuẩn viết Tài liệu (Docs Standard)
- Tài liệu phải được viết bằng định dạng **Markdown (`.md`)**.
- Ưu tiên sử dụng biểu đồ dạng **Mermaid.js** để vẽ Sequence Diagram, Flowchart, hoặc ERD cho trực quan.
- Cấu trúc file tài liệu tính năng nên gồm:
  1. **Mục đích (Purpose):** Tính năng giải quyết vấn đề gì.
  2. **Luồng hoạt động (Sequence / Flow):** Các bước từ UI -> API -> DB -> External Service.
  3. **Chi tiết API / Data Model:** Endpoint, DTOs, bảng DB liên quan.
  4. **Lưu ý nghiệp vụ (Business Edge Cases):** Các trường hợp đặc biệt, xử lý lỗi.

## 3. Phân biệt `docs/` và `.agent/learnings/`
- `docs/`: Chứa tài liệu thiết kế chính thức của dự án cho con người & AI tra cứu.
- `.agent/learnings/`: Chứa ghi chép bài học, kinh nghiệm debug, context nội bộ của AI Agent.
