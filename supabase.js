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
  const productIds = items.map(i => i.product_id)
  const { data: products, error: productsError } = await sb
    .from('products')
    .select('id,name,price,stock,is_active')
    .in('id', productIds)
  if (productsError) throw productsError

  const byId = new Map((products || []).map(p => [p.id, p]))
  let total = 0
  const normalized = items.map(item => {
    const p = byId.get(item.product_id)
    if (!p || !p.is_active) throw new Error('มีสินค้าที่ไม่พร้อมจำหน่าย')
    if (item.quantity < 1 || item.quantity > p.stock) throw new Error(`สินค้า ${p.name} มีจำนวนไม่เพียงพอ`)
    total += Number(p.price) * Number(item.quantity)
    return { product_id: p.id, product_name: p.name, price: p.price, quantity: item.quantity }
  })

  const { data: order, error: orderError } = await sb
    .from('orders')
    .insert({
      order_number: makeOrderNumber(),
      customer_name: customerName,
      customer_phone: customerPhone || null,
      fulfillment_method: fulfillmentMethod || 'รับสินค้าที่โรงเรียน',
      total_amount: total,
      status: 'pending'
    })
    .select('id,order_number,total_amount,status,created_at')
    .single()
  if (orderError) throw orderError

  const { error: itemsError } = await sb
    .from('order_items')
    .insert(normalized.map(i => ({ ...i, order_id: order.id })))
  if (itemsError) throw itemsError

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
