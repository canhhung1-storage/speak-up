# 📚 Cẩm Nang Công Nghệ & Vai Trò Trong Dự Án SpeakUp

> **Mục tiêu:** Giải thích chi tiết, trực quan bằng ví dụ thực tế về vai trò, chức năng và lý do lựa chọn từng công nghệ trong hệ thống **SpeakUp**.

---

## 🌟 Bảng tổng hợp vai trò nhanh

| Công nghệ | Đóng vai trò | Ẩn dụ thực tế | Nhiệm vụ chính trong SpeakUp |
| :--- | :--- | :--- | :--- |
| **🌐 Nginx** | Reverse Proxy & API Gateway | **Bác bảo vệ / Lễ tân tòa nhà** | Đón tiếp mọi request từ người dùng ở cổng 80, phân luồng `/api` sang NestJS và `/` sang Angular. |
| **🐰 RabbitMQ** | Message Broker & Task Queue | **Bưu tá / Shipper giao hàng** | Nhận các tác vụ nặng (như xử lý file ghi âm, chấm điểm phát âm) và đưa vào hàng đợi để xử lý ngầm, không bắt user chờ. |
| **⚡ Redis** | In-Memory Data Store & Cache | **Tập giấy nhớ (Sticky Note) trên bàn** | Lưu trữ tạm dữ liệu truy xuất cực nhanh (phiên đăng nhập, từ vựng vừa học, đếm lượt request). |
| **🐘 PostgreSQL** | Relational Database (RDBMS) | **Két sắt / Kho lưu trữ tài liệu** | Lưu trữ dữ liệu lâu dài và an toàn tuyệt đối (thông tin user, ngân hàng từ vựng, điểm số, lịch sử luyện nói). |
| **🚀 NestJS** | Backend API Framework | **Bộ não xử lý nghiệp vụ** | Tính toán, xác thực tài khoản, kết nối cơ sở dữ liệu, điều phối logic chấm điểm và tương tác AI. |
| **🅰️ Angular** | Frontend SPA Framework | **Bộ mặt giao diện người dùng** | Hiển thị màn hình học tập, nút ghi âm micro, hiệu ứng chấm điểm, đồ thị tiến độ trực quan. |
| **🐳 Docker & Compose** | Container Orchestration | **Container hàng hải chuẩn hóa** | Đóng gói toàn bộ 6 công nghệ trên vào các "hộp container" chạy y hệt nhau trên mọi máy tính. |

---

## 🔍 Giải thích chi tiết từng công nghệ qua bài toán SpeakUp

---

### 1. 🌐 NGINX — "Bác bảo vệ & Điều phối viên"

#### Nginx là gì?
Nginx là một Web Server và **Reverse Proxy** hiệu năng cực cao, chuyên đứng ở tầng ngoài cùng để đón nhận mọi kết nối mạng từ Internet / Trình duyệt.

#### Đóng vai trò gì trong SpeakUp?
Nếu không có Nginx:
- Trình duyệt muốn vào giao diện web phải gõ: `http://localhost:4200`
- Muốn gọi API lại phải gọi: `http://localhost:3000/api/users`
- Dẫn đến lỗi đau đầu muôn thuở của lập trình viên: **Lỗi CORS (Cross-Origin Resource Sharing)** vì cổng 4200 gọi sang cổng 3000 khác nhau.

**Khi có Nginx đứng chặn ở cổng 80 chuẩn:**
- Người dùng chỉ cần vào đúng một địa chỉ duy nhất: `http://localhost`
- Nginx nhìn vào đường dẫn:
  - Thấy đường dẫn bắt đầu bằng `/api/...` ➔ Nginx âm thầm chuyển tiếp vào NestJS (`:3000`).
  - Thấy mọi đường dẫn khác `/*` ➔ Nginx chuyển tiếp vào Angular (`:4200`).
- **Lợi ích vàng:** Triệt tiêu hoàn toàn lỗi CORS, người dùng không cần nhớ nhiều cổng, bảo vệ NestJS không bị lộ trực tiếp ra bên ngoài.

---

### 2. 🐰 RABBITMQ — "Bưu tá & Hàng đợi công việc nặng"

#### RabbitMQ là gì?
RabbitMQ là một **Message Broker** (Hệ thống điều phối hàng đợi thông điệp). Nó hoạt động theo cơ chế bất đồng bộ (Asynchronous): gửi việc vào hàng đợi (Queue) rồi làm dần, không bắt ai phải đứng chờ.

#### Đóng vai trò gì trong SpeakUp?
Hãy tưởng tượng kịch bản học tiếng Anh:
> *Bạn vừa thu âm một đoạn nói tiếng Anh dài 30 giây và bấm nút "Chấm điểm phát âm & Phân tích lỗi ngữ pháp".*

**Nếu KHÔNG có RabbitMQ (Xử lý đồng bộ truyền thống):**
1. NestJS nhận file audio.
2. NestJS phải tự phân tích âm thanh, gọi AI chấm điểm (mất khoảng **5 - 10 giây**).
3. Trong 10 giây đó, kết nối HTTP bị treo (loading quay tròn). Nếu mạng chập chờn, request bị Timeout (lỗi 504) và người dùng nghĩ app bị đơ.
4. Tệ hơn: Nếu có 100 người cùng bấm chấm điểm một lúc, server NestJS sẽ sập vì quá tải CPU!

**KHI CÓ RabbitMQ (Xử lý bất đồng bộ chuẩn Doanh nghiệp):**
1. Bạn gửi audio lên ➔ NestJS chỉ mất **0.1 giây** để lưu file và nhét một "phiếu công việc" vào hàng đợi RabbitMQ:  
   `{ taskId: 123, audio: 'user_voice.wav', status: 'PENDING' }`
