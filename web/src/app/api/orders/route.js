import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const { order, products, analytics = {} } = payload;
  if (!order?.code || !Array.isArray(products)) {
    return NextResponse.json({ error: "missing order" }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({
      simulated: true,
      code: order.code,
      user_pseudo_id: analytics.user_pseudo_id ?? null,
    });
  }

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      order_id: order.code,
      code: order.code,
      user_id: order.email || "anon",
      user_pseudo_id: analytics.user_pseudo_id ?? null,
      session_id: analytics.session_id ?? null,
      created_at: order.createdAt,
      value_simulated: order.value,
      items_count: order.items,
      coupon: order.coupon ?? null,
      utm_campaign: order.campaign ?? null,
      platform: "web",
      status: "confirmed",
    }),
  });
  if (!res.ok) return NextResponse.json({ error: `orders ${res.status}` }, { status: 502 });

  const itemsRes = await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
    method: "POST",
    headers,
    body: JSON.stringify(
      products.map((p) => ({
        order_id: order.code,
        sku: p.sku,
        name: p.name,
        category: p.category,
        price: p.price,
        qty: p.qty,
      })),
    ),
  });
  if (!itemsRes.ok) return NextResponse.json({ error: `items ${itemsRes.status}` }, { status: 502 });

  return NextResponse.json({ code: order.code });
}
