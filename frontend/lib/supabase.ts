import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category_id: string;
          rating: number;
          rating_count: number;
          is_veg: boolean;
          is_available: boolean;
          is_bestseller: boolean;
          add_ons: AddOn[];
          created_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          sort_order: number;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: OrderStatus;
          subtotal: number;
          tax: number;
          delivery_charge: number;
          discount: number;
          total: number;
          address: Address;
          payment_method: string;
          payment_status: string;
          coupon_code: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          add_ons: AddOn[];
          name: string;
          image_url: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          min_order_value: number;
          max_discount: number | null;
          is_active: boolean;
          usage_limit: number | null;
          usage_count: number;
          expires_at: string | null;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          pincode: string;
          lat: number | null;
          lng: number | null;
          is_default: boolean;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          is_admin: boolean;
          created_at: string;
        };
      };
      delivery_tracking: {
        Row: {
          id: string;
          order_id: string;
          agent_name: string;
          agent_phone: string;
          lat: number;
          lng: number;
          updated_at: string;
        };
      };
    };
  };
};

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
