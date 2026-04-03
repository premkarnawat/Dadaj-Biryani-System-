import { createClient } from '@supabase/supabase-js';

// Safe fallback so the module doesn't explode at build/prerender time.
// The real values are injected at runtime via Vercel env vars.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

export type AddOn = { name: string; price: number; selected?: boolean };
export type Address = {
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
};
export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'PICKED'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';
