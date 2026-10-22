# 🌳 SpeakUp Git Strategy & Workflow Guide

> **Mục tiêu:** Thiết lập quy chuẩn phân nhánh, cách đặt tên, quy tắc commit và quy trình làm việc chuẩn hóa cho dự án **SpeakUp Monorepo**. Đảm bảo lịch sử Git luôn sạch (linear history), dễ tra cứu và chuyên nghiệp theo chuẩn Enterprise.

---

## 📌 1. Triết lý & Luật Bất Khả Xâm Phạm (Core Rules)

1. **Nhánh chính (`master` / `main`) là chén thánh:**
   - Luôn luôn ở trạng thái **chạy được ngay (Deployable & Production-Ready)**.
   - Toàn bộ các dịch vụ Docker Compose (Nginx, API, Web, Postgres, Redis, RabbitMQ) phải vượt qua healthcheck trước khi code được merge vào nhánh chính.
   - **Tuyệt đối không push code lỗi, code chưa hoàn thiện hoặc code làm gãy build lên nhánh chính.**

2. **Quy tắc AI Pair Programming (Strict Git Rule):**
   - AI **tuyệt đối không được tự ý commit code**.
   - Mọi thao tác `git commit` hoặc `git merge` chỉ được thực hiện khi người dùng (USER) trực tiếp ra lệnh hoặc xác nhận rõ ràng.

3. **Lịch sử tuyến tính (Linear & Clean History):**
   - Không để lại các commit rác ("fix typo", "test", "update", "wip").
   - Ưu tiên sử dụng **Squash and Merge** hoặc **Rebase** khi đưa nhánh tính năng vào nhánh chính để cây Git luôn là một đường thẳng gọn gàng.

---

## 🌿 2. Mô hình phân nhánh (Branching Strategy: GitHub Flow)

Dự án áp dụng mô hình **GitHub Flow** (Trunk-Based tinh gọn), tập trung vào các nhánh tính năng có vòng đời ngắn (short-lived feature branches):

```mermaid
gitGraph
   commit id: "e069903 Initial"
   commit id: "c683ce3 TypeORM & Seed"
   branch feature/web-lesson-layout
   checkout feature/web-lesson-layout
   commit id: "feat(web): add lesson sidebar"
   commit id: "feat(web): add article viewer"
   checkout master
   merge feature/web-lesson-layout id: "Squash: Lesson Layout"
   branch feature/api-jwt-auth
   checkout feature/api-jwt-auth
   commit id: "feat(api): implement jwt auth"
   checkout master
   merge feature/api-jwt-auth id: "Squash: JWT Auth"
```

### 2.1. Cấu trúc tên nhánh (Branch Naming Convention)

Mọi nhánh đều phải tuân theo cấu trúc chuẩn:
```
<type>/<scope>-<kebab-case-description>
```

| Tiền tố (`type`) | Ý nghĩa & Khi nào dùng | Ví dụ cụ thể cho SpeakUp |
|---|---|---|
| `feature/` | Phát triển tính năng mới | `feature/web-article-player`<br>`feature/api-user-auth` |
| `fix/` | Sửa lỗi / bug trong hệ thống | `fix/api-nginx-502-upstream`<br>`fix/web-audio-scrubber` |
| `refactor/` | Tối ưu hoặc dọn dẹp mã nguồn (không đổi logic) | `refactor/api-typeorm-repositories`<br>`refactor/web-shared-components` |
| `docs/` | Viết, cập nhật tài liệu hoặc kế hoạch | `docs/database-erd-update`<br>`docs/git-strategy` |
| `infra/` | Cấu hình Docker, Nginx, CI/CD, biến môi trường | `infra/docker-compose-rabbitmq`<br>`infra/nginx-ssl-config` |
| `perf/` | Tối ưu hóa hiệu năng (caching, query) | `perf/api-redis-course-cache` |

### 2.2. Danh sách Scope chuẩn cho Monorepo:
- `api`: Dịch vụ Backend NestJS (`apps/api`)
- `web`: Ứng dụng Frontend Angular (`apps/web`)
- `infra`: Hạ tầng Docker, Reverse Proxy Nginx, mạng nội bộ (`docker/`, `docker-compose.yml`)
- `db`: Database Schema, TypeORM Entities, Seed Data, Migrations
- `core`: Thay đổi dùng chung hoặc ảnh hưởng toàn bộ dự án

---

## ✍️ 3. Quy chuẩn thông điệp Commit (Conventional Commits 1.0.0)

Mỗi commit phải giải thích rõ ràng **hành động làm gì và ở phạm vi nào**:

### 3.1. Cấu trúc commit

```text
<type>(<scope>): <mô tả ngắn gọn bằng mệnh đề hành động>

[Tùy chọn: Thân commit (Body) giải thích lý do "Tại sao" thực hiện thay đổi]

[Tùy chọn: Chân commit (Footer) ghi chú issue hoặc breaking changes]
```

