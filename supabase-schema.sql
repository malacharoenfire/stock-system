-- ============================================================
-- Stock Counter App - Supabase Schema
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New query
-- ============================================================

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id   BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- 2. Stock logs table
CREATE TABLE IF NOT EXISTS stock_logs (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty         INTEGER NOT NULL DEFAULT 0,
  stock_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast date-based queries
CREATE INDEX IF NOT EXISTS idx_stock_logs_date       ON stock_logs(stock_date DESC);
CREATE INDEX IF NOT EXISTS idx_stock_logs_product    ON stock_logs(product_id);

-- 3. Seed sample products (optional - delete if not needed)
INSERT INTO products (name) VALUES
  ('น้ำดื่ม 600ml'),
  ('ขนมปัง'),
  ('นมกล่อง'),
  ('โกโก้'),
  ('ชาเขียว')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Enable Row Level Security (RLS) - public read/write (no auth)
-- ============================================================
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations without login
CREATE POLICY "public_products"   ON products   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_stock_logs" ON stock_logs FOR ALL USING (true) WITH CHECK (true);
