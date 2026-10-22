# Git Workflow & Commit Rules

> **LUẬT KHÔNG THỂ THƯƠNG LƯỢNG.** Áp dụng cho mọi tương tác liên quan đến Git trong dự án SpeakUp.

## 1. Quyền Thực Thi Commit & Merge (Strict Permission)
- **TUYỆT ĐỐI KHÔNG tự ý commit code**: AI chỉ được thực hiện lệnh `git commit` khi người dùng yêu cầu rõ ràng (ví dụ: *"hãy commit code giúp tôi"*).
- Không tự ý merge nhánh tính năng vào nhánh chính (`master` / `main`) nếu chưa có xác nhận từ người dùng.

## 2. Mô hình Phân Nhánh (GitHub Flow)
- Nhánh chính (`master` / `main`) luôn ở trạng thái **Production-Ready & Deployable**. Tất cả 6 containers Docker Compose phải chạy ổn định trên nhánh này.
- Mọi công việc mới (Feature, Bugfix, Refactor, Docs) BẮT BUỘC tạo nhánh tính năng ngắn hạn (Short-lived feature branch).
- Quy tắc đặt tên nhánh:
  - `feature/<scope>-<description>`: Tính năng mới (`feature/web-article-player`, `feature/api-jwt-auth`)
  - `fix/<scope>-<description>`: Sửa lỗi (`fix/api-nginx-502`, `fix/db-seed-role`)
  - `refactor/<scope>-<description>`: Tối ưu code (`refactor/api-typeorm-repositories`)
  - `docs/<description>`: Cập nhật tài liệu (`docs/git-strategy`, `docs/database-erd`)
  - `infra/<description>`: Hạ tầng Docker, mạng, proxy (`infra/docker-compose-redis`)

## 3. Quy Chuẩn Thông Điệp Commit (Conventional Commits 1.0.0)
- Định dạng: `<type>(<scope>): <mô tả ngắn>`
- **Type hợp lệ:** `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`.
- **Scope hợp lệ (Monorepo):**
  - `api`: Backend NestJS (`apps/api`)
  - `web`: Frontend Angular (`apps/web`)
  - `infra`: Docker, Nginx, Compose, Network
  - `db`: TypeORM entities, seeds, migrations, postgres
  - `core`: Toàn bộ dự án hoặc dùng chung
- Ví dụ:
  - `feat(api): implement courses and lessons rest endpoints`
  - `feat(web): build audio player for effortless english stories`
  - `chore(infra): add *.tsbuildinfo to gitignore`

## 4. Vệ Sinh Mã Nguồn (Git Hygiene)
- Luôn chạy `git status` trước khi stage và commit.
- TUYỆT ĐỐI KHÔNG commit secrets (`.env`), file tạm / cache (`*.tsbuildinfo`, `.angular/`, `dist/`), dữ liệu DB (`postgres_data/`).
- Khi merge vào nhánh chính, ưu tiên **Squash and Merge** để giữ lịch sử Git dạng đường thẳng (Linear History).
