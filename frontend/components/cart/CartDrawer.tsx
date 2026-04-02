'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items, isOpen, toggleCart, removeItem, updateQuantity,
    subtotal, tax, deliveryCharge, discount, total, coupon, removeCoupon,
  } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-orange-100">
              <div>
                <h2 className="font-display font-bold text-xl text-gray-900">Your Cart</h2>
                <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={toggleCart}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full py-20 text-center"
                  >
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8 text-primary-300" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-gray-700 mb-1">Your cart is empty</h3>
                    <p className="text-sm text-gray-400 mb-6">Add some delicious biryanis!</p>
                    <button
                      onClick={toggleCart}
                      className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-600 transition-colors"
                    >
                      Browse Menu
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-orange-50/50 rounded-2xl p-3 border border-orange-100"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                        <p className="text-primary-600 font-bold text-sm mt-0.5">{formatPrice(item.price)}</p>
                        {item.selectedAddOns?.length > 0 && (
                          <p className="text-xs text-gray-400 truncate">
                            +{item.selectedAddOns.map(a => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-orange-200 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-orange-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-orange-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Summary & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-orange-100 p-4 space-y-3">
                {/* Coupon */}
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">{coupon.code}</span>
                      <span className="text-xs text-green-600">- {formatPrice(coupon.discountAmount)}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                {/* Bill */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes (5%)</span><span>{formatPrice(tax())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{deliveryCharge() === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(deliveryCharge())}</span>
                  </div>
                  {discount() > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span><span>- {formatPrice(discount())}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t border-orange-100 pt-1.5 mt-1.5">
                    <span>Total</span><span className="text-primary-600">{formatPrice(total())}</span>
                  </div>
                </div>

                <Link href="/cart" onClick={toggleCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-orange hover:shadow-lg transition-all"
                  >
                    Proceed to Checkout →
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
