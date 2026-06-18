"use client";

import { useEffect, useState, useCallback } from "react";
import type { Product } from "@/lib/supabase";
import styles from "./dashboard.module.css";

interface CountMap {
  [productId: number]: number;
}

function todayThai() {
  return new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [counts, setCounts] = useState<CountMap>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [stockDate, setStockDate] = useState(
  new Date().toISOString().split("T")[0]
);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data: Product[] = await res.json();
      setProducts(data);
      setCounts((prev) => {
        const next: CountMap = {};
        data.forEach((p) => {
          next[p.id] = prev[p.id] ?? 0;
        });
        return next;
      });
    } catch {
      setError("โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรช");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function adjust(id: number, delta: number) {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
    setSaved(false);
  }

  function setExact(id: number, val: string) {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setCounts((prev) => ({ ...prev, [id]: num }));
      setSaved(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const items = products.map((p) => ({
        product_id: p.id,
        qty: counts[p.id] ?? 0,
      }));
      const res = await fetch("/api/stock-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  stock_date: stockDate,
  items,
}),
      });
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddProduct() {
    if (!newProductName.trim()) return;
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProductName }),
      });
      if (!res.ok) throw new Error();
      setNewProductName("");
      setAddingProduct(false);
      fetchProducts();
    } catch {
      setError("เพิ่มสินค้าไม่สำเร็จ");
    }
  }

  const totalQty = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>นับสต็อก</h1>
        <p className={styles.date}>
  {new Date(stockDate).toLocaleDateString("th-TH")}
</p>
        </div>
        <div className={styles.totalBadge}>
          <span className={styles.totalNum}>{totalQty}</span>
          <span className={styles.totalLabel}>รวม</span>
        </div>
      </header>
      <div style={{
  background:"#fff",
  padding:"12px",
  borderRadius:"12px",
  marginBottom:"16px"
}}>
  <label style={{display:"block",marginBottom:"6px"}}>
    📅 วันที่นับสต็อก
  </label>

  <input
    type="date"
    value={stockDate}
    onChange={(e) => setStockDate(e.target.value)}
    style={{
      width:"100%",
      padding:"10px",
      border:"1px solid #ddd",
      borderRadius:"8px"
    }}
  />
</div>

      {/* Error */}
      {error && (
        <div className={styles.errorBanner}>
          {error}
          <button onClick={() => setError("")} className={styles.dismissBtn}>✕</button>
        </div>
      )}

      {/* Product list */}
      <div className={styles.list}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <span style={{ fontSize: 48 }}>📦</span>
            <p>ยังไม่มีสินค้า</p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              กดปุ่ม + เพิ่มสินค้าด้านล่าง
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className={styles.card}>
              <span className={styles.productName}>{product.name}</span>
              <div className={styles.counter}>
                <button
                  className={`${styles.counterBtn} ${styles.minus}`}
                  onClick={() => adjust(product.id, -1)}
                  disabled={counts[product.id] === 0}
                  aria-label="ลด"
                >
                  −
                </button>
                <input
                  type="number"
                  className={styles.counterInput}
                  value={counts[product.id] ?? 0}
                  onChange={(e) => setExact(product.id, e.target.value)}
                  min={0}
                  inputMode="numeric"
                />
                <button
                  className={`${styles.counterBtn} ${styles.plus}`}
                  onClick={() => adjust(product.id, 1)}
                  aria-label="เพิ่ม"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add product modal */}
      {addingProduct && (
        <div className={styles.overlay} onClick={() => setAddingProduct(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>เพิ่มสินค้าใหม่</h2>
            <input
              autoFocus
              className={styles.modalInput}
              type="text"
              placeholder="ชื่อสินค้า..."
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => {
                  setAddingProduct(false);
                  setNewProductName("");
                }}
              >
                ยกเลิก
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleAddProduct}
                disabled={!newProductName.trim()}
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className={styles.actions}>
        <button
          className={styles.addBtn}
          onClick={() => setAddingProduct(true)}
          aria-label="เพิ่มสินค้า"
        >
          + สินค้า
        </button>
        <button
          className={`${styles.saveBtn} ${saved ? styles.savedBtn : ""}`}
          onClick={handleSave}
          disabled={saving || products.length === 0}
        >
          {saving ? "กำลังบันทึก..." : saved ? "✓ บันทึกแล้ว" : "บันทึกยอดวันนี้"}
        </button>
      </div>
    </div>
  );
}