2. NestJS trả lời bạn ngay lập tức: *"Đã nhận bài nói, hệ thống đang chấm điểm nhé!"* ➔ Giao diện hiện thông báo mượt mà, người dùng không phải chờ đơ màn hình.
3. Ở hậu trường, một tiến trình chạy ngầm (**Worker**) từ từ rút từng việc trong RabbitMQ ra để phân tích âm thanh và chấm điểm.
4. Chấm xong, hệ thống bắn thông báo (hoặc WebSocket) về màn hình của bạn: *"Bài của bạn đạt 8.5/10 điểm!"*

---

### 3. ⚡ REDIS — "Tập giấy nhớ trên bàn làm việc"

#### Redis là gì?
Redis là một cơ sở dữ liệu lưu trữ dữ liệu hoàn toàn trên **RAM (In-Memory)** dưới dạng Key - Value. Vì dữ liệu nằm trên RAM nên tốc độ đọc/ghi của nó đạt tới hàng trăm nghìn lượt mỗi giây (nhanh gấp cả nghìn lần ổ cứng).

#### Đóng vai trò gì trong SpeakUp?
- **Ví dụ 1: Lưu từ vựng hay tra cứu (Caching)**
  - 10.000 học viên đều mở bài học "100 từ vựng tiếng Anh giao tiếp cơ bản".
  - Thay vì bắt database Postgres phải query ổ cứng 10.000 lần, NestJS sẽ lấy dữ liệu từ Postgres một lần đầu tiên, rồi cất vào **Redis**.
  - 9.999 lần sau, NestJS chỉ việc lấy vèo một cái từ RAM của Redis trả về trong 1 phần nghìn giây!
- **Ví dụ 2: Quản lý đăng nhập (Session & Token Whitelist/Blacklist)**
  - Kiểm tra xem token của bạn còn hợp lệ không mỗi khi bấm một nút.
- **Ví dụ 3: Giới hạn tần suất bấm (Rate Limiting)**
  - Ngăn chặn người dùng bấm spam nút "Gửi âm thanh" 50 lần/giây làm tốn tài nguyên server.

---

### 4. 🐘 POSTGRESQL — "Két sắt dữ liệu cốt lõi"

#### PostgreSQL là gì?
PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ (SQL) mã nguồn mở mạnh mẽ, bảo mật và chuẩn mực nhất thế giới hiện nay.

#### Đóng vai trò gì trong SpeakUp?
Khác với Redis (dữ liệu có thể mất nếu restart máy), PostgreSQL là nơi lưu trữ **vĩnh viễn và an toàn tuyệt đối**:
- Bảng `users`: Tài khoản, mật khẩu (đã mã hóa Bcrypt), họ tên, level tiếng Anh.
- Bảng `topics`: Các chủ đề học nói (Du lịch, Phỏng vấn xin việc, Đặt đồ ăn...).
- Bảng `vocabulary`: Danh sách từ vựng, phiên âm IPA, nghĩa tiếng Việt, câu ví dụ.
- Bảng `submissions`: Lịch sử các bài nói của bạn, điểm số từng ngày để vẽ biểu đồ tiến bộ.
- Tuân thủ tính toàn vẹn dữ liệu **ACID**: Đảm bảo không bao giờ có chuyện mất điểm hay dữ liệu bị sai lệch.

---

### 5. 🚀 NESTJS — "Bộ não trung tâm"

#### NestJS là gì?
NestJS là Framework Backend hàng đầu của Node.js viết bằng TypeScript, sử dụng kiến trúc module hóa hướng đối tượng (tương tự như Spring Boot của Java hay Angular của Frontend).

#### Đóng vai trò gì trong SpeakUp?
- Cung cấp toàn bộ các cổng API (`/api/v1/...`).
- Xác thực người dùng (Login, Register, cấp JWT Token).
- Giao tiếp với Postgres (qua Prisma hoặc TypeORM) để lấy dữ liệu bài học.
- Bắn task vào RabbitMQ và đọc cache từ Redis.

---

### 6. 🅰️ ANGULAR — "Giao diện trải nghiệm người dùng"

#### Angular là gì?
Angular là một nền tảng Frontend mạnh mẽ do Google phát triển, viết bằng TypeScript, cung cấp đầy đủ công cụ để xây dựng các ứng dụng web quy mô lớn (Enterprise Single Page Application - SPA).

#### Đóng vai trò gì trong SpeakUp?
- Hiển thị giao diện học tập hiện đại, chuyển trang mượt mà không bị load lại cả trang web.
- Tích hợp Web Audio API để thu âm giọng nói của bạn qua Micro trình duyệt.
- Quản lý trạng thái học tập (State Management) và hiển thị kết quả chấm điểm.

---

### 7. 🐳 DOCKER & DOCKER COMPOSE — "Chiếc hộp ma thuật"

#### Docker là gì?
Bình thường nếu muốn chạy dự án này, bạn phải cài thủ công: Node.js, Angular CLI, PostgreSQL, Redis Server, RabbitMQ Server, Nginx Server lên máy tính của mình. Rất dễ bị xung đột phiên bản và nặng máy.

#### Đóng vai trò gì trong SpeakUp?
- Docker đóng gói mỗi công nghệ trên vào một **Container** độc lập, cách ly hoàn toàn.
- File `docker-compose.yml` giống như một nhạc trưởng, bạn chỉ cần gõ đúng **1 câu lệnh duy nhất**:
  ```bash
  docker compose up -d
  ```
  Ngay lập tức cả 6 thành viên (Nginx, Angular, NestJS, Postgres, Redis, RabbitMQ) sẽ tự động khởi động, tự động kết nối mạng nội bộ với nhau và sẵn sàng hoạt động!
