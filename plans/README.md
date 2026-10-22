# 📅 Daily & Feature Plans (`plans/`)

Thư mục lưu trữ kế hoạch công việc hàng ngày, lộ trình tính năng và checklist thực thi cho dự án **SpeakUp**.

---

## 🎯 Mục đích
- Làm **bộ nhớ ngữ cảnh (External Memory)** cho cả Lập trình viên và AI Agent khi Vibe Coding.
- Theo dõi tiến độ cuốn chiếu: Hôm nay làm gì, hôm qua đã làm gì, ngày mai làm gì tiếp.
- Giữ vững kiến trúc, tránh tình trạng AI tự ý sửa code lan man hoặc phá vỡ các phần đã hoàn thiện.

---

## 📂 Quy chuẩn đặt tên file

1. **Kế hoạch theo ngày:**
   `YYYY-MM-DD-ten-muc-tieu.md`  
   *Ví dụ:* `2026-10-22-init-project.md`, `2026-10-23-voice-recognition.md`

2. **Kế hoạch theo Epic / Tính năng lớn:**
   `feature-[ten-tinh-nang].md`  
   *Ví dụ:* `feature-auth.md`, `feature-ai-tutor.md`

---

## 🚀 Cách sử dụng

1. Copy nội dung từ [`template.md`](./template.md) sang file mới cho ngày làm việc.
2. Điền các mục tiêu cốt lõi và checklist dự kiến.
3. Khi chat với AI, chỉ cần prompt:
   > *"Đọc file `plans/2026-xx-xx-ten-file.md`, hôm nay chúng ta làm task số X..."*
4. Sau khi hoàn thành, tích `[x]` vào checklist và cập nhật các ghi chú / việc tồn đọng cho buổi sau.
