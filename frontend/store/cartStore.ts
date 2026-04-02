import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AddOn } from '@/lib/supabase';
import { calculateTax, calculateDeliveryCharge } from '@/lib/utils';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  selectedAddOns: AddOn[];
  itemTotal: number;
}

interface CouponState {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

interface CartState {
  items: CartItem[];
  coupon: CouponState | null;
  isOpen: boolean;

  addItem: (item: Omit<CartItem, 'quantity' | 'itemTotal'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  applyCoupon: (coupon: CouponState) => void;
  removeCoupon: () => void;

  subtotal: () => number;
  tax: () => number;
  deliveryCharge: () => number;
  discount: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          const addOnTotal = item.selectedAddOns?.reduce((s, a) => s + a.price, 0) ?? 0;
          const itemPrice = item.price + addOnTotal;

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1, itemTotal: (i.quantity + 1) * itemPrice }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: 1, itemTotal: itemPrice },
            ],
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity, itemTotal: quantity * i.price } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      subtotal: () => get().items.reduce((s, i) => s + i.itemTotal, 0),

      tax: () => calculateTax(get().subtotal()),

      deliveryCharge: () => calculateDeliveryCharge(get().subtotal()),

      discount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        return coupon.discountAmount;
      },

      total: () => {
        const s = get();
        return s.subtotal() + s.tax() + s.deliveryCharge() - s.discount();
      },

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'dadaj-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
