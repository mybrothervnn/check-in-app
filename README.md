# check-in-app

Bước 1: Quét mã QR & Nhận diện (Detection)
    1. Hành động: Khách hàng Quét mã QR (trên bàn).

    2. Hệ thống:

        A. Kiểm tra localStorage: Ứng dụng kiểm tra xem có thông tin khách hàng cũ nào được lưu không.

        B. Chuyển hướng: Tự động chuyển đến màn hình phù hợp (xem Bước 2).

Bước 2: Phân loại và Xử lý Check-in
    A: Khách Thân Thiết (Nhận diện)
        + Khách hàng: "Click nút ""Check-in"" (Hoặc tự động Check-in sau 2 giây)."
        + Hệ thống: "Lấy ID từ localStorage, Cộng 1 lượt check-in cho ID đó trên Server, trả về kết quả."
    B: Khách Mới/Khách Cũ (Xác thực):
        + Khách hàng: "Nhập Tên và 6 số cuối SĐT → Click ""Check-in""."
        + Hệ thống: 
            1. Tìm SĐT: Dùng 6 số cuối SĐT để tìm kiếm trên Server. 
            2. Phân loại: Nếu tìm thấy → Khách Cũ (Xác nhận SĐT đầy đủ nếu cần). Nếu KHÔNG tìm thấy → Khách Mới (Tạo ID mới). 3. Cộng 1 lượt check-in cho ID đó, Lưu localStorage cho lần sau."
Bước 3: Kết quả và Giao diện Tri ân (Unified Result View):
    Sau khi Server xác nhận Check-in thành công ở Bước 2 (A hoặc B), Khách hàng được chuyển đến Giao diện Chung này:
    1. Thông báo: "Chào mừng [Tên Khách hàng]! Bạn đã Check-in thành công."
    2. Xem Chỉ số: Hiển thị Tổng số lượt ghé thăm: [X] lần (và/hoặc điểm tích lũy).
    3. Quà tặng & Ưu đãi:
        - Hiển thị Danh sách/Lịch sử quà tặng đã đổi.
        - Khuyến nghị Đổi quà: "Bạn có đủ điểm/lượt để đổi [Tên Quà]! $\to$ Nút Đổi quà."
        - Mốc tiếp theo: "Bạn còn [Y] lượt nữa để nhận [Quà tặng tiếp theo]!"Lưu trữ thông tin: Đảm bảo hệ thống Lưu lại SĐT/ID vào localStorage để lần sau rơi vào luồng (A).Thoát: Nút "Đóng" hoặc "Xem Menu".
    4. Lưu trữ thông tin: Đảm bảo hệ thống Lưu lại SĐT/ID vào localStorage để lần sau rơi vào luồng (A).
    5. Thoát: Nút "Đóng" hoặc "Xem Menu".

Tối ưu hóa Logic cho "Khách cũ nhưng không lưu localStorage"
Để xử lý logic này như bạn đã đề xuất một cách tinh tế hơn:

Khi Khách nhập (Tên + 6 số cuối SĐT):

Hệ thống tìm thấy một ID khách hàng cũ khớp với SĐT đó.

Thay vì chỉ hiển thị kết quả, hệ thống nên có một thông báo nhỏ (hoặc làm nổi bật) sau khi check-in thành công:

"🎉 Chào mừng quay trở lại, [Tên]! Chúng tôi đã tìm thấy bạn! Lượt Check-in của bạn đã được cộng dồn (Tổng: [X] lượt)."

Việc này giúp khách hàng cảm thấy được nhận diện và được trân trọng, dù họ đã quên/xóa localStorage của mình.



- Tạo mã QR
- Sau khi Khách hàng quét mã QR: 
1. Trang chủ: 
    Hiển thị Menu
    Chào mừng bạn đến với Phở Hưng! Check-in nhanh để tích lũy lượt ghé thăm và nhận quà bất ngờ!
Dialog Check-in: ( Ngay trên đầu Menu) 
    + phần tên khách hàng: 
        - Nếu là khách cũ, hệ thống có thể ghi nhớ thông tin (dùng Cookie/Local Storage) và chỉ cần khách nhấn nút "Check-in" (Hiển thị: "Chào mừng [Tên] trở lại! Nhấn để Check-in.").
        Khi khách hàng check-in và đạt mốc, hệ thống sẽ ngay lập tức hiển thị thông báo "Chúc mừng bạn! Bạn vừa đạt mốc 5 lần ghé thăm và nhận được Voucher Giảm 10% cho hóa đơn này. Nhấn để sử dụng."

         - Nếu là khách mới, yêu cầu nhập Tên và 6 số cuối SĐT.

2. Giao diện "My Rewards": Tạo một trang đơn giản để khách hàng xem:
"Số lần ghé thăm của bạn: [X]"
"Bạn còn [Y] lần nữa để đạt mốc tiếp theo!"

3. Trang cấu hình (Yêu cầu Đăng nhập)



AI TÓM TẮT: 
1. Trang Chủ (Home Page)
    Header hiển thị logo "🍲 Phở Hưng" với nút "Check-in ngay"
    Phần chào mừng với thông điệp khuyến khích check-in
    Menu hiển thị 4 món ăn đặc trưng với giá
    Phần hiển thị thông tin khách hàng (nếu đã check-in)
    Quick actions cho "My Rewards" và "Cấu hình"
2. Dialog Check-in
    Cho khách cũ: Hiển thị "Chào mừng [Tên] trở lại!" + nút "Check-in"
    Cho khách mới: Form nhập tên và 6 số cuối SĐT
    Hỗ trợ lưu trữ dữ liệu khách hàng qua localStorage
    Hiển thị thông báo reward khi đạt mốc (5, 10, 15, 20 lần)
3. Customer Service
    Quản lý thông tin khách hàng (tên, số điện thoại, số lần ghé thăm)
    Hỗ trợ mốc thưởng (Milestone rewards)
    Tính toán số lần còn lại để đạt mốc tiếp theo
    Sinh tạo thông báo reward tự động
4. Giao diện (UI)
    Thiết kế responsive, thích hợp cho mobile
    Màu sắc chủ đạo: đỏ (#d9534f) - phù hợp với nhà hàng phở
    Animacje mượt mà và tương tác người dùng tốt
    Tiến độ (progress bar) hiển thị tiến triển đến mốc tiếp theo
5. Hoạt động chính
    Nhấn "Check-in ngay" → Mở dialog check-in
    Khách mới: Nhập tên + SĐT → Lưu vào localStorage → Check-in
    Khách cũ: Hiển thị tên → Nhấn "Check-in"
    Khi đạt mốc: Hiển thị thông báo reward
    Xem thông tin số lần ghé thăm và tiến độ