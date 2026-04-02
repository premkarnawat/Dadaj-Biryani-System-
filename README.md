# 🍛 DADAJ BIRYANI – Full-Stack Food Ordering App

A **production-ready, premium food ordering web application** for the DADAJ BIRYANI brand — built with a modern stack similar to Zomato/Swiggy but focused on a single luxury biryani brand.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Razorpay Setup](#razorpay-setup)
- [Deployment Guide](#deployment-guide)
- [API Reference](#api-reference)
- [Admin Panel](#admin-panel)

---

## 🧱 Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend     | Next.js 14, TypeScript, Tailwind CSS |
| Animations   | Framer Motion                       |
| State        | Zustand (cart + auth)               |
| Backend      | Node.js + Express.js                |
| Database     | Supabase (PostgreSQL)               |
| Auth         | Supabase Auth (OTP / Magic Link)    |
| Realtime     | Supabase Realtime + Socket.io       |
| Payments     | Razorpay                            |
| Maps         | Google Maps API                     |
| Email        | Nodemailer (SMTP)                   |
| Frontend CDN | Vercel                              |
| Backend Host | Render                              |

---

## ✨ Features

### 👤 User
- 🔐 OTP-based email login (no password needed)
- 🏠 Hero section with rotating dish animations (Framer Motion)
- 🎠 Auto-playing offer banners
- 🍛 Dish listing with search, category, veg filter, sorting
- 🍗 Dish detail with add-ons & customization
- 🛒 Animated cart drawer (Zustand persisted)
- 🎟️ Coupon/discount system
- 💳 Razorpay payment (UPI, Card, COD)
- 📦 Real-time order tracking (6 status steps)
- 💬 Support chat with bot responses
- 👤 Profile, order history, saved addresses
- 📱 Mobile-first with bottom navigation
- 🔔 Email notifications (order placed, dispatched, delivered)

### 🧑‍💼 Admin
- 📊 Dashboard (revenue, orders, users)
- 📦 Order management (update status with 1 click)
- 🍛 Product CRUD (add/edit/delete dishes)
- 🏷️ Coupon management
- 👥 User management
- 💬 Support chat management

---

## 📁 Project Structure

```
dadaj-biryani/
├── frontend/                    # Next.js 14 App
│   ├── app/
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Root layout
│   │   ├── auth/page.tsx        # OTP Login
│   │   ├── dishes/
│   │   │   ├── page.tsx         # Dish listing
│   │   │   └── [id]/page.tsx    # Dish detail
│   │   ├── cart/page.tsx        # Cart + Checkout
│   │   ├── order/success/       # Order confirmation
│   │   ├── tracking/page.tsx    # Live order tracking
│   │   ├── profile/page.tsx     # User profile
│   │   ├── help/page.tsx        # Support chat
│   │   └── admin/               # Admin panel
│   ├── components/
│   │   ├── layout/              # TopNav, BottomNav
│   │   ├── home/                # Hero, Banner, Categories, Bestsellers
│   │   ├── dishes/              # DishCard
│   │   └── cart/                # CartDrawer
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client + types
│   │   ├── api.ts               # Axios API client
│   │   └── utils.ts             # Helpers
│   └── store/
│       ├── cartStore.ts         # Zustand cart store
│       └── authStore.ts         # Zustand auth store
│
├── backend/                     # Express.js API
│   ├── index.js                 # Entry point + Socket.io
│   ├── middleware/
│   │   └── auth.js              # JWT + Supabase auth
│   ├── routes/
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   ├── coupons.js
│   │   ├── payment.js           # Razorpay integration
│   │   ├── addresses.js
│   │   ├── chat.js
│   │   ├── cart.js
│   │   └── admin.js             # Admin CRUD APIs
│   └── lib/
│       ├── supabase.js          # Supabase service client
│       └── email.js             # Nodemailer
│
└── docs/
    └── supabase-schema.sql      # Full DB schema + seed data
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free)
- Razorpay account (test mode free)

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

Fill in the values (see [Environment Variables](#environment-variables) section).

### 3. Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor**
3. Paste and run the contents of `docs/supabase-schema.sql`
4. This creates all tables, RLS policies, realtime subscriptions, and seed data

### 4. Run Locally

```bash
# Terminal 1 – Backend
cd backend
npm run dev
# Runs on http://localhost:4000

# Terminal 2 – Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## 🔑 Environment Variables

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Backend (`backend/.env`)

```env
PORT=4000
NODE_ENV=development

SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...  # service_role key

JWT_SECRET=your-very-long-secret-key-at-least-32-chars

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

FRONTEND_URL=http://localhost:3000
```

---

## 🗄️ Supabase Setup

### Step-by-Step

1. **Create Project**: [app.supabase.com](https://app.supabase.com) → New Project → Choose region closest to your users

2. **Get Keys**: Settings → API
   - `Project URL` → `SUPABASE_URL`
   - `anon / public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY` (keep secret!)

3. **Run Schema**: SQL Editor → New Query → Paste `docs/supabase-schema.sql` → Run

4. **Configure Auth**:
   - Authentication → Settings → Email Auth → Enable
   - Set Site URL to your frontend URL
   - Optionally enable magic link / OTP

5. **Enable Realtime**:
   - Database → Replication → `supabase_realtime` publication
   - Enable for: `orders`, `order_status_logs`, `delivery_tracking`, `chat_messages`

---

## 💳 Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys → Generate Test Keys
3. Add `Key ID` and `Key Secret` to env files
4. For production: Complete KYC and get live keys

**Test Cards:**
| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4111 1111 1111 1111 | Any | Any future | Success |
| 5267 3181 8797 5449 | Any | Any future | Success |

**Test UPI:** `success@razorpay`

---

## 🌐 Deployment Guide

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables → Add all from .env.local
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Backend → Render

1. Push backend folder to GitHub
2. [render.com](https://render.com) → New → Web Service
3. Connect your repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node 18
5. Add all environment variables from `backend/.env`
6. Deploy → Copy the URL → Set as `NEXT_PUBLIC_BACKEND_URL`

### Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_BACKEND_URL` in Vercel with Render URL
- [ ] Update `FRONTEND_URL` in Render with Vercel URL
- [ ] Update Supabase Auth → Site URL with production frontend URL
- [ ] Add production domain to Supabase allowed URLs
- [ ] Test payment flow with Razorpay test keys
- [ ] Switch to Razorpay live keys for production

---

## 📡 API Reference

### Base URL
- Development: `http://localhost:4000`
- Production: `https://dadaj-biryani-api.onrender.com`

### Authentication
All protected endpoints require: `Authorization: Bearer <supabase_access_token>`

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Health check |
| GET | `/products` | ❌ | List products |
| GET | `/products/bestsellers` | ❌ | Bestseller products |
| GET | `/products/:id` | ❌ | Single product |
| GET | `/categories` | ❌ | All categories |
| POST | `/apply-coupon` | ❌ | Validate & apply coupon |
| POST | `/order/create` | ✅ | Create new order |
| GET | `/order/my-orders` | ✅ | User's order history |
| GET | `/order/:id` | ✅ | Single order details |
| PUT | `/order/status/update` | ✅ | Update order status |
| GET | `/addresses` | ✅ | User's addresses |
| POST | `/addresses` | ✅ | Add address |
| PUT | `/addresses/:id` | ✅ | Update address |
| DELETE | `/addresses/:id` | ✅ | Delete address |
| GET | `/chat/messages` | ✅ | Chat history |
| POST | `/chat/send` | ✅ | Send message |
| POST | `/payment/create-order` | ✅ | Create Razorpay order |
| POST | `/payment/verify` | ✅ | Verify payment |
| POST | `/admin/login` | ❌ | Admin login |
| GET | `/admin/dashboard` | 🔐Admin | Dashboard stats |
| GET | `/admin/orders` | 🔐Admin | All orders |
| PUT | `/admin/orders/:id/status` | 🔐Admin | Update order status |
| POST | `/admin/products` | 🔐Admin | Add product |
| PUT | `/admin/products/:id` | 🔐Admin | Update product |
| DELETE | `/admin/products/:id` | 🔐Admin | Delete product |
| POST | `/admin/coupons` | 🔐Admin | Create coupon |
| GET | `/admin/users` | 🔐Admin | All users |
| GET | `/admin/chat` | 🔐Admin | All chat messages |

---

## 🧑‍💼 Admin Panel

### Access
Navigate to `/admin` in the frontend.

### Default Admin Account
Create via the SQL Editor:

```sql
INSERT INTO public.admin_users (email, name, password_hash) VALUES (
  'admin@dadajbiryani.com',
  'Admin',
  -- Run: require('bcryptjs').hashSync('yourpassword', 10)
  '$2a$10$GENERATED_HASH_HERE'
);
```

Or via Node.js:
```js
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('Admin@123', 10));
```

### Admin Features
- 📊 Live dashboard with revenue & order metrics
- 📦 Update order status (PLACED → ACCEPTED → PREPARING → PICKED → ON THE WAY → DELIVERED)
- 🍛 Add, edit, disable dishes
- 🏷️ Create & manage coupons
- 💬 Reply to customer support chats

---

## 🔌 Realtime Architecture

```
Supabase Realtime (PostgreSQL Changes)
  └── orders table        → Live order status updates to users
  └── delivery_tracking   → Live location updates on map
  └── chat_messages       → Live support chat

Socket.io (WebSockets)
  └── 'join-order'        → User joins order room
  └── 'status-update'     → Admin pushes status to user
  └── 'location-update'   → Delivery agent sends location
  └── 'new-chat-message'  → User message to admin
  └── 'chat-reply'        → Admin reply to user
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#f97316` (Orange 500) |
| Primary Dark | `#ea580c` (Orange 600) |
| Cream BG | `#fffbf5` |
| Gold Accent | `#f59e0b` |
| Font Display | Playfair Display |
| Font Body | Plus Jakarta Sans |

### Glassmorphism
```css
.glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(249, 115, 22, 0.15);
}
```

---

## 🧪 Testing

```bash
# Test backend health
curl http://localhost:4000/health

# Test products API
curl http://localhost:4000/products

# Test coupon (demo)
curl -X POST http://localhost:4000/apply-coupon \
  -H "Content-Type: application/json" \
  -d '{"code":"DADAJ50","orderTotal":499}'
```

---

## 📦 Sample Coupons

| Code | Type | Value | Min Order | Max Discount |
|------|------|-------|-----------|-------------|
| `DADAJ50` | 50% off | 50% | ₹199 | ₹200 |
| `WELCOME20` | 20% off | 20% | ₹299 | ₹100 |
| `FLAT100` | Flat ₹100 | ₹100 | ₹499 | – |
| `BIRYANI30` | 30% off | 30% | ₹349 | ₹150 |

---

## 🛠️ Troubleshooting

**OTP not received?**
- Check Supabase Auth → Email Templates are configured
- Verify SMTP settings (use Gmail App Password, not regular password)

**Payment not working?**
- Ensure Razorpay test keys are used in development
- Check browser console for Razorpay script load errors

**Realtime not updating?**
- Ensure Supabase Realtime is enabled for the tables
- Check that `supabase_realtime` publication includes the tables

**CORS errors?**
- Update `FRONTEND_URL` in backend `.env`
- Ensure Supabase Auth allowed URLs includes your domain

---

## 📄 License

MIT License — Free to use and modify for commercial and personal projects.

---

Made with ❤️ and 🍛 for DADAJ BIRYANI
