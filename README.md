# 📦 Stock Counter App

ระบบนับสต็อกสินค้าแบบง่าย สร้างด้วย **Next.js 15** + **Supabase**

---

## 🚀 วิธีติดตั้ง

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า Supabase

1. ไปที่ [supabase.com](https://supabase.com) → สร้าง Project ใหม่
2. ไปที่ **SQL Editor** → New Query
3. วาง SQL จากไฟล์ `supabase-schema.sql` แล้วกด **Run**

### 3. ตั้งค่า Environment Variables

แก้ไขไฟล์ `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

ดู URL และ Key ได้จาก:
**Supabase Dashboard → Project Settings → API**

### 4. รันโปรเจกต์

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

---

## 📱 ฟีเจอร์

| หน้า | ฟีเจอร์ |
|------|---------|
| **Dashboard** | นับสต็อก + / − แต่ละสินค้า, พิมพ์ตัวเลขตรง, เพิ่มสินค้าใหม่, บันทึกยอดประจำวัน |
| **Report** | ดูยอดย้อนหลังตามวัน, แสดงยอดรวมทั้งหมด, กดขยายดูรายการแต่ละวัน |

---

## 🗄️ โครงสร้าง Database

```sql
-- สินค้า
products (id, name)

-- บันทึกสต็อกรายวัน
stock_logs (id, product_id, qty, stock_date, created_at)
```

---

## 📁 โครงสร้างโปรเจกต์

```
stock-app/
├── app/
│   ├── layout.tsx          # Root layout + BottomNav
│   ├── page.tsx            # Redirect → /dashboard
│   ├── globals.css         # Global styles + CSS variables
│   ├── dashboard/
│   │   ├── page.tsx        # หน้านับสต็อก
│   │   └── dashboard.module.css
│   ├── report/
│   │   ├── page.tsx        # หน้ารายงาน
│   │   └── report.module.css
│   └── api/
│       ├── products/
│       │   └── route.ts    # GET, POST products
│       └── stock-logs/
│           └── route.ts    # GET, POST stock_logs
├── components/
│   └── BottomNav.tsx       # Tab bar navigation
├── lib/
│   └── supabase.ts         # Supabase client + types
├── supabase-schema.sql     # SQL สำหรับสร้าง tables
└── .env.local              # Environment variables
```

---

## 🌐 Deploy บน Vercel

```bash
npm install -g vercel
vercel
```

ตั้งค่า Environment Variables บน Vercel Dashboard ด้วย key เดียวกับ `.env.local`
