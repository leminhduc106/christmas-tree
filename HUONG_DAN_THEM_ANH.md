# 📸 Hướng Dẫn Thêm Ảnh Vào Gallery

## Bước 1: Chuẩn bị ảnh

1. Chọn 5 bức ảnh đẹp nhất của hai bạn
2. Đổi tên ảnh thành: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `photo4.jpg`, `photo5.jpg`
3. Để ảnh vào thư mục `images/` (đã tạo sẵn)

## Bước 2: Cập nhật HTML

Mở file `index.html` và tìm section `.gallery__slide`, thay thế phần placeholder bằng:

```html
<!-- Photo 1 -->
<div class="gallery__slide active">
  <div class="gallery__photo">
    <img src="/images/photo1.jpg" alt="Lần đầu gặp nhau" />
  </div>
  <p class="gallery__caption">Lần đầu gặp nhau...</p>
</div>

<!-- Photo 2 -->
<div class="gallery__slide">
  <div class="gallery__photo">
    <img src="/images/photo2.jpg" alt="Chuyến đi Đà Nẵng" />
  </div>
  <p class="gallery__caption">Chuyến đi Đà Nẵng đáng nhớ</p>
</div>

<!-- Photo 3 -->
<div class="gallery__slide">
  <div class="gallery__photo">
    <img src="/images/photo3.jpg" alt="Những nụ cười" />
  </div>
  <p class="gallery__caption">Những nụ cười rạng rỡ</p>
</div>

<!-- Photo 4 -->
<div class="gallery__slide">
  <div class="gallery__photo">
    <img src="/images/photo4.jpg" alt="Khoảnh khắc bình yên" />
  </div>
  <p class="gallery__caption">Khoảnh khắc bình yên</p>
</div>

<!-- Photo 5 -->
<div class="gallery__slide">
  <div class="gallery__photo">
    <img src="/images/photo5.jpg" alt="Cùng nhau" />
  </div>
  <p class="gallery__caption">Cùng nhau trong mọi hành trình</p>
</div>
```

## Bước 3: Tùy chỉnh caption (chú thích)

Thay đổi nội dung trong thẻ `<p class="gallery__caption">` để phù hợp với từng bức ảnh.

## Lưu ý:

- Ảnh nên có kích thước tối thiểu 800x600px để đẹp
- Định dạng: JPG, PNG, WEBP đều được
- Nếu muốn thêm/bớt ảnh:
  - Thêm/xóa `<div class="gallery__slide">` trong HTML
  - Thêm/xóa `<button class="gallery__dot">` tương ứng
  - Cập nhật `data-slide` attribute cho các dots

## Cách hoạt động:

✅ Click nút mũi tên ◀️ ▶️ để chuyển ảnh
✅ Click vào chấm tròn bên dưới để nhảy đến ảnh cụ thể  
✅ Vuốt trái/phải trên mobile
✅ Dùng phím mũi tên ⬅️ ➡️ trên desktop

Chúc bạn thành công! 💕
