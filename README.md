# หนองไม้งาม 2 e-Market

ระบบร้านค้าออนไลน์สำหรับโรงเรียนบ้านหนองไม้งาม 2

## สถานะปัจจุบัน
- หน้าร้าน Responsive + ฟอนต์ Kanit
- ใช้ Supabase Database จริง
- โหลดสินค้าและหมวดหมู่จากฐานข้อมูล
- รถเข็นเก็บในเบราว์เซอร์ แต่คำสั่งซื้อถูกบันทึกลง Supabase จริง
- ตรวจสอบ stock และราคาจากฐานข้อมูลก่อนสร้างคำสั่งซื้อ
- สร้างเลขคำสั่งซื้อรูปแบบ `NG2-YYYYMMDD-XXXX`
- หน้าติดตามคำสั่งซื้อ `tracking.html` อ่านสถานะจาก Supabase จริง
- หลังบ้าน `admin-supabase.html` ใช้ Supabase Auth และตรวจ role `admin`
- ผู้ดูแลสามารถเปลี่ยนสถานะคำสั่งซื้อได้

## Supabase
Project ref: `udolsoroxlgyntlcntqp`

ตารางที่ใช้งาน:
- `categories`
- `products`
- `profiles`
- `orders`
- `order_items`

เปิด RLS ครบทุกตารางใน `public` และใช้ publishable key ฝั่ง browser เท่านั้น ห้ามใส่ secret/service_role key ใน GitHub

## หน้าใช้งาน
- `index.html` → จุดเข้าเว็บร้านค้า และเปิด storefront ที่เชื่อม Supabase
- `shop-supabase.html` → หน้าร้านที่เชื่อมฐานข้อมูลจริง
- `tracking.html` → ติดตามออเดอร์
- `admin-supabase.html` → หลังบ้านผู้ดูแล

## การเป็นผู้ดูแลระบบ
ต้องสร้างผู้ใช้ผ่าน Supabase Auth ก่อน และกำหนด `profiles.role` ของผู้ใช้นั้นเป็น `admin` เพื่อให้หน้า `admin-supabase.html` ผ่านการตรวจสิทธิ์

## ความปลอดภัย
ห้าม commit:
- Supabase secret key
- service_role key
- database password
- access token หรือ credentials ใด ๆ

## การพัฒนาต่อ
1. จัดการสินค้า/หมวดหมู่จากหลังบ้าน
2. ตัดสต็อกแบบ atomic transaction เมื่อสั่งซื้อ
3. Dashboard ยอดขาย
4. แจ้งเตือนคำสั่งซื้อใหม่
5. QR Payment และตรวจสอบการชำระเงิน
