"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();

  const tabs = [
    {
      href: "/dashboard",
      label: "สต็อก",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="3" y="3" width="8" height="8" rx="2"
            fill={active ? "var(--accent)" : "none"}
            stroke={active ? "var(--accent)" : "var(--text-secondary)"}
            strokeWidth="2"
          />
          <rect
            x="13" y="3" width="8" height="8" rx="2"
            fill={active ? "var(--accent)" : "none"}
            stroke={active ? "var(--accent)" : "var(--text-secondary)"}
            strokeWidth="2"
          />
          <rect
            x="3" y="13" width="8" height="8" rx="2"
            fill={active ? "var(--accent)" : "none"}
            stroke={active ? "var(--accent)" : "var(--text-secondary)"}
            strokeWidth="2"
          />
          <rect
            x="13" y="13" width="8" height="8" rx="2"
            fill="none"
            stroke={active ? "var(--accent)" : "var(--text-secondary)"}
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      href: "/report",
      label: "รายงาน",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 17H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"
            stroke={active ? "var(--accent)" : "var(--text-secondary)"}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="9" y="12" width="6" height="9" rx="1"
            fill={active ? "var(--accent-light)" : "none"}
            stroke={active ? "var(--accent)" : "var(--text-secondary)"}
            strokeWidth="2"
          />
          <path
            d="M9 7h6M9 10h4"
            stroke={active ? "var(--accent)" : "var(--text-secondary)"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          width: "100%",
          display: "flex",
        }}
      >
        {tabs.map((tab) => {
          const active = path === tab.href || (path === "/" && tab.href === "/dashboard");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "12px 0",
                color: active ? "var(--accent)" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                transition: "color 0.15s",
              }}
            >
              {tab.icon(active)}
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
