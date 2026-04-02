'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const SAMPLE_ORDERS = [
  { id: 'DB20240001', items: ['Chicken Dum Biryani x2', 'Extra Raita'], total: 628, status: 'DELIVERED', date: '2024-07-10 10:35 AM', rating: 5 },
  { id: 'DB20240002', items: ['Mutton Dum Biryani x1'], total: 399, status: 'DELIVERED', date: '2024-07-05 07:20 PM', rating: 4 },
  { id: 'DB20240003', items: ['Hyderabadi Veg Biryani x2', 'Gulab Jamun'], total: 548, status: 'CANCELLED', date: '2024-06-28 01:15 PM', rating: null },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  ON_THE_WAY: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
};

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="py-5 flex items-center gap-3">
          <Link href="/profile">
            <button className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm">
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">Order History</h1>
            <p className="text-sm text-gray-400">{SAMPLE_ORDERS.length} orders</p>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-3">
          {SAMPLE_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-orange-50 shadow-sm p-4 hover:border-orange-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{order.items[0]}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{order.id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {order.status === 'DELIVERED' && (
                <div className="mt-3 flex gap-2">
                  <Link href="/dishes" className="flex-1">
                    <button className="w-full text-xs bg-orange-50 text-primary-600 py-2 rounded-xl font-semibold hover:bg-orange-100 transition-colors">
                      Reorder
                    </button>
                  </Link>
                  <Link href={`/tracking?id=${order.id}`} className="flex-1">
                    <button className="w-full text-xs bg-gray-50 text-gray-600 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                      View Details
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {SAMPLE_ORDERS.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="font-display font-semibold text-xl text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Your order history will appear here</p>
            <Link href="/dishes">
              <button className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-orange">
                Order Now 🍛
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
