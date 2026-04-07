import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession:      true,   // saves session to localStorage
    autoRefreshToken:    true,   // auto-refreshes before 30-day expiry
    detectSessionInUrl:  true,
    // Session stays alive for 30 days. When user returns after 30 days
    // and logs in again via OTP, our authStore upsert ensures the same
    // public.users row is reused (ON CONFLICT id DO UPDATE).
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

// ── TypeScript types matching DB schema exactly ──

export type AddOn = {
  name:      string;
  price:     number;
  emoji?:    string;
  selected?: boolean;
};

export type Address = {
  label:         string;
  address_line1: string;
  address_line2?: string;
  city:          string;
  pincode:       string;
  lat?:          number;
  lng?:          number;
};

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'PICKED'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'upi' | 'card' | 'cod' | 'netbank';

export interface Product {
  id:           string;
  name:         string;
  description:  string;
  price:        number;
  image_url:    string;
  category_id:  string;
  rating:       number;
  rating_count: number;
  is_veg:       boolean;
  is_available: boolean;
  is_bestseller:boolean;
  add_ons:      AddOn[];
  prep_time:    string;
  serves:       string;
  calories:     string;
}

export interface Order {
  id:              string;
  user_id:         string;
  status:          OrderStatus;
  subtotal:        number;
  tax:             number;
  delivery_charge: number;
  discount:        number;
  total:           number;
  address:         Address;
  payment_method:  PaymentMethod;
  payment_status:  'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  coupon_code:     string | null;
  notes:           string | null;
  created_at:      string;
  updated_at:      string;
}
