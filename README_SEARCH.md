# 🔍 Hướng dẫn test tính năng Search Bác sĩ

## 📋 Tình trạng hiện tại

Tính năng search bác sĩ trên banner đã được cập nhật với các tính năng sau:

### ✅ Đã hoàn thành:
- **Search real-time** với debounce 300ms
- **Dropdown kết quả** với thông tin bác sĩ
- **Fallback system** - sử dụng dữ liệu local nếu API không hoạt động
- **Sample data** - dữ liệu mẫu để test khi không có dữ liệu thật
- **Responsive design** cho mọi thiết bị
- **Navigation** đến trang chi tiết bác sĩ

### 🔧 Cách test:

#### 1. **Test với dữ liệu mẫu (Khuyến nghị):**
- Mở trang chủ
- Gõ các từ khóa sau trong thanh search:
  - `Nguyễn` → Hiển thị "Nguyễn Văn A"
  - `Trần` → Hiển thị "Trần Thị B"
  - `Lê` → Hiển thị "Lê Văn C"
  - `Phạm` → Hiển thị "Phạm Thị D"
  - `Tim` → Hiển thị bác sĩ chuyên khoa Tim mạch
  - `Da` → Hiển thị bác sĩ chuyên khoa Da liễu

#### 2. **Test với dữ liệu thật:**
- Đảm bảo backend đang chạy
- Kiểm tra console để xem dữ liệu bác sĩ được load
- Gõ tên bác sĩ có trong database

#### 3. **Test các tính năng:**
- **Click outside**: Click ra ngoài để đóng dropdown
- **ESC key**: Nhấn ESC để đóng dropdown
- **Enter key**: Nhấn Enter để chọn kết quả đầu tiên
- **Hover effects**: Di chuột qua các kết quả
- **Responsive**: Test trên mobile/tablet

### 🐛 Troubleshooting:

#### Nếu không tìm thấy bác sĩ:
1. **Kiểm tra console** để xem dữ liệu được load
2. **Kiểm tra network** để xem API calls
3. **Thử với dữ liệu mẫu** nếu không có dữ liệu thật

#### Nếu API không hoạt động:
- Tính năng sẽ tự động fallback về local search
- Sử dụng dữ liệu từ Redux store
- Hiển thị thông báo "Đang sử dụng dữ liệu mẫu"

#### Nếu không có dữ liệu trong Redux:
- Sử dụng dữ liệu mẫu có sẵn
- Hiển thị 4 bác sĩ mẫu để test

### 📱 Responsive Test:
- **Desktop**: Dropdown đầy đủ với avatar 40x40px
- **Tablet**: Avatar 35x35px, padding nhỏ hơn
- **Mobile**: Avatar 30x30px, compact design

### 🎯 Kết quả mong đợi:
1. Gõ từ khóa → Hiển thị dropdown với kết quả
2. Click vào bác sĩ → Chuyển đến `/doctor/detail-doctor/{id}`
3. Xem thông tin chi tiết bác sĩ
4. Có thể đặt lịch khám

### 🔄 Cập nhật trong tương lai:
- Kết nối với backend search API
- Thêm search theo chuyên khoa
- Thêm search theo địa chỉ
- Thêm filters nâng cao

---

**Lưu ý**: Tính năng này đã được thiết kế để hoạt động ngay cả khi backend chưa sẵn sàng, sử dụng dữ liệu mẫu và local search để đảm bảo trải nghiệm người dùng tốt. 