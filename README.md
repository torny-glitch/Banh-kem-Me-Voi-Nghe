# Tiệm bánh Mẹ Voi Nghé – Landing page bán bánh

Vite + React. Các file chính: `src/main.jsx` (giao diện + dữ liệu + giỏ hàng + thanh toán) và `src/style.css`.

## Chạy thử
```bash
npm install
npm run dev
```

## Build / deploy Vercel
```bash
npm run build   # ra thư mục dist
```
Đẩy lên GitHub rồi import vào Vercel (Framework: Vite, mặc định).

## Sửa thông tin
Mở `src/main.jsx`:
- `SHOP`: số điện thoại, Zalo, địa chỉ, giờ mở cửa, phí giao, tài khoản ngân hàng.
- `PRODUCTS`: 20 dòng bánh (tên, giá, mô tả). Giá tính bằng đồng.
- Dùng ảnh thật: thêm `img: '/images/ten-file.jpg'` vào sản phẩm, bỏ ảnh vào `public/images/`.

## Nhận đơn
Mặc định không có server: sau khi khách xác nhận, đơn hiện trên màn hình để khách gửi qua Zalo hoặc gọi tiệm.
Muốn nhận đơn tự động, dán URL Formspree / Google Apps Script / webhook vào `SHOP.orderEndpoint`
(trang sẽ POST JSON gồm `code`, `text`, `customer`, `total`).
