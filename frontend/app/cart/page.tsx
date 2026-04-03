'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Minus, Trash2, Tag, MapPin, CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { couponsApi } from '@/lib/api';
import toast from 'react-hot-toast';

declare global { interface Window { Razorpay: unknown } }

export default function CartPage() {
  const router = useRouter();
  const {
    items, removeItem, updateQuantity, subtotal, tax, deliveryCharge,
    discount, total, coupon, applyCoupon, removeCoupon, clearCart,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedAddress] = useState({
    label: 'Home', address_line1: '123, MG Road', city: 'Pune', pincode: '411001',
  });

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const data = await couponsApi.apply(couponCode.toUpperCase(), subtotal());
      applyCoupon({ code: couponCode.toUpperCase(), ...data });
      toast.success(`Coupon applied! You saved ${formatPrice(data.discountAmount)}`);
    } catch {
      // Demo fallback
      if (couponCode.toUpperCase() === 'DADAJ50') {
        const discountAmount = Math.min(subtotal() * 0.5, 200);
        applyCoupon({ code: 'DADAJ50', discountType: 'percentage', discountValue: 50, discountAmount });
        toast.success(`Coupon applied! You saved ${formatPrice(discountAmount)}`);
      } else {
        toast.error('Invalid or expired coupon');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      await new Promise((res) => { script.onload = res; });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo',
        amount: total() * 100,
        currency: 'INR',
        name: 'DADAJ BIRYANI',
        description: `Order of ${items.length} items`,
        theme: { color: '#f97316' },
        handler: (response: { razorpay_payment_id: string }) => {
          clearCart();
          toast.success('Order placed successfully! 🎉');
          router.push(`/order/success?payment_id=${response.razorpay_payment_id}`);
        },
        modal: { ondismiss: () => setPaymentLoading(false) },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window.Razorpay as any)(options);
      rzp.open();
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="font-display font-bold text-2xl text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some delicious biryanis to get started</p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => router.push('/dishes')}
            className="bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold shadow-orange"
          >
            Browse Menu 🍛
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-orange-50">
                <h2 className="font-semibold text-gray-800">Order Items ({items.length})</h2>
              </div>
              <div className="divide-y divide-orange-50">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 flex gap-4 items-center"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-800">{item.name}</h3>
                        <p className="text-primary-600 font-bold text-sm">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 border border-orange-200 rounded-xl p-0.5">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg hover:bg-orange-50 flex items-center justify-center">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 ml-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">Delivery Address</h2>
                <button className="text-primary-500 text-sm font-semibold">Change</button>
              </div>
              <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-gray-800">{selectedAddress.label}</p>
                  <p className="text-sm text-gray-500">{selectedAddress.address_line1}, {selectedAddress.city} – {selectedAddress.pincode}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Apply Coupon</h2>
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-700">{coupon.code}</span>
                    <span className="text-sm text-green-600">- {formatPrice(coupon.discountAmount)}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 text-sm font-semibold">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (try DADAJ50)"
                    className="flex-1 border border-orange-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 font-mono"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 sticky top-20">
              <h2 className="font-semibold text-gray-800 mb-4">Bill Details</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span><span>{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Charges</span><span>{formatPrice(tax())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryCharge() === 0
                      ? <span className="text-green-600 font-semibold">FREE</span>
                      : formatPrice(deliveryCharge())}
                  </span>
                </div>
                {discount() > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon Discount</span><span>- {formatPrice(discount())}</span>
                  </div>
                )}
                <div className="border-t border-orange-100 pt-2.5 flex justify-between font-bold text-gray-900 text-base">
                  <span>To Pay</span><span className="text-primary-600">{formatPrice(total())}</span>
                </div>
              </div>

              {deliveryCharge() > 0 && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Add {formatPrice(500 - subtotal())} more for FREE delivery
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full mt-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold text-base shadow-orange hover:shadow-lg transition-all disabled:opacity-60"
              >
                {paymentLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner w-4 h-4" />
                    Processing...
                  </div>
                ) : (
                  `Pay ${formatPrice(total())} →`
                )}
              </motion.button>
              <p className="text-xs text-gray-400 text-center mt-2">Secured by Razorpay 🔒</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
