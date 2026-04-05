'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, Tag, MapPin, CheckCircle, ArrowLeft, X, FileText } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const COUPONS: Record<string, { type: 'pct' | 'fixed'; val: number; min: number; max?: number; label: string }> = {
  DADAJ50:   { type: 'pct',   val: 50,  min: 199, max: 200, label: '50% off (max ₹200)' },
  WELCOME20: { type: 'pct',   val: 20,  min: 299, max: 100, label: '20% off (max ₹100)' },
  FLAT100:   { type: 'fixed', val: 100, min: 499,           label: 'Flat ₹100 off'       },
  BIRYANI30: { type: 'pct',   val: 30,  min: 349, max: 150, label: '30% off (max ₹150)'  },
};

const PAYMENT_METHODS = [
  { id: 'upi',     label: 'UPI / GPay',       icon: '📱' },
  { id: 'card',    label: 'Credit / Debit Card', icon: '💳' },
  { id: 'cod',     label: 'Cash on Delivery',  icon: '💵' },
  { id: 'netbank', label: 'Net Banking',       icon: '🏦' },
];

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, subtotal, tax, deliveryCharge,
          discount, total, coupon, applyCoupon, removeCoupon, clearCart } = useCartStore();

  const [code,       setCode]       = useState('');
  const [couponErr,  setCouponErr]  = useState('');
  const [payMethod,  setPayMethod]  = useState('upi');
  const [paying,     setPaying]     = useState(false);
  const [showFake,   setShowFake]   = useState(false);
  const [cardNo,     setCardNo]     = useState('');
  const [upiId,      setUpiId]      = useState('');

  /* ── Coupon ── */
  const handleCoupon = () => {
    setCouponErr('');
    const c = COUPONS[code.toUpperCase()];
    if (!c) { setCouponErr('Invalid coupon code'); return; }
    if (subtotal() < c.min) { setCouponErr(`Min order ₹${c.min} required`); return; }
    let amt = c.type === 'pct' ? subtotal() * c.val / 100 : c.val;
    if (c.max) amt = Math.min(amt, c.max);
    applyCoupon({ code: code.toUpperCase(), discountType: c.type, discountValue: c.val, discountAmount: Math.round(amt) });
    toast.success(`Coupon applied! You saved ${formatPrice(Math.round(amt))}`);
    setCode('');
  };

  /* ── Payment ── */
  const handlePay = async () => {
    if (payMethod === 'cod') {
      finalize('COD');
      return;
    }
    setShowFake(true);
  };

  const finalize = (method: string) => {
    setShowFake(false);
    setPaying(true);
    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully! 🎉');
      router.push('/order/success');
    }, 1200);
  };

  const GST = tax();
  const DEL = deliveryCharge();
  const DIS = discount();
  const TOT = total();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center pt-16 px-4">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="font-display font-bold text-2xl text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some delicious biryanis to get started</p>
          <Link href="/dishes">
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              className="bg-primary-500 text-white px-8 py-3 rounded-2xl font-bold shadow-orange">
              Browse Menu 🍛
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h1 className="font-display font-bold text-2xl text-gray-900">Your Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Items + Coupon + Payment ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Items */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-orange-50">
                <h2 className="font-semibold text-gray-800">Items ({items.length})</h2>
              </div>
              <div className="divide-y divide-orange-50">
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div key={item.id} layout exit={{ opacity:0, height:0 }} className="p-4 flex gap-3 items-center">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                        <p className="text-primary-600 font-bold text-sm">{formatPrice(item.price)}</p>
                        {item.selectedAddOns?.length > 0 && (
                          <p className="text-xs text-gray-400 truncate">+{item.selectedAddOns.map(a=>a.name).join(', ')}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 border border-orange-200 rounded-xl p-0.5">
                        <button onClick={() => updateQuantity(item.id, item.quantity-1)} className="w-7 h-7 rounded-lg hover:bg-orange-50 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity+1)} className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-primary-500"/>Apply Coupon</h2>
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-bold text-green-700 font-mono">{coupon.code}</p>
                    <p className="text-xs text-green-600">You saved {formatPrice(coupon.discountAmount)}</p>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 hover:text-green-800"><X className="w-4 h-4"/></button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon (try DADAJ50)"
                      className="flex-1 border border-orange-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400 font-mono" />
                    <button onClick={handleCoupon} className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold">Apply</button>
                  </div>
                  {couponErr && <p className="text-red-500 text-xs">{couponErr}</p>}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(COUPONS).map(([k,v])=>(
                      <button key={k} onClick={()=>setCode(k)}
                        className="text-xs bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-lg font-mono hover:bg-orange-100 transition-colors">
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Payment Method</h2>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setPayMethod(pm.id)}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      payMethod === pm.id ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    <span className="text-xl">{pm.icon}</span>{pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800">Delivery Address</h2>
                <Link href="/profile/addresses" className="text-primary-500 text-sm font-semibold">Change</Link>
              </div>
              <div className="flex items-start gap-3 bg-orange-50 rounded-xl p-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0"/>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Home</p>
                  <p className="text-sm text-gray-500">Sadar Bazar, Satara – 415001</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0"/>
              </div>
            </div>
          </div>

          {/* ── Right: Bill Summary ── */}
          <div>
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 sticky top-20">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary-500"/>Bill Details</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Item Total</span><span>{formatPrice(subtotal())}</span></div>
                <div className="flex justify-between text-gray-600"><span>GST (5%)</span><span>{formatPrice(GST)}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{DEL === 0 ? <span className="text-green-600 font-semibold">FREE</span> : formatPrice(DEL)}</span>
                </div>
                {DIS > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>- {formatPrice(DIS)}</span></div>}
                <div className="border-t border-orange-100 pt-2.5 flex justify-between font-bold text-gray-900 text-base">
                  <span>To Pay</span><span className="text-primary-600">{formatPrice(TOT)}</span>
                </div>
              </div>
              {DEL > 0 && <p className="text-xs text-gray-400 mt-2 text-center">Add {formatPrice(500 - subtotal())} more for FREE delivery</p>}

              <motion.button
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                onClick={handlePay}
                disabled={paying}
                className="w-full mt-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold shadow-orange disabled:opacity-60"
              >
                {paying ? <span className="flex items-center justify-center gap-2"><div className="spinner w-4 h-4"/>Placing Order...</span>
                  : payMethod === 'cod' ? `Place Order (COD) · ${formatPrice(TOT)}`
                  : `Pay ${formatPrice(TOT)} →`}
              </motion.button>
              <p className="text-xs text-gray-400 text-center mt-2">🔒 Secured & safe payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fake payment modal ── */}
      <AnimatePresence>
        {showFake && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={()=>setShowFake(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm">
              <h2 className="font-display font-bold text-xl text-gray-900 mb-4">
                {payMethod === 'card' ? '💳 Enter Card Details' : '📱 Enter UPI ID'}
              </h2>
              {payMethod === 'card' ? (
                <div className="space-y-3">
                  <input value={cardNo} onChange={e=>setCardNo(e.target.value.replace(/\D/g,'').slice(0,16))}
                    placeholder="1234 5678 9012 3456" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-primary-400"/>
                  <div className="flex gap-2">
                    <input placeholder="MM/YY" className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400"/>
                    <input placeholder="CVV" className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400"/>
                  </div>
                </div>
              ) : (
                <input value={upiId} onChange={e=>setUpiId(e.target.value)}
                  placeholder="yourname@upi" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400"/>
              )}
              <p className="text-xs text-gray-400 mt-2">This is a test payment — no real money will be charged.</p>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                onClick={()=>finalize(payMethod)}
                className="w-full mt-4 bg-primary-500 text-white py-3.5 rounded-2xl font-bold shadow-orange">
                Pay {formatPrice(TOT)} (Test)
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
