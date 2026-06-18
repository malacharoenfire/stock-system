"use client";

import { useEffect, useState } from "react";
import styles from "./report.module.css";

interface StockItem {
  product_name: string;
  qty: number;
}

interface DayGroup {
  date: string;
  items: StockItem[];
  total: number;
}

function formatDateThai(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("th-TH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReportPage() {
  const [groups, setGroups] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/stock-logs");
        if (!res.ok) throw new Error();
        const data: {
          product_id: number;
          qty: number;
          stock_date: string;
          products: { name: string };
        }[] = await res.json();

        // Group by stock_date
        const map = new Map<string, StockItem[]>();
        for (const row of data) {
          if (!map.has(row.stock_date)) map.set(row.stock_date, []);
          map.get(row.stock_date)!.push({
            product_name: row.products?.name ?? "–",
            qty: row.qty,
          });
        }

        const result: DayGroup[] = Array.from(map.entries())
          .map(([date, items]) => ({
            date,
            items,
            total: items.reduce((s, i) => s + i.qty, 0),
          }))
          .sort((a, b) => (a.date < b.date ? 1 : -1));

        setGroups(result);
        if (result.length > 0) setExpanded(result[0].date);
      } catch {
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const grandTotal = groups.reduce((s, g) => s + g.total, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>รายงาน</h1>
        {!loading && groups.length > 0 && (
          <div className={styles.summaryBadge}>
            <span className={styles.summaryNum}>{grandTotal.toLocaleString()}</span>
            <span className={styles.summaryLabel}>รวมทั้งหมด</span>
          </div>
        )}
      </header>

      {error && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      <div className={styles.content}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))
        ) : groups.length === 0 ? (
          <div className={styles.empty}>
            <span style={{ fontSize: 48 }}>📊</span>
            <p>ยังไม่มีข้อมูล</p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              บันทึกยอดจากหน้าสต็อกก่อน
            </p>
          </div>
        ) : (
          groups.map((group) => {
            const open = expanded === group.date;
            return (
              <div key={group.date} className={styles.dayCard}>
                <button
                  className={styles.dayHeader}
                  onClick={() => setExpanded(open ? null : group.date)}
                >
                  <div>
                    <span className={styles.dayDate}>{formatDateThai(group.date)}</span>
                    <span className={styles.dayCount}>
                      {group.items.length} รายการ
                    </span>
                  </div>
                  <div className={styles.dayRight}>
                    <span className={styles.dayTotal}>
                      {group.total.toLocaleString()}
                    </span>
                    <span
                      className={styles.chevron}
                      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {open && (
                  <div className={styles.itemList}>
                    {group.items.map((item, i) => (
                      <div key={i} className={styles.itemRow}>
                        <span className={styles.itemName}>{item.product_name}</span>
                        <span className={styles.itemQty}>
                          {item.qty.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className={styles.subtotalRow}>
                      <span>รวมวันนี้</span>
                      <span>{group.total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