### 3.2. Bảng các loại `type`:
- `feat`: Tính năng mới cho người dùng hoặc API mới.
- `fix`: Sửa lỗi phát sinh trong ứng dụng.
- `docs`: Cập nhật tài liệu kỹ thuật, README, plans.
- `refactor`: Tái cấu trúc code (không fix bug, không thêm feat).
- `perf`: Cải thiện tốc độ thực thi, giảm dung lượng bộ nhớ.
- `test`: Thêm hoặc sửa đổi unit/e2e test.
- `chore`: Chỉnh sửa cấu hình build, dependency package, `.gitignore`.

### 3.3. Ví dụ commit mẫu chuẩn mực:

**Commit 1 dòng gọn gàng:**
```text
feat(api): add REST endpoints for course and lesson details
```

**Commit đầy đủ chi tiết:**
```text
feat(api): integrate TypeORM and seed Effortless English data

- Replace Prisma with TypeORM for robust proxy/offline compatibility
- Create 7 TypeORM entities matching database ERD schema
- Add seed script for Power English course, A Kiss lesson, and audios
- Configure HttpExceptionFilter for standardized JSON error handling
```

---

## 🔄 4. Quy trình làm việc từng bước (Daily Workflow)

### Bước 1: Đồng bộ nhánh chính trước khi bắt đầu công việc
Luôn bắt đầu từ một trạng thái sạch và mới nhất của `master`:
```bash
git checkout master
git pull origin master
git status
```

### Bước 2: Tạo nhánh tính năng mới
```bash
# Ví dụ: làm giao diện bài đọc trên web
git checkout -b feature/web-article-viewer
```

### Bước 3: Lập trình và kiểm thử trong Docker
- Chạy và kiểm tra trong container:
  ```bash
  docker compose ps
  # Test API hoặc xem giao diện trên http://localhost:8080
  ```

### Bước 4: Review lại các file đã chỉnh sửa
Trước khi commit, luôn chạy lệnh kiểm tra:
```bash
git status -s
git diff
```
*Đảm bảo không vô tình commit file `.env`, file cache `*.tsbuildinfo`, file log hoặc dữ liệu tạm.*

### Bước 5: Thêm file và commit (chỉ khi có yêu cầu)
```bash
git add .
git commit -m "feat(web): implement article reader with vocabulary highlight"
```

### Bước 6: Hợp nhất vào nhánh chính (Merge Strategy)
Dự án ưu tiên cách **Squash and Merge** (Gom các commit con thành 1 commit duy nhất, rõ ràng):
```bash
# 1. Trở về nhánh chính
git checkout master

# 2. Hợp nhất nhánh tính năng dưới dạng squash
git merge --squash feature/web-article-viewer

# 3. Tạo commit đại diện duy nhất trên master
git commit -m "feat(web): add article reader component with interactive vocabulary lookup"

# 4. Xóa nhánh tính năng đã hoàn thành để giữ repo sạch sẽ
git branch -D feature/web-article-viewer
```

---

## 🛡️ 5. Vệ sinh mã nguồn & Bảo mật (Git Hygiene)

| Điều NÊN làm (DOs) | Điều TUYỆT ĐỐI TRÁNH (DON'Ts) |
|---|---|
| ✅ Kiểm tra `git status` trước mọi lần commit. | ❌ Không commit file chứa mật khẩu (`.env`, private keys). |
| ✅ Viết commit message bằng tiếng Anh ngắn gọn, rõ ràng theo Conventional Commits. | ❌ Không dùng commit message vô nghĩa: `fix`, `asdasd`, `done`, `update code`. |
| ✅ Đảm bảo mã nguồn biên dịch thành công (`npm run build`) và pass test trước khi merge. | ❌ Không commit thư mục rác: `node_modules/`, `dist/`, `.angular/`, `postgres_data/`. |
| ✅ Xóa các nhánh tính năng local sau khi đã merge thành công vào `master`. | ❌ Không merge code đang dở dang (WIP) hoặc gây crash server vào nhánh chính. |

---

## 🆘 6. Xử lý các tình huống thường gặp (Cheat Sheet)

### Trường hợp 1: Muốn sửa lại thông điệp commit vừa tạo gần nhất
```bash
git commit --amend -m "feat(api): sửa lại thông điệp cho đúng chuẩn"
```

### Trường hợp 2: Lỡ thêm một file không mong muốn vào staging (`git add`)
```bash
# Bỏ file ra khỏi staging mà không làm mất nội dung trên đĩa
git restore --staged <tên_file>
```

### Trường hợp 3: Muốn hủy toàn bộ các thay đổi chưa commit để quay về commit cũ nhất
```bash
git restore .
git clean -fd
```

### Trường hợp 4: Nhánh `master` đã có commit mới trong lúc đang làm việc trên `feature/*`
Cập nhật nhánh tính năng bằng cách rebase lên đầu `master`:
```bash
git checkout feature/ten-nhanh
git rebase master
# Nếu có conflict, giải quyết conflict rồi gõ: git rebase --continue
```

---

*Tài liệu này là quy chuẩn chính thức cho toàn bộ thành viên và AI trong dự án **SpeakUp**.*
