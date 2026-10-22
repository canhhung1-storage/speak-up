# 📖 Cẩm Nang Toàn Tập: Khởi Động & Vận Hành Dự Án SpeakUp

> **Mục tiêu:** Tài liệu cầm tay chỉ việc từ A-Z dành cho lập trình viên để khởi động, kiểm tra, thao tác và xử lý mọi sự cố khi chạy hệ thống **SpeakUp** trên môi trường Docker.

---

## 📋 MỤC LỤC
1. [Yêu cầu môi trường tiên quyết](#1-yêu-cầu-môi-trường-tiên-quyết)
2. [Quy trình 3 bước khởi động dự án](#2-quy-trình-3-bước-khởi-động-dự-án)
3. [Xác thực & Trải nghiệm từng dịch vụ](#3-xác-thực--trải-nghiệm-từng-dịch-vụ)
4. [Bộ lệnh Docker bỏ túi dùng hàng ngày (Cheat Sheet)](#4-bộ-lệnh-docker-bỏ-túi-dùng-hàng-ngày-cheat-sheet)
5. [Cẩm nang xử lý sự cố thường gặp (Troubleshooting)](#5-cẩm-nang-xử-lý-sự-cố-thường-gặp-troubleshooting)
6. [Tắt và Dọn dẹp môi trường](#6-tắt-và-dọn-dẹp-môi-trường)

---

## 1. Yêu cầu môi trường tiên quyết

Trước khi bắt đầu, máy tính của bạn cần đảm bảo các điều kiện sau:

1. **Docker Desktop** đã được cài đặt và đang chạy (Icon cá voi ở thanh Taskbar góc dưới bên phải hiện màu xanh lá hoặc trạng thái *Engine running*).
2. Kiểm tra nhanh bằng cách mở Terminal / PowerShell và gõ 2 lệnh sau:
   ```bash
   docker --version
   docker compose version
   ```
   *Nếu hiển thị thông tin phiên bản (ví dụ: Docker version 24.x+, Docker Compose version v2.x+) là môi trường đã hoàn toàn sẵn sàng!*

---

## 2. Quy trình 3 bước khởi động dự án

### 🔹 Bước 1: Chuẩn bị file biến môi trường
Nếu bạn vừa clone dự án về máy mới, hãy copy file `.env.example` thành file `.env`:

- **Trên Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```
- **Trên Linux / macOS / Git Bash:**
  ```bash
  cp .env.example .env
  ```
*(File `.env` chứa toàn bộ mật khẩu, cổng kết nối. Bạn có thể mở ra xem hoặc giữ nguyên các giá trị mặc định đã được cấu hình tối ưu).*

---

### 🔹 Bước 2: Build và Khởi động toàn bộ cụm Container
Chạy lệnh duy nhất sau ở thư mục gốc của dự án:

```bash
docker compose up -d --build
```

**Giải thích tham số:**
- `up`: Khởi tạo và khởi động các container được định nghĩa trong `docker-compose.yml`.
- `-d` (*detached mode*): Chạy ngầm dưới nền, giúp giải phóng cửa sổ terminal để bạn tiếp tục gõ lệnh khác.
- `--build`: Tự động build lại Docker image cho `api`, `web`, `nginx` nếu có bất kỳ thay đổi nào trong code.

*Lần chạy đầu tiên sẽ mất khoảng 1-3 phút để Docker tải các image chính thức (Postgres, Redis, RabbitMQ, Nginx, Node) về máy. Từ lần thứ 2 trở đi, hệ thống chỉ mất từ **3 - 5 giây** để bật lên!*

---

### 🔹 Bước 3: Kiểm tra trạng thái các dịch vụ
Gõ lệnh sau để xem danh sách và tình trạng sức khỏe của 6 container:

```bash
docker compose ps
```

**Bảng kết quả chuẩn bạn sẽ thấy:**
```text
NAME                IMAGE                            COMMAND                  SERVICE      STATUS                    PORTS
speakup-api         speakup-api                      "npm run start:dev"      api          Up (healthy)              0.0.0.0:3000->3000/tcp
speakup-nginx       speakup-nginx                    "/docker-entrypoint.…"   nginx        Up                        0.0.0.0:80->80/tcp
speakup-postgres    postgres:16-alpine               "docker-entrypoint.s…"   postgres     Up (healthy)              0.0.0.0:5432->5432/tcp
speakup-rabbitmq    rabbitmq:3.13-management-alpine  "docker-entrypoint.s…"   rabbitmq     Up (healthy)              0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
speakup-redis       redis:7-alpine                   "docker-entrypoint.s…"   redis        Up (healthy)              0.0.0.0:6379->6379/tcp
speakup-web         speakup-web                      "npm run start"          web          Up                        0.0.0.0:4200->4200/tcp
```
> 👉 *Lưu ý trạng thái `Up (healthy)` nghĩa là các tiến trình đã vượt qua bài kiểm tra sức khỏe và sẵn sàng nhận kết nối!*

---

## 3. Xác thực & Trải nghiệm từng dịch vụ

Sau khi các container chạy `Up`, hãy mở trình duyệt web và các công cụ để kiểm tra từng thành phần:

### 1️⃣ Trải nghiệm Giao diện Web (Angular qua Nginx)
- **Địa chỉ:** [http://localhost:8080](http://localhost:8080)
- **Kết quả mong đợi:** Xuất hiện màn hình chào mừng **SpeakUp English App** hiện đại với danh sách 6 dịch vụ đang hoạt động.
- Nginx đã tự động bắt request ở cổng 8080 và chuyển tiếp ngầm tới Angular (`:4200`).

---

### 2️⃣ Kiểm tra Backend API (NestJS qua Nginx)
- **Địa chỉ:** [http://localhost:8080/api/health](http://localhost:8080/api/health)
- **Kết quả mong đợi:** Trả về đoạn JSON thời gian thực:
  ```json
  {
    "service": "SpeakUp Backend API",
    "status": "ONLINE",
    "environment": "development",
    "timestamp": "2026-10-22T...",
    "path": "/api/health",
    "message": "Welcome to SpeakUp API! NestJS container is up and running."
  }
  ```

---

### 3️⃣ Vào Bảng điều khiển Quản trị RabbitMQ
- **Địa chỉ:** [http://localhost:15672](http://localhost:15672)
- **Tài khoản đăng nhập:**
  - **Username:** `speakup_rabbit`
  - **Password:** `rabbit_secret_pass`
- **Trải nghiệm:** Bạn sẽ thấy toàn bộ biểu đồ lưu lượng tin nhắn (Message Rates), các hàng đợi (Queues) và kênh kết nối (Channels).

---

### 4️⃣ Kết nối vào Database PostgreSQL
Bạn có thể dùng công cụ trực quan như **DBeaver**, **TablePlus**, **Navicat** hoặc **PGAdmin**:
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `speakup_db`
- **Username:** `speakup_user`
- **Password:** `speakup_secret_pass`

*Hoặc kiểm tra nhanh trực tiếp bằng dòng lệnh terminal:*
```bash
docker compose exec postgres psql -U speakup_user -d speakup_db -c "SELECT * FROM system_health;"
```
*(Lệnh này sẽ in ra bảng `system_health` với bản ghi `speakup_db | HEALTHY` do script `init.sql` tạo ra).*

---

### 5️⃣ Kiểm tra Redis In-Memory Cache
Chạy lệnh ping thử Redis ngay từ máy của bạn:
```bash
docker compose exec redis redis-cli -a redis_secret_pass ping
```
*Kết quả trả về: `PONG` ➔ Redis hoạt động hoàn hảo!*

---

## 4. Bộ lệnh Docker bỏ túi dùng hàng ngày (Cheat Sheet)

Dưới đây là các câu lệnh bạn sẽ dùng thường xuyên nhất khi phát triển dự án:

| Nhu cầu thao tác | Câu lệnh thực hiện |
| :--- | :--- |
| **Xem log của toàn bộ hệ thống** | `docker compose logs -f` |
| **Xem log riêng của Backend API** | `docker compose logs -f api` |
| **Xem log riêng của Nginx Gateway** | `docker compose logs -f nginx` |
| **Restart một container (ví dụ sau khi sửa config)** | `docker compose restart nginx` |
| **Chui vào Terminal bên trong container API** | `docker compose exec api sh` |
| **Chui vào dòng lệnh psql của Postgres** | `docker compose exec postgres psql -U speakup_user -d speakup_db` |
| **Tạm dừng hệ thống mà không xóa container** | `docker compose stop` |
| **Tiếp tục chạy lại sau khi tạm dừng** | `docker compose start` |
| **Tắt toàn bộ hệ thống** | `docker compose down` |

---

## 5. Cẩm nang xử lý sự cố thường gặp (Troubleshooting)

### ⚠️ Sự cố 1: Bị báo lỗi trùng cổng (Port already in use)
- **Hiện tượng:** Docker báo lỗi kiểu `Bind for 0.0.0.0:5432 failed: port is already allocated` hoặc `port 80 is already in use`.
- **Nguyên nhân:** Máy tính của bạn trước đây đã cài sẵn PostgreSQL chạy nền ở cổng 5432, hoặc một ứng dụng khác (Skype, IIS, Apache) đang chiếm cổng 80.
- **Cách khắc phục cực dễ với SpeakUp:**  
  Bạn **không cần sửa code hay gỡ phần mềm cũ**, chỉ cần mở file `.env` và đổi cổng Host:
  ```env
  # Đổi sang cổng khác bất kỳ còn trống
  NGINX_PORT=8080
  POSTGRES_PORT=5433
  ```
  Sau đó chạy lại: `docker compose up -d`. Bây giờ Web sẽ vào qua `http://localhost:8080`!

---

### ⚠️ Sự cố 2: Lỗi "Docker daemon is not running"
- **Hiện tượng:** Khi gõ lệnh terminal báo `Cannot connect to the Docker daemon`.
- **Cách khắc phục:** Mở Start Menu trên Windows, gõ tìm **Docker Desktop** và bấm mở lên. Chờ khoảng 30 giây để Docker khởi động xong rồi chạy lại lệnh.

---

### ⚠️ Sự cố 3: Sửa code nhưng không thấy thay đổi
- **Nguyên nhân:** Chưa mount volume hoặc tiến trình bên trong container bị crash.
- **Cách kiểm tra:**
  ```bash
  docker compose logs -f api   # Xem có lỗi cú pháp code nào làm crash server không
  ```

---

## 6. Tắt và Dọn dẹp môi trường

Khi kết thúc buổi làm việc, bạn có 2 lựa chọn:

1. **Tắt thông thường (Giữ nguyên dữ liệu database):**
   ```bash
   docker compose down
   ```
   *Toàn bộ dữ liệu bạn đã học, từ vựng và bảng trong Postgres/Redis sẽ được giữ an toàn trong Docker Volumes để lần sau bật lại.*

2. **Dọn sạch hoàn toàn (Làm mới như ngày đầu tiên):**
   ```bash
   docker compose down -v
   ```
   *Tham số `-v` sẽ xóa sạch các Docker Volumes. Dùng khi bạn muốn reset toàn bộ Database về trạng thái ban đầu.*

---
*Chúc bạn có những trải nghiệm học tập và phát triển ứng dụng SpeakUp thật hứng khởi và năng suất! 🚀*
