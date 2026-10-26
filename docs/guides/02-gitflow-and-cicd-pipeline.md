# 🚀 [DevOps Guide] Quy Chuẩn GitFlow & Hệ Thống Tự Động Hóa CI/CD (GitHub Actions)

> **Mục tiêu:** Hướng dẫn toàn diện về quy chuẩn phân nhánh mã nguồn (GitFlow) và thiết lập đường ống tích hợp/triển khai tự động (CI/CD Pipeline) bằng **GitHub Actions** cho dự án **SpeakUp Monorepo**.

---

## 🌿 1. Mô Hình Phân Nhánh GitFlow Chuẩn Hóa

Dự án SpeakUp áp dụng mô hình **GitFlow Tinh Gọn (Trunk-Based cải tiến)** để vừa đảm bảo tính linh hoạt khi phát triển tính năng, vừa giữ cho nhánh chính luôn an toàn 100%:

```mermaid
gitGraph
   commit id: "Initial"
   branch develop
   checkout develop
   commit id: "Setup Infra"
   branch feature/web-learning-workspace
   checkout feature/web-learning-workspace
   commit id: "feat(web): audio player"
   commit id: "feat(web): vocab modal"
   checkout develop
   merge feature/web-learning-workspace id: "PR: Merge Workspace"
   checkout master
   merge develop id: "Release v1.0.0" tag: "v1.0.0"
   branch hotfix/audio-streaming
   checkout hotfix/audio-streaming
   commit id: "fix(api): range header"
   checkout master
   merge hotfix/audio-streaming id: "Hotfix v1.0.1" tag: "v1.0.1"
   checkout develop
   merge hotfix/audio-streaming id: "Sync Hotfix"
```

### 1.1. Chi Tiết Vai Trò Của Từng Nhánh

| Tên Nhánh | Nhánh Xuất Phát (From) | Nhánh Đích (Merge To) | Vòng Đời | Mục Đích & Quy Tắc |
| :--- | :---: | :---: | :---: | :--- |
| **`master`** | Gốc (Root) | — | Vĩnh viễn | **Môi trường Production (Sản phẩm chạy thật)**.<br>• Luôn luôn chạy được ngay (Deployable).<br>• Không bao giờ commit code dở dang.<br>• Gắn tag phiên bản: `v1.0.0`, `v1.1.0`. |
| **`develop`** | `master` | `master` | Vĩnh viễn | **Môi trường Tích hợp (Staging / Development)**.<br>• Nơi hội tụ các tính năng mới trước khi release.<br>• Chạy kiểm thử tự động toàn diện qua GitHub CI. |
| **`feature/*`** | `develop` | `develop` | Tạm thời (Xóa sau khi merge) | **Phát triển tính năng mới**.<br>• Quy tắc đặt tên: `feature/<scope>-<kebab-case>`.<br>• Ví dụ: `feature/web-learning-workspace`, `feature/api-srs-spaced-repetition`. |
| **`hotfix/*`** | `master` | `master` & `develop` | Tạm thời (Xóa sau khi merge) | **Vá lỗi khẩn cấp trên Production**.<br>• Dùng khi phát hiện lỗi nghiêm trọng trên production cần xử lý ngay mà không chờ chu kỳ phát hành mới. |

---

## ⚙️ 2. Kiến Trúc Đường Ống CI/CD (GitHub Actions Pipeline)

Đường ống CI/CD của SpeakUp được thiết kế tối ưu cho mô hình **Monorepo** để tiết kiệm tài nguyên và tăng tốc độ phản hồi:

