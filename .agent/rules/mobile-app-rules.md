---
description: Rule chuẩn mực bắt buộc cho phát triển ứng dụng Mobile (Flutter, React Native, Android Kotlin/Java, iOS Swift). AI PHẢI tuân thủ 100%.
globs: "**/*.{dart,tsx,jsx,kt,java,swift}"
trigger: always_on
---

# Mobile App Backbone Rule

> **LUẬT KHÔNG THỂ THƯƠNG LƯỢNG.** Vi phạm bất kỳ mục nào → ứng dụng bị đánh giá kém và **FAILED**.

## 1. UI/UX & Touch Ergonomics — Trải nghiệm di động
- **Kích thước vùng chạm (Touch Target):** Mọi nút bấm, icon có thể tương tác phải có kích thước tối thiểu **44x44 pt/dp**. Tuyệt đối không để nút quá nhỏ gây bấm nhầm.
- **Phản hồi tức thì (Feedback):** Mọi hành động chạm/bấm đều phải có phản hồi thị giác ngay lập tức (Ripple effect, đổi màu, animation co giãn nhẹ).
- **Xử lý Keyboard & Safe Area:** Luôn sử dụng `SafeArea` / `Scaffold` chuẩn để không bị tai thỏ (Notch) hoặc thanh điều hướng che khuất. Khi bàn phím hiện lên, input field phải tự động cuộn lên (Scroll into view).

## 2. State Management & Lifecycle — Quản lý trạng thái
- **Tuân thủ State Management chuẩn:** Dùng đúng kiến trúc được chọn của dự án (Bloc, Provider, Redux, ViewModel, MVVM...). KHÔNG trộn lẫn logic UI với business logic.
- **Luôn xử lý đủ 3 trạng thái của UI (3-State Rule):**
  1. **Loading State:** Khi đang gọi API hoặc xử lý nặng, phải hiển thị Skeleton loading hoặc Spinner.
  2. **Error State:** Khi lỗi mạng hoặc lỗi API, hiển thị thông báo thân thiện và có nút "Thử lại" (Retry).
  3. **Empty State:** Khi danh sách trống, hiển thị hình minh họa hoặc text giải thích, không để màn hình trắng trơn.
- **Quản lý Lifecycle & Memory:** Hủy bỏ (Dispose/Cancel) các Stream, Timer, AnimationController hoặc API Subscriptions khi rời khỏi màn hình để tránh rò rỉ bộ nhớ (Memory Leak).

## 3. Performance & Smoothness — Hiệu năng 60 FPS
- **Tránh Render thừa:** Không build lại toàn bộ màn hình khi chỉ thay đổi một component nhỏ. Sử dụng `const` constructors (trong Flutter) hoặc `React.memo` / `useCallback` (trong React Native) tối đa có thể.
- **Tối ưu Danh sách (List):** Với danh sách dài, BẮT BUỘC dùng cơ chế lazy loading (`ListView.builder`, `FlatList`, `RecyclerView`). Tuyệt đối không render toàn bộ list cùng một lúc trong bộ nhớ.
- **Tối ưu hình ảnh:** Nén ảnh, dùng định dạng WebP/AVIF, luôn dùng cache image (`CachedNetworkImage`, `FastImage`) và chỉ định kích thước hiển thị phù hợp.
