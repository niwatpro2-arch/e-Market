# หนองไม้งาม 2 e-Market

ระบบร้านค้าออนไลน์สำหรับโรงเรียนบ้านหนองไม้งาม 2

## พร้อมใช้งานจริง
- หน้าร้าน Responsive + ฟอนต์ Kanit + ธีมส้ม
- ใช้ Supabase Database จริง
- โหลดสินค้าและหมวดหมู่จากฐานข้อมูล
- รถเข็นทำงานในเบราว์เซอร์ และคำสั่งซื้อถูกบันทึกลงฐานข้อมูลจริง
- ตัดสต็อกแบบ Atomic Transaction ป้องกัน overselling เมื่อหลายคนสั่งพร้อมกัน
- ตรวจสอบราคา/สต็อกใน PostgreSQL ก่อนบันทึกคำสั่งซื้อ
- หลังบ้านใช้ Supabase Auth และ `profiles.role = admin`
- Dashboard ยอดขายและออเดอร์
- จัดการคำสั่งซื้อและเปลี่ยนสถานะ
- จัดการสินค้า เพิ่ม/แก้ไข ราคา สต็อก เปิด/ปิดขาย
- จัดการหมวดหมู่สินค้า
- อัปโหลดรูปสินค้าเข้า Supabase Storage (`product-images`)
- หน้าติดตามออเดอร์ยืนยันด้วยเลขออเดอร์ + เบอร์โทรศัพท์ เพื่อไม่เปิดเผยข้อมูลออเดอร์จากการเดาเลขอย่างเดียว

## หน้าใช้งาน
- `index.html` → จุดเข้าเว็บร้านค้า
- `shop-supabase.html` → หน้าร้านที่เชื่อมฐานข้อมูลจริง
- `tracking.html` → ติดตามออเดอร์
- `admin-supabase.html` → ระบบหลังบ้าน

## Supabase
Project ref: `udolsoroxlgyntlcntqp`

ตาราง:
- `categories`
- `products`
- `profiles`
- `orders`
- `order_items`

Edge Function:
- `track-order` → ตรวจเลขออเดอร์ร่วมกับเบอร์โทรศัพท์ก่อนส่งข้อมูลกลับ

Storage:
- `product-images` → รูปสินค้า ขนาดสูงสุด 5MB รองรับ JPG/PNG/WebP

เปิด RLS สำหรับข้อมูลใน `public` และใช้ publishable key ฝั่ง browser เท่านั้น ห้ามใส่ secret/service_role key ใน GitHub

## ผู้ดูแลระบบ
บัญชีผู้ดูแลต้องสร้างผ่าน Supabase Auth และมีแถวใน `profiles` ที่ `role = 'admin'`

## ความปลอดภัย
ห้าม commit:
- Supabase secret key
- service_role key
- database password
- access token หรือ credentials ใด ๆ

## งานต่อยอดที่แนะนำ
1. แจ้งเตือนออเดอร์ใหม่ให้ผู้ดูแล
2. QR Payment และระบบยืนยันการชำระเงิน
3. รายงานยอดขายรายวัน/เดือน และ export CSV
4. ระบบสมาชิกสำหรับนักเรียน/ผู้ปกครอง
