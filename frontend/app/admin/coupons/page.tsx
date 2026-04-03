'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag, X, Copy, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  expires_at: string | null;
}

interface FormState {
  code: string;
  discount_type: string;
  discount_value: string;
  min_order_value: string;
  max_discount: string;
  usage_limit: string;
  expires_at: string;
}

const EMPTY_FORM: FormState = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_value: '0',
  max_discount: '',
  usage_limit: '',
  expires_at: '',
};

const SAMPLE_COUPONS: Coupon[] = [
  { id: '1', code: 'DADAJ50',   discount_type: 'percentage', discount_value: 50,  min_order_value: 199, max_discount: 200,  usage_limit: 1000, usage_count: 234, is_active: true,  expires_at: '2025-12-31' },
  { id: '2', code: 'WELCOME20', discount_type: 'percentage', discount_value: 20,  min_order_value: 299, max_discount: 100,  usage_limit: null, usage_count: 87,  is_active: true,  expires_at: null },
  { id: '3', code: 'FLAT100',   discount_type: 'fixed',      discount_value: 100, min_order_value: 499, max_discount: null, usage_limit: 500,  usage_count: 500, is_active: false, expires_at: '2025-06-30' },
  { id: '4', code: 'BIRYANI30', discount_type: 'percentage', discount_value: 30,  min_order_value: 349, max_discount: 150,  usage_limit: null, usage_count: 45,  is_active: true,  expires_at: null },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(SAMPLE_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const toggleCoupon = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
    toast.success('Coupon status updated');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_value: Number(form.min_order_value),
      max_discount: form.max_discount ? Number(form.max_discount) : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      usage_count: 0,
      is_active: true,
      expires_at: form.expires_at || null,
    };
    setCoupons(prev => [newCoupon, ...prev]);
    toast.success('Coupon created!');
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Coupons &amp; Offers</h1>
            <p className="text-gray-500 text-sm">{coupons.filter(c => c.is_active).length} active coupons</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-primary-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-orange">
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        <div className="space-y-3">
          {coupons.map((coupon, i) => (
            <motion.div key={coupon.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold font-mono text-lg text-gray-900">{coupon.code}</span>
                    <button onClick={() => copyCode(coupon.code)} className="text-gray-400 hover:text-gray-600">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                    <span className="font-semibold text-primary-600">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `\u20b9${coupon.discount_value} off`}
                      {coupon.max_discount ? ` (max \u20b9${coupon.max_discount})` : ''}
                    </span>
                    <span>Min: {formatPrice(coupon.min_order_value)}</span>
                    <span>Used: {coupon.usage_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : ''}</span>
                    {coupon.expires_at && <span>Expires: {coupon.expires_at}</span>}
                  </div>
                </div>
                <button onClick={() => toggleCoupon(coupon.id)}
                  className={`flex-shrink-0 hover:opacity-70 transition-opacity ${coupon.is_active ? 'text-green-500' : 'text-gray-300'}`}>
                  {coupon.is_active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
              {coupon.usage_limit && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Usage</span>
                    <span>{coupon.usage_count}/{coupon.usage_limit}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (coupon.usage_count / coupon.usage_limit) * 100)}%` }} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl text-gray-900">Create Coupon</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Coupon Code *</label>
                  <input type="text" value={form.code} required placeholder="e.g. SUMMER20"
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Discount Type</label>
                  <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (&#8377;)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Discount Value *</label>
                  <input type="number" value={form.discount_value} required placeholder="e.g. 20" min="1"
                    onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Min Order Value (&#8377;)</label>
                  <input type="number" value={form.min_order_value} placeholder="0" min="0"
                    onChange={e => setForm(f => ({ ...f, min_order_value: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Max Discount (&#8377;, blank = unlimited)</label>
                  <input type="number" value={form.max_discount} placeholder="e.g. 200" min="1"
                    onChange={e => setForm(f => ({ ...f, max_discount: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Usage Limit (blank = unlimited)</label>
                  <input type="number" value={form.usage_limit} placeholder="e.g. 500" min="1"
                    onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Expires At (optional)</label>
                  <input type="date" value={form.expires_at}
                    onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <button type="submit"
                  className="w-full bg-primary-500 text-white py-3 rounded-xl font-bold shadow-orange hover:bg-primary-600 transition-colors">
                  Create Coupon
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