```mermaid
flowchart TD
    A["Developer Push Code / Mở Pull Request"] --> B{"Bộ Lọc Thư Mục (Path Filter)"}
    
    B -->|"Thay đổi apps/api/**"| C["Job: CI Backend NestJS"]
    B -->|"Thay đổi apps/web/**"| D["Job: CI Frontend Angular"]
    B -->|"Chỉ thay đổi docs/** hoặc README"| E["Bỏ qua CI (Tiết kiệm Quota)"]
    
    subgraph "CI Quality Gate"
        C --> C1["Setup Node 20 + Cache npm"]
        C1 --> C2["npm ci --silent"]
        C2 --> C3["nest build (Kiểm tra biên dịch & TypeORM)"]
        
        D --> D1["Setup Node 20 + Cache npm"]
        D1 --> D2["npm ci --silent"]
        D2 --> D3["ng lint (Kiểm tra chuẩn ESLint & Clean Code)"]
        D3 --> D4["ng build --configuration production (Kiểm tra SCSS budget, Types, AOT)"]
    end
    
    C3 & D4 --> F{"Tất Cả Jobs Pass?"}
    F -->|"Thất bại ❌"| G["Chặn Merge PR + Báo lỗi qua GitHub"]
    F -->|"Thành công ✅"| H["Cho phép Merge vào develop / master"]
    
    H --> I{"Sự Kiện Merge vào 'master'?"}
    I -->|"Đúng (Production Release)"| J["Job CD: Build Docker Images & Deploy VPS"]
    I -->|"Sai (Chỉ là develop)"| K["Hoàn tất CI Staging"]
```

---

## 🛠️ 3. Cấu Hình Workflow Thực Tế

### File: `.github/workflows/ci.yml`
File này tự động chạy song song (Parallel execution) để kiểm tra chất lượng code:
- **Cache dependencies:** Lưu trữ `~/.npm` giữa các lần chạy, rút ngắn thời gian cài đặt từ 2 phút xuống dưới **15 giây**.
- **Monorepo Path Filter:** Tránh lãng phí thời gian build frontend khi chỉ sửa backend và ngược lại.
- **Fail-fast:** Lập tức phát hiện các lỗi biên dịch TypeScript, vi phạm budget dung lượng CSS/bundle hoặc thiếu thư viện.

---

## 🔒 4. Hướng Dẫn Cấu Hình Secrets Trên GitHub Cho Giai Đoạn CD (Triển Khai)

Khi triển khai hệ thống lên máy chủ VPS (Ubuntu/Debian), các thông tin nhạy cảm bắt buộc phải lưu trong **GitHub Repository Secrets** (Vào *Settings* ➔ *Secrets and variables* ➔ *Actions*):

| Tên Secret | Ý Nghĩa | Ví Dụ |
| :--- | :--- | :--- |
| `SERVER_HOST` | Địa chỉ IP của máy chủ VPS | `103.153.xx.xx` |
| `SERVER_USER` | Tên người dùng SSH trên máy chủ | `ubuntu` hoặc `root` |
| `SERVER_SSH_KEY` | Khóa bảo mật Private Key để kết nối SSH | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `SERVER_PORT` | Cổng SSH | `22` |
| `PRODUCTION_ENV` | Toàn bộ nội dung file `.env` production | `POSTGRES_PASSWORD=...`, `JWT_SECRET=...` |

### Lệnh Tự Động Cập Nhật Trên Máy Chủ (Deploy Command):
```bash
cd /opt/speak-up
git pull origin master
docker compose -f docker-compose.yml up -d --build --remove-orphans
```

---

## 🛡️ 5. Quy Chuẩn Đánh Giá Pull Request (PR Review Checklist)

Trước khi ấn nút **Merge Pull Request** vào `develop` hoặc `master`, bắt buộc người duyệt PR phải kiểm tra các tiêu chí sau:
- [ ] Pipeline GitHub Actions báo tích xanh **Passed** 100% (Backend build, Frontend lint & build).
- [ ] Frontend vượt qua kiểm tra `npm run lint` (`@angular-eslint`) không có error.
- [ ] Tuân thủ [General Clean Code Rule](file:///d:/MY_PROJECT/speak-up/.agent/rules/general-coding-rules.md) (Không hardcode magic strings, chia nhỏ component < 50 dòng/hàm).
- [ ] Tuân thủ [Backend API Backbone Rule](file:///d:/MY_PROJECT/speak-up/.agent/rules/backend-api-rules.md) (3-Tier, DTO có validation, không truy vấn DB ở controller).
- [ ] Tuân thủ [Mobile App & Web Backbone Rules](file:///d:/MY_PROJECT/speak-up/.agent/rules/mobile-app-rules.md) (Touch target >= 44px, đủ 3 trạng thái Loading/Error/Empty).
- [ ] Thông điệp commit viết theo chuẩn **Conventional Commits** (`feat(...)`, `fix(...)`, `docs(...)`).
