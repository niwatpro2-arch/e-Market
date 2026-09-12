# หนองไม้งาม 2 e-Market + Supabase

Supabase project: `udolsoroxlgyntlcntqp`

Project URL: https://udolsoroxlgyntlcntqp.supabase.co

## Database

Created tables:

- `categories`
- `products`
- `profiles`
- `orders`
- `order_items`

RLS is enabled on every public table. Security advisor currently reports no security lints.

## Browser integration

`supabase.js` contains the browser-side integration and uses the Supabase **publishable** key only. This is safe to expose to the browser when RLS is correctly configured.

Do **not** add `SUPABASE_SECRET_KEY`, `service_role`, database passwords, or other secrets to this repository.

## Existing MVP

The current `index.html` is a static HTML MVP and still uses localStorage for its existing shopping UI. `supabase.js` is the new database integration layer. The next frontend step is to wire the existing product rendering and checkout functions to `NongMaiNgamSupabase.loadStoreProducts()` and `NongMaiNgamSupabase.createStoreOrder()`.

## Order status

- `pending` — รอรับคำสั่งซื้อ
- `confirmed` — ยืนยันคำสั่งซื้อ
- `preparing` — กำลังเตรียมสินค้า
- `ready` — พร้อมรับสินค้า
- `completed` — รับสินค้าแล้ว
- `cancelled` — ยกเลิก

## Important

For Next.js SSR, use `@supabase/ssr` with cookie-based sessions. `@supabase/server` is for stateless header-based backend authentication and is not a replacement for `@supabase/ssr` in Next.js SSR.
