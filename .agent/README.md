# 🚀 CẨM NANG TOÀN TẬP: AI AGENT WORKFLOW & KNOWLEDGE FRAMEWORK (`.agent`)

> **Phiên bản:** 2.3.0 — Universal Edition (Khắc phục hoàn toàn liên kết Mục lục)  
> **Mục đích:** Tài liệu hướng dẫn toàn diện, chi tiết từ A-Z cách sử dụng, tái sử dụng và tùy biến (customize) bộ khung kiến trúc `.agent` cho bất kỳ dự án phát triển phần mềm nào (Web, Mobile, Backend API, Data Science, AI/ML...).

---

## 📋 MỤC LỤC

1. [Giới thiệu & Triết lý vận hành](#section1)
2. [Giải phẫu kiến trúc thư mục .agent](#section2)
3. [Hướng dẫn tích hợp vào dự án mới](#section3)
4. [Hướng dẫn Tùy biến (Customize) chuyên sâu theo Domain](#section4)
   - 4.1. [Tùy biến cho dự án Backend API](#section4-1)
   - 4.2. [Tùy biến cho dự án Mobile App](#section4-2)
   - 4.3. [Tùy biến cho dự án Web Frontend](#section4-3)
   - 4.4. [Tùy biến cho dự án AI / Data Science](#section4-4)
5. [Quy trình làm việc chuẩn 3 Pha (3-Phase Workflow)](#section5)
6. [Ví dụ Thực Tế: Luồng chạy tính năng Đăng nhập](#section6)
7. [Cách tự tạo Rules và Skills mới cho AI](#section7)
8. [Quản trị & Bảo trì bộ nhớ tri thức (learnings)](#section8)
9. [Bộ Thư viện Câu lệnh (Prompts) Chuẩn](#section9)

---

<a id="section1" name="section1"></a>
## 💡 1. GIỚI THIỆU & TRIẾT LÝ VẬN HÀNH

### Tại sao cần `.agent`?
khi làm việc với các trợ lý AI (Cursor, Windsurf, Antigravity, GitHub Copilot...), lập trình viên thường gặp 3 vấn đề lớn:
1. **Hội chứng mất trí nhớ (Amnesia):** AI quên hết các quyết định kiến trúc, quy chuẩn code hoặc các bug đã giải quyết sau mỗi lần đóng session chat.
2. **Code ngẫu hứng (Vibe Coding):** AI vội vàng viết code ngay khi nhận yêu cầu mơ hồ, dẫn đến kiến trúc sai lệch, phá vỡ logic cũ hoặc tạo ra các đoạn code "rác".
3. **Thiếu tính nhất quán (Inconsistency):** Mỗi lần hỏi, AI lại viết code theo một style khác nhau, không tuân thủ convention của team.

### Triết lý giải quyết của `.agent`:
Bộ khung `.agent` đóng vai trò là **"Hệ điều hành tư duy"** giúp biến AI thành một **Kỹ sư phần mềm kỷ luật**, hoạt động theo nguyên tắc:
> **Học từ quá khứ (`learnings`) ➔ Tuân thủ quy tắc (`rules`) ➔ Áp dụng kỹ năng chuyên sâu (`skills`) ➔ Thực thi theo quy trình bài bản (`workflows`).**

---

<a id="section2" name="section2"></a>
## 📂 2. GIẢI PHẪU KIẾN TRÚC THƯ MỤC `.agent`

```text
.agent/
├── 📖 README.md                     # Tài liệu hướng dẫn sử dụng toàn tập này
├── 🧠 learnings/                    # BỘ NHỚ TRI THỨC (Long-term Memory)
│   ├── README.md                    # Hướng dẫn phân loại nội dung cho AI
│   ├── architecture.md              # Ghi nhận các quyết định kiến trúc & trade-offs
│   ├── bugs-solutions.md            # Nhật ký fix bug (lỗi, root cause, giải pháp)
│   ├── howto.md                     # Cẩm nang quy trình từng bước (step-by-step)
│   └── patterns.md                  # Các mẫu code hay & conventions chuẩn của dự án
├── ⚖️ rules/                        # KHO LUẬT LỆ (Guardrails - Bắt buộc tuân thủ)
│   ├── load-learnings.md            # [BẮT BUỘC] Luật tự động đọc kinh nghiệm ở đầu session
│   ├── general-coding-rules.md      # [BẮT BUỘC] Luật Clean Code, SOLID, DRY chung
│   ├── backend-api-rules.md         # [TÙY BIẾN] Luật chuẩn REST API, 3-Tier, Exception
│   ├── mobile-app-rules.md          # [TÙY BIẾN] Luật UI/UX mobile, 60fps, State Management
│   └── web-design-backbone.md       # [TÙY BIẾN] Luật thiết kế Web Frontend UI/UX, Grid
├── 🛠️ skills/                       # BỘ KỸ NĂNG CHUYÊN SÂU (Specialized Capabilities)
│   ├── brainstorming/SKILL.md       # Kỹ năng phân tích ý tưởng, chốt thiết kế trước khi code
│   ├── code-reviewer/SKILL.md       # Kỹ năng kiểm duyệt code theo tiêu chuẩn cao nhất
│   └── find-bugs/SKILL.md           # Kỹ năng rà soát bug, lỗ hổng bảo mật theo checklist
└── 📋 workflows/                    # BỘ QUY TRÌNH THỰC THI (Standard Operating Procedures)
    ├── plan.md                      # Quy trình thực thi task coding 3 Pha chuẩn mực
    ├── ai-learning.md               # Quy trình tự động trích xuất & lưu tri thức mới
    └── human-learning.md            # Quy trình viết tài liệu "Coffee Talk" bàn giao cho Dev
```

---

<a id="section3" name="section3"></a>
## 🚀 3. HƯỚNG DẪN TÍCH HỢP VÀO DỰ ÁN MỚI

Khi bạn khởi tạo một dự án phần mềm mới (Ví dụ: `ECommerce-Platform`), hãy thực hiện quy trình chuẩn 4 bước sau:

### Bước 1: Copy bộ khung vào gốc dự án
Sao chép thư mục `.agent` từ template này và dán trực tiếp vào thư mục gốc của dự án mới.

### Bước 2: Khởi tạo "Bộ nhớ trắng"
Vào thư mục `.agent/learnings/`, kiểm tra và đảm bảo các file `architecture.md`, `bugs-solutions.md`, `howto.md`, `patterns.md` đang ở trạng thái mẫu rỗng (chỉ có tiêu đề). Điều này giúp AI bắt đầu tích lũy kiến thức riêng cho dự án mới mà không bị lẫn lộn với dự án cũ.

### Bước 3: Lọc và Bật/Tắt Luật lệ (`rules/`)
Mở thư mục `.agent/rules/`:
- **Luôn giữ lại 2 file:** `load-learnings.md` và `general-coding-rules.md`.
- **Giữ lại file luật phù hợp với domain** của dự án và xóa (hoặc chuyển `trigger: disabled`) các file không liên quan:
  - Dự án làm Backend API ➔ Giữ `backend-api-rules.md`
  - Dự án làm Mobile App ➔ Giữ `mobile-app-rules.md`
  - Dự án làm Web Frontend ➔ Giữ `web-design-backbone.md`

### Bước 4: Kiểm tra hoạt động
Mở IDE, gõ vào khung chat AI prompt test:
> *"Hãy đọc cấu trúc trong `.agent` và xác nhận bạn đã sẵn sàng làm việc theo quy trình trong `workflows/plan.md`."*

---

<a id="section4" name="section4"></a>
## 🛠️ 4. HƯỚNG DẪN TÙY BIẾN (CUSTOMIZE) CHUYÊN SÂU THEO DOMAIN

Bạn hoàn toàn có thể tự chỉnh sửa nội dung các file trong thư mục `rules/` hoặc tạo file mới để phù hợp 100% với đặc thù công nghệ của công ty/team bạn. Dưới đây là các gợi ý tùy biến:

<a id="section4-1" name="section4-1"></a>
### 4.1. Tùy biến cho dự án Backend API (Spring Boot, Node.js, Go, Python...)
Trong file `.agent/rules/backend-api-rules.md`, bạn có thể thêm các ràng buộc riêng của team:
- **Kiến trúc:** Quy định rõ việc dùng DTO cho Request/Response; dùng MapStruct hoặc ModelMapper để chuyển đổi dữ liệu.
- **Database:** Quy định không dùng khóa ngoại (Foreign Key) vật lý nếu làm hệ thống microservices; bắt buộc đánh index cho các trường `deleted_at`, `created_at`.
- **Bảo mật:** Bắt buộc sử dụng JWT hoặc OAuth2; mọi endpoint thay đổi dữ liệu (`POST/PUT/DELETE`) đều phải kiểm tra quyền (`@PreAuthorize` / Guard).
- **Log:** Bắt buộc ghi log theo định dạng JSON có chứa `trace_id` để tracing trên Kibana/Datadog.

<a id="section4-2" name="section4-2"></a>
### 4.2. Tùy biến cho dự án Mobile App (Flutter, React Native, iOS, Android)
Trong file `.agent/rules/mobile-app-rules.md`, bạn có thể bổ sung:
- **State Management:** Quy định rõ chỉ dùng Bloc (với Flutter) hoặc Redux Toolkit (với React Native). Không quản lý state bằng `setState` cho các màn hình lớn.
- **Offline-First:** Yêu cầu mọi API gọi về đều phải có cơ chế cache local (Hive/SQLite/MMKV) để app hiển thị được dữ liệu khi không có mạng.
- **Responsive:** Bắt buộc dùng đơn vị tương đối (`sp`, `dp`, `rem`, `screenUtil`), không dùng px tĩnh để không bị vỡ giao diện trên máy tính bảng hoặc màn hình nhỏ.

<a id="section4-3" name="section4-3"></a>
### 4.3. Tùy biến cho dự án Web Frontend (React, Vue, Angular, Next.js)
Trong file `.agent/rules/web-design-backbone.md`, bạn có thể tinh chỉnh:
- **Styling:** Nếu team bạn dùng Tailwind CSS, hãy sửa luật thành: *Bắt buộc dùng Tailwind utility classes, không viết file CSS thuần trừ khi tạo animation phức tạp. Luôn tuân thủ design tokens trong `tailwind.config.js`.*
- **SEO & SSR:** Nếu làm Next.js/Nuxt, yêu cầu các trang public phải render phía server (SSR/SSG), có đủ meta tags (`og:title`, `og:description`).
- **Accessibility (a11y):** Bắt buộc thẻ `<img>` phải có thuộc tính `alt`; các nút bấm phải có `aria-label`; màu sắc contrast tối thiểu đạt 4.5:1.

<a id="section4-4" name="section4-4"></a>
### 4.4. Tùy biến cho dự án AI / Data Science (Python, PyTorch, Pandas)
Bạn có thể tạo thêm file `.agent/rules/data-science-rules.md` với cấu hình:
```yaml
---
description: Luật bắt buộc cho các tác vụ xử lý dữ liệu, huấn luyện mô hình ML/AI
globs: "**/*.{py,ipynb}"
trigger: always_on
---
```
- **Xử lý dữ liệu:** Không lặp qua DataFrame bằng vòng lặp `for`; bắt buộc dùng vectorization (Pandas/NumPy) để tối ưu tốc độ.
- **Quản lý thực nghiệm:** Mọi mô hình huấn luyện đều phải ghi lại hyperparameters, loss và metrics vào MLflow / Weights & Biases hoặc file log.
- **Khả năng tái lập (Reproducibility):** Bắt buộc set `random_seed = 42` ở đầu các script chia tập train/test hoặc khởi tạo trọng số.

---

<a id="section5" name="section5"></a>
## 🔄 5. QUY TRÌNH LÀM VIỆC CHUẨN 3 PHA (3-PHASE WORKFLOW)

Mỗi khi bạn giao một task coding thông qua file `workflows/plan.md`, AI sẽ thực thi nghiêm ngặt theo sơ đồ vận hành sau:

```
===================================================================================
  🟢 PHA 1: BRAINSTORM (BẮT BUỘC - TUYỆT ĐỐI CHƯA VIẾT CODE)
===================================================================================
  1. Load Learnings: Quét `learnings/` đọc kinh nghiệm cũ liên quan đến task.
  2. Kích hoạt Skill: Mở `skills/brainstorming/SKILL.md` để tư duy.
  3. Làm rõ yêu cầu: Hỏi đáp trắc nghiệm với người dùng nếu có điểm mơ hồ.
  4. Understanding Lock: Tóm tắt 5-7 bullet points yêu cầu, HỎI XÁC NHẬN.
  5. Đề xuất phương án: Đưa ra 2-3 hướng kiến trúc kèm Trade-offs (Ưu/Nhược điểm).
  6. Chốt Thiết Kế: Trình bày chi tiết giải pháp được chọn.
  ---------------------------------------------------------------------------------
  🛑 GATE 1 (Cổng Kiểm Soát): Bạn đã duyệt thiết kế và Understanding Lock chưa?
     ├── [CHƯA] ➔ AI bị chặn, phải tiếp tục thảo luận sửa đổi thiết kế.
     └── [RỒI]  ➔ Được phép chuyển sang Pha 2.
===================================================================================
  🟡 PHA 2: EXECUTE (THỰC THI VIẾT CODE)
===================================================================================
  1. Task Checklist: Lập danh sách công việc dạng TODO list (`- [ ]`).
  2. Thực thi từng bước:
     ├── Đánh dấu `[/]` đang làm.
     ├── Context Audit: Kiểm tra tác động, truy vết biến & dependency.
     ├── Viết code: Tuân thủ 100% các luật trong folder `rules/`.
     └── Đánh dấu `[x]` hoàn thành.
  3. Verify (Kiểm chứng): Chạy lệnh build, lint check, unit test.
  ---------------------------------------------------------------------------------
  🛑 GATE 2 (Cổng Kiểm Soát): Code có sạch lỗi Build, Lint và Test không?
     ├── [LỖI]      ➔ AI bị chặn, quay lại Bước 2 để sửa lỗi code đến khi sạch.
     └── [SẠCH LỖI] ➔ Được phép chuyển sang Pha 3.
===================================================================================
  🔵 PHA 3: SAVE LEARNINGS (LƯU TRỮ TRI THỨC - BÁN TỰ ĐỘNG)
===================================================================================
  1. Hỏi ý kiến: "Task hoàn thành. Bạn có muốn lưu learnings từ task này không?"
  2. Trích xuất kiến thức (Nếu chọn "Có"):
     ├── Mảng code hay ➔ Ghi tiếp vào `learnings/patterns.md`
     ├── Quyết định kiến trúc ➔ Ghi tiếp vào `learnings/architecture.md`
     ├── Bug khó vừa fix ➔ Ghi tiếp vào `learnings/bugs-solutions.md`
     └── Quy trình step-by-step ➔ Ghi tiếp vào `learnings/howto.md`
  3. [Tùy chọn] Kích hoạt `workflows/human-learning.md` viết bài "Coffee Talk" cho Dev.
===================================================================================
```

---

<a id="section6" name="section6"></a>
## 🌟 6. VÍ DỤ THỰC TẾ: LUỒNG CHẠY KHI LÀM TÍNH NĂNG "ĐĂNG NHẬP BẢO MẬT (JWT & REFRESH TOKEN)"

Để bạn thấy rõ sức mạnh của bộ khung `.agent` trong một bài toán kinh điển, hãy cùng xem luồng tương tác giữa Lập trình viên và AI khi triển khai tính năng: **"Xây dựng API Đăng nhập và Giao diện Login có xác thực JWT, tích hợp Refresh Token và bảo mật chống tấn công Brute-force"**.

### 🎬 Bắt đầu Task
Lập trình viên gõ prompt vào IDE:
> *"Hãy triển khai tính năng Đăng nhập (Login) cho hệ thống Backend Spring Boot và Frontend Angular tuân thủ workflow `.agent/workflows/plan.md`."*

---

### 🟢 PHA 1: BRAINSTORM (AI tuyệt đối chưa viết hay sửa dòng code nào)

* **Bước 1.1 (Load Learnings):** AI tự động quét folder `.agent/learnings/` và báo cáo:
  > *"🤖 Tôi đã kiểm tra bộ nhớ. Trong `architecture.md` có ghi nhận hệ thống chúng ta tuân thủ mô hình 3-Tier Architecture và chuẩn RESTful API. Tôi sẽ tuân thủ tuyệt đối cấu trúc này."*
* **Bước 1.2 (Kích hoạt Brainstorming & Khóa Hiểu Biết):** AI phân tích yêu cầu, tự đặt ra các tiêu chuẩn bảo mật và gửi bản tóm tắt (Understanding Lock) để bạn duyệt:
  > *"🤖 **Understanding Lock (Khóa hiểu biết):**  
  > 1. **Backend API (`/api/auth/login`):** Nhận `username`/`password`. Validate dữ liệu không trống, kiểm tra mật khẩu (đã hash bằng Bcrypt trong DB).  
  > 2. **Cơ chế Token:** Nếu đúng, sinh ra `AccessToken` (JWT - hạn 15 phút) và `RefreshToken` (hạn 7 ngày).  
  > 3. **Frontend UI (`LoginComponent`):** Form đăng nhập có validation, xử lý 3 trạng thái UI: Loading (spinner khi đang gọi API), Error (alert báo sai tài khoản/mật khẩu) và Success.  
  > 4. **An toàn bảo mật:** Cần cơ chế khóa tài khoản tạm thời nếu đăng nhập sai 5 lần liên tiếp (chống Brute-force).  
  > 👉 **Bạn có đồng ý với toàn bộ các yêu cầu nghiệp vụ và bảo mật này không?**"*
* **Bước 1.3 (Đề xuất phương án kiến trúc & Trade-offs):** Bạn trả lời *"Đồng ý"*. AI tiếp tục phân tích cách lưu Token an toàn:
  - **Phương án A (Khuyên dùng - Bảo mật cao):** Trả `AccessToken` trong thân JSON (client lưu vào RAM/State hoặc LocalStorage) và trả `RefreshToken` trong **`HttpOnly Secure Cookie`**. *Ưu điểm:* Chống tấn công đọc trộm XSS tuyệt đối cho Refresh Token.
  - **Phương án B:** Trả cả 2 token trong JSON và lưu hết vào `LocalStorage`. *Nhược điểm:* Nếu Web bị dính lỗ hổng XSS, hacker sẽ đánh cắp được cả Refresh Token.
* **🛑 GATE 1 (Chốt thiết kế):** Bạn phản hồi: *"Hãy triển khai theo Phương án A!"* ➔ **Cổng Pha 2 chính thức được mở!**

---

### 🟡 PHA 2: EXECUTE (AI viết code bài bản theo Luật)

* **Bước 2.1 (Lập Task Checklist):** AI tự động lập TODO list chi tiết:
  ```markdown
  - [/] Task 1: [Backend] Tạo `LoginRequestDTO` và `LoginResponseDTO` có `@NotBlank` validation.
  - [ ] Task 2: [Backend] Viết `AuthService.login()` kiểm tra Bcrypt, đếm số lần login sai và sinh JWT.
  - [ ] Task 3: [Backend] Tạo `AuthController` trả về JSON đi kèm header `Set-Cookie` HttpOnly.
  - [ ] Task 4: [Backend] Xử lý `GlobalExceptionHandler` bắt lỗi `BadCredentialsException` trả về 401.
  - [ ] Task 5: [Frontend] Tạo `LoginComponent` với Reactive Form, tích hợp Loading Spinner và Alert.
  ```
* **Bước 2.2 (Thực thi tuân thủ Luật Thép):**
  - **Tuân thủ luật Backend (`backend-api-rules.md`):** AI không bao giờ trả thẳng `UserEntity` ra ngoài mà dùng DTO. Đặc biệt, tuân thủ luật ghi log an toàn:
    ```java
    // AI tự viết log chuẩn, tuyệt đối không log password
    log.info("Attempting login for username: {}", requestDTO.getUsername());
    ```
  - **Tuân thủ luật Frontend (`web-design-backbone.md`):** AI dựng giao diện Login bằng CSS Flexbox canh giữa màn hình, các input field có border đổi màu khi focus, nút "Đăng nhập" có kích thước chuẩn `48px` và chuyển sang trạng thái disable kèm spinner khi đang submit.
  - AI đánh dấu hoàn thành `[x]` cho từng task.
* **Bước 2.3 (Verify - Kiểm chứng):** AI chạy ngầm lệnh terminal: `./gradlew test` để chạy unit test cho AuthService và `ng test` cho Angular.
* **🛑 GATE 2 (Kiểm tra lỗi):** Terminal báo build thành công, 100% test case pass! ➔ **Cổng Pha 3 được mở!**

---

### 🔵 PHA 3: SAVE LEARNINGS (Ghi nhớ tri thức vào bộ nhớ)

* **Bước 3.1 (Hỏi xác nhận):** AI nhắn cho bạn:
  > *"🤖 Tính năng Đăng nhập đã hoàn thành xuất sắc và vượt qua toàn bộ các bài kiểm thử! Bạn có muốn tôi lưu lại các quyết định kiến trúc và code mẫu vào bộ nhớ không? (Có/Không)"*
* **Bước 3.2 (Trích xuất & Lưu trữ):** Bạn trả lời *"Có"*. AI tự động đúc kết ra 2 bài học và ghi nối (append) vào folder `learnings/`:
  1. Ghi vào `.agent/learnings/architecture.md`:
     ```markdown
     ### [Security] Quyết định lưu Refresh Token trong HttpOnly Cookie
     - **Ngày**: 2026-07-28
     - **Chi tiết**: Để bảo vệ hệ thống khỏi tấn công XSS, Refresh Token luôn được server gửi về qua HttpOnly Cookie (`ResponseCookie.from("refreshToken", token).httpOnly(true).secure(true)`), không trả trong body JSON.
     - **Files liên quan**: `AuthController.java`
     ```
  2. Ghi vào `.agent/learnings/patterns.md`:
     ```markdown
     ### [Spring Security] Pattern đếm số lần đăng nhập sai chống Brute-force
     - **Ngày**: 2026-07-28
     - **Chi tiết**: Sử dụng trường `failed_login_attempts` trong DB. Mỗi lần `BadCredentialsException`, tăng 1. Nếu đạt 5 lần, set `account_locked_until` = now + 15 phút.
     - **Files liên quan**: `AuthService.java`, `UserEntity.java`
     ```
* **Bước 3.3 (Bàn giao cho Dev):** AI tự động kích hoạt workflow `human-learning.md` để viết một bài tài liệu giải thích giọng văn thân thiện ("Coffee Talk") về cơ chế hoạt động của Access Token và Refresh Token để bàn giao cho các thành viên mới trong team.

---
*👉 Qua ví dụ tính năng Đăng nhập này, bạn có thể thấy AI không chỉ viết code đúng mà còn làm việc như một chuyên gia bảo mật thực thụ nhờ sự kiểm soát của bộ khung `.agent`!*

---

<a id="section7" name="section7"></a>
## 🛠️ 7. CÁCH TỰ TẠO RULES VÀ SKILLS MỚI CHO AI

### Cách tạo một Rule mới (Quy tắc bắt buộc)
Để tạo một luật mới, bạn tạo một file `.md` trong thư mục `.agent/rules/` với cấu trúc YAML frontmatter ở đầu file:
```markdown
---
description: Mô tả ngắn gọn luật này làm gì và khi nào áp dụng
globs: "**/*.{kt,java,ts}"  # Các đuôi file mà luật này sẽ áp dụng
trigger: always_on          # always_on (luôn bật) hoặc disabled (tắt)
---

# Tên Luật (Ví Dụ: Logging Standards Rule)

> **LUẬT KHÔNG THỂ THƯƠNG LƯỢNG.** Vi phạm → FAILED.

## 1. Quy định cụ thể
- Mô tả chi tiết những gì AI được làm và KHÔNG được làm...
```

### Cách tạo một Skill mới (Kỹ năng chuyên môn)
Để tạo một kỹ năng mới (ví dụ kỹ năng viết Unit Test), bạn tạo thư mục `.agent/skills/unit-tester/` và file `SKILL.md` bên trong:
```markdown
---
name: unit-tester
description: Chuyên gia viết Unit Test và Integration Test đạt độ phủ (coverage) cao. Kích hoạt khi được yêu cầu viết test hoặc kiểm thử code.
risk: unknown
source: custom
---

# Kỹ Năng Viết Unit Test Chuyên Nghiệp

## Khi nào sử dụng
- Khi người dùng yêu cầu viết test cho hàm, lớp hoặc module.

## Quy trình thực thi
1. Phân tích các hàm cần test, xác định các trường hợp biên (Edge cases), Null, Exception.
2. Sử dụng thư viện chuẩn của dự án (JUnit/Mockito, Jest, PyTest...).
3. Viết test theo mô hình AAA (Arrange - Act - Assert).
4. Không bao giờ mock các cấu trúc dữ liệu đơn giản, chỉ mock external services hoặc DB.
```

---

<a id="section8" name="section8"></a>
## 🧹 8. QUẢN TRỊ & BẢO TRÌ BỘ NHỚ TRI THỨC (`learnings/`)

Sau 1-2 tháng làm việc liên tục, các file trong thư mục `learnings/` có thể trở nên rất dài. Để giữ cho AI luôn nhanh và chính xác, bạn nên bảo trì theo các nguyên tắc:
1. **Quy tắc 150 từ:** Khi AI ghi thêm kiến thức mới vào các file `learnings/`, nó đã được lập trình để ghi cực kỳ ngắn gọn (tối đa 150 từ/entry), chỉ giữ lại lõi kiến thức tái sử dụng.
2. **Refactor định kỳ (Mỗi quý 1 lần):** Bạn hãy nhờ AI tự dọn dẹp bộ nhớ bằng prompt:
   > *"Hãy đọc toàn bộ các file trong `.agent/learnings/`. Hãy tổng hợp lại, gộp các kiến thức trùng lặp, xóa các bug đã lỗi thời do nâng cấp thư viện, và trình bày lại cho gọn gàng, súc tích."*
3. **Phân chia module (Khi dự án cực lớn):** Nếu dự án của bạn chia thành nhiều module lớn (như `module-payment`, `module-chat`), bạn có thể tạo các sub-folder trong learnings như `learnings/payment/` và `learnings/chat/` để tổ chức khoa học hơn.

---

<a id="section9" name="section9"></a>
## 💬 9. BỘ THƯ VIỆN CÂU LỆNH (PROMPTS) CHUẨN

Dưới đây là các câu lệnh đã được tối ưu hóa để bạn làm việc với AI đạt hiệu quả cao nhất:

### 🌟 Prompts Khởi Tạo & Kế Hoạch (Planning)
- *"Hãy đọc thư mục `.agent` và tóm tắt ngắn gọn các quy tắc quan trọng nhất của dự án này cho tôi nghe."*
- *"Hãy sử dụng skill `brainstorming` để cùng tôi thiết kế kiến trúc cho tính năng [Tên tính năng]. Lưu ý: Chỉ thảo luận và chốt phương án, tuyệt đối chưa viết code."*
- *"Tôi muốn thêm module [Tên module]. Hãy kích hoạt workflow `workflows/plan.md` để bắt đầu từ Pha 1 Brainstorming."*

### ⚡ Prompts Thực Thi & Lập Trình (Execution)
- *"Thiết kế đã chốt. Hãy chuyển sang Pha 2 của `workflows/plan.md`, lập Task Checklist và bắt đầu thực thi bước đầu tiên."*
- *"Hãy refactor đoạn code trong file [Tên file] tuân thủ 100% các nguyên tắc trong file luật `.agent/rules/general-coding-rules.md`."*
- *"Hãy kiểm tra xem việc thêm hàm này có vi phạm luật phân lớp trong `backend-api-rules.md` không."*

### 🔍 Prompts Review Code & Tìm Lỗi (Quality Assurance)
- *"Hãy kích hoạt skill `code-reviewer` để review toàn bộ các file đã thay đổi trên nhánh hiện tại. Chỉ ra các điểm vi phạm clean code hoặc tối ưu hiệu năng."*
- *"Hãy sử dụng skill `find-bugs` để rà soát diff của nhánh này theo 2 giai đoạn. Đặc biệt tìm các lỗ hổng bảo mật và lỗi Null Pointer."*
- *"Tại sao đoạn code này chạy bị lỗi [Mô tả lỗi]? Hãy kiểm tra xem trong `learnings/bugs-solutions.md` có lỗi nào tương tự từng gặp không."*

### 📚 Prompts Tự Học & Bàn Giao (Learning & Handover)
- *"Task đã hoàn thành và test pass. Hãy kích hoạt Bước 3 của `workflows/plan.md` để trích xuất và lưu learnings vào thư mục `learnings/`."*
- *"Hãy chạy workflow `workflows/ai-learning.md` để tổng hợp lại cách chúng ta vừa giải quyết bài toán [Tên bài toán] vào bộ nhớ."*
- *"Hãy kích hoạt `workflows/human-learning.md` để viết một bài tài liệu giải thích chi tiết dạng 'Coffee Talk' về tính năng vừa làm để tôi bàn giao cho Developer mới trong team."*

---
*Chúc bạn có những trải nghiệm lập trình tuyệt vời, kỷ luật và năng suất cao nhất với AI Agent Framework! 🚀*
