// หนองไม้งาม 2 e-Market — Supabase integration
// This file intentionally uses the public publishable key only.
// Never put SUPABASE_SECRET_KEY/service_role in browser code.

const SUPABASE_URL = 'https://udolsoroxlgyntlcntqp.supabase.co'
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_iJUWQnnOieflynFO1wWk7w_bNDcNszr'

let supabaseClient = null

async function getSupabase() {
  if (supabaseClient) return supabaseClient
  if (!window.supabase) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
      script.onload = resolve
      script.onerror = () => reject(new Error('โหลด Supabase SDK ไม่สำเร็จ'))
      document.head.appendChild(script)
    })
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  return supabaseClient
}

async function loadStoreProducts() {
  const sb = await getSupabase()
  const { data, error } = await sb
    .from('products')
    .select('id,name,description,price,image_url,stock,is_active,category_id,categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

async function loadStoreCategories() {
  const sb = await getSupabase()
  const { data, error } = await sb.from('categories').select('*').order('name')
  if (error) throw error
  return data || []
}

function makeOrderNumber() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replaceAll('-', '')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `NG2-${date}-${random}`
}

async function createStoreOrder({ customerName, customerPhone, fulfillmentMethod, items }) {
  if (!customerName || !items?.length) throw new Error('ข้อมูลคำสั่งซื้อไม่ครบ')
  const sb = await getSupabase()

  // The database function performs validation, row locking, stock decrement,
  // order creation and order-item creation in ONE PostgreSQL transaction.
  // This prevents overselling when multiple customers order simultaneously.
  const { data, error } = await sb.rpc('create_store_order_atomic', {
    p_customer_name: customerName,
    p_customer_phone: customerPhone || null,
    p_fulfillment_method: fulfillmentMethod || 'รับสินค้าที่โรงเรียน',
    p_items: items.map(item => ({
      product_id: item.product_id,
      quantity: Number(item.quantity)
    }))
  })

  if (error) {
    // Keep the customer-facing error concise while preserving the database message.
    throw new Error(error.message || 'ไม่สามารถสร้างคำสั่งซื้อได้')
  }

  const order = Array.isArray(data) ? data[0] : data
  if (!order) throw new Error('ระบบไม่พบข้อมูลคำสั่งซื้อหลังบันทึก')
  return order
}

async function findOrder(orderNumber) {
  const sb = await getSupabase()
  const { data: order, error } = await sb
    .from('orders')
    .select('id,order_number,customer_name,total_amount,status,fulfillment_method,created_at,updated_at')
    .eq('order_number', orderNumber.trim())
    .maybeSingle()
  if (error) throw error
  if (!order) return null

  const { data: items, error: itemError } = await sb
    .from('order_items')
    .select('product_name,price,quantity,subtotal')
    .eq('order_id', order.id)
  if (itemError) throw itemError
  return { ...order, items: items || [] }
}

window.NongMaiNgamSupabase = {
  getSupabase,
  loadStoreProducts,
  loadStoreCategories,
  createStoreOrder,
  findOrder,
  makeOrderNumber,
  url: SUPABASE_URL
}
