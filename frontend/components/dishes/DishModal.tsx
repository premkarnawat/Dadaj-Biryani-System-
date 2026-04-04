'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Star, Plus, Minus, ShoppingCart, Clock, Flame, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AddOn { name: string; price: number; emoji: string }
interface DishModalProps {
  dish: {
    id: string; name: string; description: string; price: number;
    image_url: string; rating: number; rating_count: number;
    is_veg: boolean; is_bestseller?: boolean; prepTime?: string;
    addOns?: AddOn[];
  } | null;
  onClose: () => void;
}

const DEFAULT_ADDONS: AddOn[] = [
  { name: 'Extra Raita',   price: 30,  emoji: '🥛' },
  { name: 'Extra Gravy',   price: 40,  emoji: '🍲' },
  { name: 'Salad',         price: 25,  emoji: '🥗' },
  { name: 'Papad',         price: 15,  emoji: '🫓' },
  { name: 'Gulab Jamun',   price: 50,  emoji: '🍮' },
  { name: 'Extra Portion', price: 150, emoji: '🍛' },
];

export default function DishModal({ dish, onClose }: DishModalProps) {
  const addItem = useCartStore(s => s.addItem);
  const [qty, setQty]           = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  if (!dish) return null;

  const addons = dish.addOns || DEFAULT_ADDONS;

  const toggleAddon = (name: string) =>
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );

  const addonTotal = addons
    .filter(a => selected.includes(a.name))
    .reduce((s, a) => s + a.price, 0);

  const total = (dish.price + addonTotal) * qty;

  const handleAdd = () => {
    const selectedAddOns = addons
      .filter(a => selected.includes(a.name))
      .map(a => ({ name: a.name, price: a.price }));

    for (let i = 0; i < qty; i++) {
      addItem({ id: dish.id, name: dish.name, price: dish.price + addonTotal, image_url: dish.image_url, selectedAddOns });
    }
    toast.success(`${qty}× ${dish.name} added to cart! 🍛`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          layoutId={`dish-card-${dish.id}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
          className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          style={{ maxHeight: '92vh' }}
        >
          {/* ── Image ── */}
          <div className="relative w-full" style={{ height: 260 }}>
            <Image
              src={dish.image_url}
              alt={dish.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`w-6 h-6 rounded flex items-center justify-center ${dish.is_veg ? 'bg-green-500' : 'bg-red-500'}`}>
                {dish.is_veg ? <Leaf className="w-3.5 h-3.5 text-white" /> : <Flame className="w-3.5 h-3.5 text-white" />}
              </span>
              {dish.is_bestseller && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">🏆 Bestseller</span>
              )}
            </div>

            {/* Rating bottom-left of image */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 rounded-xl px-3 py-1.5 shadow">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm text-gray-800">{dish.rating}</span>
              <span className="text-xs text-gray-400">({dish.rating_count} reviews)</span>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 260px)' }}>
            <div className="p-5 space-y-5">

              {/* Name + Price row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display font-bold text-2xl text-gray-900 leading-tight">{dish.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dish.prepTime || '25–30 min'}</span>
                  </div>
                </div>
                <span className="font-bold text-primary-600 text-2xl flex-shrink-0">{formatPrice(dish.price)}</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-700 text-sm mb-1.5">About this dish</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{dish.description}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3">
                <span className="font-semibold text-gray-700 text-sm">Quantity</span>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold hover:bg-primary-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="font-bold text-lg text-gray-900 w-6 text-center">{qty}</span>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 bg-primary-500 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <h3 className="font-semibold text-gray-700 text-sm mb-3">Add-ons <span className="text-gray-400 font-normal">(optional)</span></h3>
                <div className="space-y-2">
                  {addons.map(addon => {
                    const isOn = selected.includes(addon.name);
                    return (
                      <motion.button
                        key={addon.name}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleAddon(addon.name)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                          isOn
                            ? 'border-primary-400 bg-primary-50'
                            : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-xl">{addon.emoji}</span>
                        <span className={`flex-1 text-sm font-medium ${isOn ? 'text-primary-700' : 'text-gray-700'}`}>
                          {addon.name}
                        </span>
                        <span className={`text-sm font-bold ${isOn ? 'text-primary-600' : 'text-gray-500'}`}>
                          +{formatPrice(addon.price)}
                        </span>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isOn ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                        }`}>
                          {isOn && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Bill summary */}
              {(selected.length > 0 || qty > 1) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-orange-50 rounded-2xl p-4 space-y-1.5 border border-orange-100"
                >
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{dish.name} × {qty}</span>
                    <span>{formatPrice(dish.price * qty)}</span>
                  </div>
                  {selected.map(name => {
                    const a = addons.find(x => x.name === name)!;
                    return (
                      <div key={name} className="flex justify-between text-sm text-gray-600">
                        <span>{a.emoji} {a.name} × {qty}</span>
                        <span>+{formatPrice(a.price * qty)}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t border-orange-200 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(total)}</span>
                  </div>
                </motion.div>
              )}

              {/* Add to cart button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-orange"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart · {formatPrice(total)}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
