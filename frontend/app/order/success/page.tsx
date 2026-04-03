'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Clock, MapPin } from 'lucide-react';

export default function OrderSuccessPage() {
  const orderId = `DB${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-1">Your biryani is being prepared with love</p>
          <p className="text-sm text-gray-400 font-mono">Order ID: {orderId}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-2xl border border-orange-100 shadow-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Estimated Delivery</p>
              <p className="text-sm text-gray-500">25–35 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Delivering to</p>
              <p className="text-sm text-gray-500">Home · MG Road, Pune 411001</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex gap-3"
        >
          <Link href="/tracking" className="flex-1">
            <button className="w-full bg-primary-500 text-white py-3.5 rounded-2xl font-bold shadow-orange">
              Track Order 🛵
            </button>
          </Link>
          <Link href="/" className="flex-1">
            <button className="w-full bg-white text-gray-700 py-3.5 rounded-2xl font-semibold border border-orange-200">
              Back to Home
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
