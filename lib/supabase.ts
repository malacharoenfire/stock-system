import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
}

export interface StockLog {
  id: number;
  product_id: number;
  qty: number;
  stock_date: string;
  created_at: string;
}

export interface StockLogWithProduct extends StockLog {
  products: { name: string };
}

export interface DailySummary {
  stock_date: string;
  items: { product_name: string; qty: number }[];
  total: number;
}
