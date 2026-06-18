import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "สต็อกสินค้า",
  description: "ระบบนับสต็อกสินค้าแบบง่าย",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <main
          style={{
            maxWidth: 480,
            margin: "0 auto",
            minHeight: "100dvh",
            paddingBottom: 80,
          }}
        >
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
