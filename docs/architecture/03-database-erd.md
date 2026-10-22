# 🗄️ 03. Database Schema & ERD Documentation

Tài liệu thiết kế cơ sở dữ liệu chi tiết cho dự án **SpeakUp**, mô hình hóa theo phương pháp học tiếng Anh phản xạ tự nhiên (Main Article, Vocabulary, Mini Story, Commentary, Point of View).

---

## 1. Sơ đồ quan hệ thực thể (Entity Relationship Diagram - ERD)

```mermaid
erDiagram
    users ||--o{ user_lesson_progress : "theo dõi tiến độ"
    courses ||--o{ lessons : "chứa nhiều"
    lessons ||--o{ user_lesson_progress : "được học bởi"

    lessons ||--|| lesson_articles : "có 1 bài đọc chính (1:1)"
    lessons ||--o{ vocabulary_items : "chứa danh sách từ mới (1:N)"
    lessons ||--o{ lesson_audios : "chứa các audio luyện nghe (1:N)"

    users {
        uuid id PK "Khóa chính UUID"
        string email UK "Email đăng nhập duy nhất"
        string password_hash "Mật khẩu mã hóa Bcrypt"
        string full_name "Họ và tên"
        string role "ADMIN | LEARNER"
        string avatar_url "Ảnh đại diện"
        timestamptz created_at
        timestamptz updated_at
    }

    courses {
        uuid id PK
        string title "Tên khóa học"
        string slug UK "Đường dẫn SEO duy nhất toàn cục"
        text description "Mô tả khóa học"
        string thumbnail_url "Ảnh bìa"
        string level "BEGINNER | INTERMEDIATE | ADVANCED"
        boolean is_published "Trạng thái công khai"
        int order_index "Thứ tự sắp xếp"
        timestamptz created_at
        timestamptz updated_at
    }

    lessons {
        uuid id PK
        uuid course_id FK "Thuộc khóa học nào"
        string title "Tên bài học (VD: A Kiss)"
        string slug "Đường dẫn bài học (Scoped Unique trong course)"
        int order_index "Thứ tự bài học trong khóa"
        text description "Tóm tắt bài học"
        string vocab_audio_url "Audio bài giảng giải thích từ vựng"
        timestamptz created_at
        timestamptz updated_at
    }

    lesson_articles {
        uuid id PK
        uuid lesson_id FK,UK "Quan hệ 1:1 với lesson"
        string title "Tiêu đề bài đọc"
        text content "Nội dung bài viết (có thẻ bôi đậm từ mới)"
        string audio_url "File âm thanh bài đọc chính"
        int duration_seconds "Thời lượng file nghe"
        timestamptz created_at
        timestamptz updated_at
    }

    vocabulary_items {
        uuid id PK
        uuid lesson_id FK "Thuộc bài học nào"
        string word "Từ mới (VD: gorgeous)"
        string ipa "Phiên âm quốc tế (/ˈɡɔːrdʒəs/)"
        string meaning_vi "Nghĩa tiếng Việt"
        string definition_en "Định nghĩa tiếng Anh đơn giản"
        text example_sentence "Câu ví dụ chứa từ mới"
        string audio_url "Phát âm riêng của từ (tùy chọn)"
        int order_index "Thứ tự xuất hiện"
    }

    lesson_audios {
        uuid id PK
        uuid lesson_id FK "Thuộc bài học nào"
        string audio_type "MINI_STORY | COMMENTARY | POV"
        string title "Tên hiển thị (VD: Mini-Story A, Past Tense POV)"
        string audio_url "Đường dẫn file nghe"
        text transcript "Lời thoại đầy đủ của bài nghe"
        int duration_seconds "Thời lượng file nghe"
        int order_index "Thứ tự sắp xếp audio"
        timestamptz created_at
    }

    user_lesson_progress {
        uuid id PK
        uuid user_id FK "Người học"
        uuid lesson_id FK "Bài học"
        string status "NOT_STARTED | IN_PROGRESS | COMPLETED"
        jsonb playback_positions "Vị trí giây nghe dở của từng audio"
        timestamptz last_listened_at "Lần học gần nhất"
        timestamptz completed_at "Thời điểm hoàn thành bài"
    }
```

---

## 2. Chi tiết các Ràng buộc & Chỉ mục (Indexes & Constraints)

Nhằm tối ưu hóa tốc độ truy vấn và bảo vệ tính toàn vẹn dữ liệu:

1. **`users.email`:** `UNIQUE INDEX` — Không cho phép đăng ký trùng email, tăng tốc đăng nhập.
2. **`courses.slug`:** `UNIQUE INDEX` — Tìm kiếm khóa học theo đường dẫn URL tức thì.
3. **`lessons.(course_id, slug)`:** `UNIQUE COMPOSITE INDEX` — Đảm bảo trong 1 khóa học không bao giờ trùng slug bài học, nhưng khác khóa học thì vẫn đặt trùng được.
4. **`lesson_audios.lesson_id`:** `INDEX` — Tăng tốc lấy danh sách Mini Story, Commentary, POV của bài.
5. **`user_lesson_progress.(user_id, lesson_id)`:** `UNIQUE COMPOSITE INDEX` — Mỗi user chỉ có 1 bản ghi theo dõi tiến độ cho mỗi bài học.

---

## 3. Khả năng mở rộng & Tiến hóa Database (Evolutionary Design)
Thiết kế này hoàn toàn mở, sử dụng cơ chế **Database Migration** nên trong tương lai bạn có thể:
- Thêm bảng `flashcards` hoặc `quiz_questions` mà không ảnh hưởng cấu trúc cũ.
- Thêm bảng `audio_recordings` để chấm điểm phát âm AI.
- Mở rộng thêm các loại audio mới trong `lesson_audios` chỉ bằng cách thêm giá trị vào `audio_type`.
