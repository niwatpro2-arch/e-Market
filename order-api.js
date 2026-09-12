window.NongMaiNgamOrderAPI={
  async create(payload){
    const r=await fetch('https://udolsoroxlgyntlcntqp.supabase.co/functions/v1/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json(); if(!r.ok) throw new Error(data.error||'สร้างออเดอร์ไม่สำเร็จ'); return data;
  },
  async track(orderNumber,customerPhone){
    const r=await fetch('https://udolsoroxlgyntlcntqp.supabase.co/functions/v1/track-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderNumber,customerPhone})});
    const data=await r.json(); if(!r.ok) throw new Error(data.error||'ไม่พบออเดอร์'); return data;
  }
};
