-- ============================================================
-- DADAJ BIRYANI – Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- USERS (synced from Supabase Auth)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-insert user on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- ADMIN USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  image_url   TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  image_url     TEXT,
  category_id   UUID REFERENCES public.categories(id),
  rating        NUMERIC(3,2) DEFAULT 4.5,
  rating_count  INTEGER DEFAULT 0,
  is_veg        BOOLEAN DEFAULT FALSE,
  is_available  BOOLEAN DEFAULT TRUE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  add_ons       JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ADDRESSES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.addresses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
  label          TEXT DEFAULT 'Home',
  address_line1  TEXT NOT NULL,
  address_line2  TEXT,
  city           TEXT NOT NULL,
  pincode        TEXT NOT NULL,
  lat            FLOAT,
  lng            FLOAT,
  is_default     BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- COUPONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT NOT NULL UNIQUE,
  discount_type   TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value  NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_discount    NUMERIC(10,2),
  is_active       BOOLEAN DEFAULT TRUE,
  usage_limit     INTEGER,
  usage_count     INTEGER DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES public.users(id),
  status           TEXT NOT NULL DEFAULT 'PLACED'
                     CHECK (status IN ('PLACED','ACCEPTED','PREPARING','PICKED','ON_THE_WAY','DELIVERED','CANCELLED')),
  subtotal         NUMERIC(10,2) NOT NULL,
  tax              NUMERIC(10,2) DEFAULT 0,
  delivery_charge  NUMERIC(10,2) DEFAULT 0,
  discount         NUMERIC(10,2) DEFAULT 0,
  total            NUMERIC(10,2) NOT NULL,
  address          JSONB NOT NULL,
  payment_method   TEXT DEFAULT 'RAZORPAY',
  payment_status   TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','PAID','FAILED','REFUNDED')),
  coupon_code      TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  price       NUMERIC(10,2) NOT NULL,
  name        TEXT NOT NULL,
  image_url   TEXT,
  add_ons     JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ORDER STATUS LOGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_status_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id            UUID REFERENCES public.orders(id),
  payment_id          TEXT UNIQUE,
  razorpay_order_id   TEXT,
  amount              NUMERIC(10,2),
  method              TEXT,
  status              TEXT DEFAULT 'PENDING',
  verified_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- DELIVERY TRACKING
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  agent_name   TEXT,
  agent_phone  TEXT,
  lat          FLOAT,
  lng          FLOAT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- CHAT MESSAGES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  is_admin    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- Users: only own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Products: public read
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (TRUE);

-- Categories: public read
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (TRUE);

-- Orders: own orders only
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_own" ON public.orders
  FOR ALL USING (auth.uid() = user_id);

-- Order items: via order ownership
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_via_order" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

-- Addresses: own addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses_own" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- Coupons: public read active
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons_public_read" ON public.coupons
  FOR SELECT USING (is_active = TRUE);

-- Chat messages: own messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_own" ON public.chat_messages
  FOR ALL USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- REALTIME
-- ─────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ─────────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────────

-- Categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Veg Biryani',     'veg-biryani',     1),
  ('Non-Veg Biryani', 'non-veg-biryani', 2),
  ('Combo Meals',     'combo-meals',     3),
  ('Sides & Drinks',  'sides-drinks',    4)
ON CONFLICT (slug) DO NOTHING;

-- Products (sample)
INSERT INTO public.products (name, description, price, image_url, category_id, rating, rating_count, is_veg, is_bestseller, add_ons)
SELECT
  'Chicken Dum Biryani',
  'Slow-cooked tender chicken layered with fragrant basmati rice and royal spices.',
  299,
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
  c.id, 4.9, 1240, FALSE, TRUE,
  '[{"name":"Extra Raita","price":30},{"name":"Salan","price":40},{"name":"Boiled Egg","price":20}]'::jsonb
FROM public.categories c WHERE c.slug = 'non-veg-biryani';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, rating_count, is_veg, is_bestseller, add_ons)
SELECT
  'Mutton Dum Biryani',
  'Tender mutton pieces in aromatic dum-cooked basmati – the royal classic.',
  399,
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop',
  c.id, 4.8, 980, FALSE, TRUE,
  '[{"name":"Extra Raita","price":30},{"name":"Salan","price":40},{"name":"Extra Portion","price":200}]'::jsonb
FROM public.categories c WHERE c.slug = 'non-veg-biryani';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, rating_count, is_veg, is_bestseller, add_ons)
SELECT
  'Hyderabadi Veg Biryani',
  'Mixed vegetables and paneer cooked with saffron-infused rice in authentic dum style.',
  249,
  'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&h=400&fit=crop',
  c.id, 4.7, 650, TRUE, TRUE,
  '[{"name":"Extra Raita","price":30},{"name":"Papad","price":15},{"name":"Gulab Jamun","price":50}]'::jsonb
FROM public.categories c WHERE c.slug = 'veg-biryani';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, rating_count, is_veg, is_bestseller, add_ons)
SELECT
  'Prawn Biryani',
  'Juicy tiger prawns marinated in coastal spices, layered with long-grain basmati.',
  449,
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop',
  c.id, 4.8, 530, FALSE, FALSE,
  '[{"name":"Extra Raita","price":30},{"name":"Salan","price":40}]'::jsonb
FROM public.categories c WHERE c.slug = 'non-veg-biryani';

INSERT INTO public.products (name, description, price, image_url, category_id, rating, rating_count, is_veg, is_bestseller, add_ons)
SELECT
  'Paneer Biryani',
  'Creamy cottage cheese cubes in aromatic rice with Mughlai spices.',
  269,
  'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop',
  c.id, 4.6, 440, TRUE, FALSE,
  '[{"name":"Extra Raita","price":30},{"name":"Papad","price":15}]'::jsonb
FROM public.categories c WHERE c.slug = 'veg-biryani';

-- Sample coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_value, max_discount, usage_limit) VALUES
  ('DADAJ50',   'percentage', 50, 199, 200,  1000),
  ('WELCOME20', 'percentage', 20, 299, 100,  NULL),
  ('FLAT100',   'fixed',     100, 499, NULL, 500),
  ('BIRYANI30', 'percentage', 30, 349, 150,  NULL)
ON CONFLICT (code) DO NOTHING;
