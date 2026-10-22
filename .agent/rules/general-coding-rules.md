---
description: Rule cốt lõi bắt buộc về Clean Code và tư duy lập trình chung cho mọi ngôn ngữ và dự án phần mềm.
globs: "**/*"
trigger: always_on
---

# General Clean Code & Architecture Rule

> **LUẬT KHÔNG THỂ THƯƠNG LƯỢNG.** Áp dụng cho mọi file source code trong dự án.

## 1. Naming Conventions — Đặt tên rõ ràng, có nghĩa
- **Tên tự giải thích (Self-explanatory):** Tên biến, hàm, lớp phải giải thích được ý nghĩa và mục đích sử dụng. Tránh viết tắt phi tiêu chuẩn hoặc đặt tên vô nghĩa (`a`, `b`, `temp`, `x1`).
- **Tuân thủ chuẩn ngôn ngữ:**
  - `camelCase` cho biến và hàm trong Java, JS/TS, Dart, Go.
  - `snake_case` cho biến và hàm trong Python, PHP.
  - `PascalCase` cho tên Lớp (Class), Interface, Component, Type.
  - `UPPER_SNAKE_CASE` cho hằng số (Constants).
- **Hàm phải là Động từ:** Tên hàm bắt đầu bằng một động từ mô tả hành động (`getUserById`, `calculateTotal`, `validateInput`, `isEmailValid`).

## 2. SOLID & Clean Principles — Nguyên tắc lập trình sạch
- **DRY (Don't Repeat Yourself):** Không sao chép lặp lại code. Nếu một đoạn logic xuất hiện từ 2 lần trở lên, hãy tách nó ra thành hàm/component/utility dùng chung.
- **KISS (Keep It Simple, Stupid):** Giữ cho code đơn giản, dễ đọc, dễ hiểu nhất có thể. Tránh viết các đoạn code quá phức tạp, nested if-else nhiều tầng (tối đa 2-3 tầng, ưu tiên dùng Early Return / Guard Clauses).
- **Single Responsibility Principle (SRP):** Mỗi hàm/lớp chỉ nên chịu trách nhiệm cho MỘT việc duy nhất. Nếu một hàm dài quá 50 dòng, hãy xem xét chia nhỏ nó ra.
- **No Magic Numbers/Strings:** Tuyệt đối không hardcode các con số hoặc chuỗi ký tự bí ẩn trực tiếp trong code. Hãy đưa chúng vào Hằng số (Constants) hoặc Config file.

## 3. Comments & Documentation — Chú thích code
- **Comment "Tại sao", không comment "Là gì":** Code sạch phải tự giải thích nó làm gì. Chú thích chỉ nên dùng để giải thích **lý do tại sao** giải pháp này được chọn, hoặc các logic nghiệp vụ phức tạp không hiển nhiên.
- Xóa bỏ các đoạn code đã comment-out trước khi commit. Không để rác trong codebase.
