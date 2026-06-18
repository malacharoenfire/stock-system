import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/stock-logs?date=YYYY-MM-DD  (optional filter)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  let query = supabase
    .from("stock_logs")
    .select("*, products(name)")
    .order("stock_date", { ascending: false })
    .order("id", { ascending: false });

  if (date) {
    query = query.eq("stock_date", date);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/stock-logs — save daily stock
// Body: { items: [{product_id, qty}[], stock_date?: string }
export async function POST(req: Request) {
  const body = await req.json();
  const { items, stock_date } = body as {
    items: { product_id: number; qty: number }[];
    stock_date?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "ไม่มีข้อมูลสินค้า" }, { status: 400 });
  }

  const today = stock_date ?? new Date().toISOString().split("T")[0];

  // Upsert: if same product + date exists, update qty
  const rows = items.map((item) => ({
    product_id: item.product_id,
    qty: item.qty,
    stock_date: today,
  }));

  const { data, error } = await supabase
    .from("stock_logs")
    .upsert(rows, {
      onConflict: "product_id,stock_date",
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    // fallback: insert without upsert constraint
    const { data: inserted, error: err2 } = await supabase
      .from("stock_logs")
      .insert(rows)
      .select();

    if (err2) {
      return NextResponse.json({ error: err2.message }, { status: 500 });
    }
    return NextResponse.json(inserted, { status: 201 });
  }

  return NextResponse.json(data, { status: 201 });
}
