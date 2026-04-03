'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingBag, DollarSign, Users, TrendingUp,
  Package, UtensilsCrossed, Tag, MessageCircle, ChevronRight
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const STATS = [
  { label: "Today's Revenue", value: '₹18,240', change: '+12%', icon: DollarSign, color: 'bg-green-50 text-green-600' },
  { label: 'Total Orders', value: '64', change: '+8%', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Users', value: '1,284', change: '+5%', icon: Users, color: 'bg-purple-50 text-purple-600' },
  { label: 'Avg Order Value', value: '₹285', change: '+3%', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
];

const RECENT_ORDERS = [
  { id: 'DB20240001', customer: 'Rohit Sharma', items: 'Chicken Dum x2', total: 598, status: 'PREPARING', time: '5m ago' },
  { id: 'DB20240002', customer: 'Priya Patel', items: 'Mutton Dum x1', total: 399, status: 'PLACED', time: '8m ago' },
  { id: 'DB20240003', customer: 'Amit Kumar', items: 'Veg Biryani x2', total: 498, status: 'ON_THE_WAY', time: '15m ago' },
  { id: 'DB20240004', customer: 'Sneha Joshi', items: 'Prawn Biryani x1', total: 449, status: 'DELIVERED', time: '30m ago' },
];

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-yellow-100 text-yellow-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  PICKED: 'bg-purple-100 text-purple-700',
  ON_THE_WAY: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const QUICK_LINKS = [
  { href: '/admin/orders', label: 'Manage Orders', icon: Package },
  { href: '/admin/dishes', label: 'Manage Dishes', icon: UtensilsCrossed },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/chat', label: 'Support Chat', icon: MessageCircle },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin 👋</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              <span className="text-xs text-green-600 font-semibold">{stat.change} today</span>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-primary-500 text-sm font-semibold">View All →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_ORDERS.map((order) => (
                <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-800">{order.customer}</p>
                      <span className="text-xs text-gray-400 font-mono">{order.id}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{order.items}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm text-gray-800">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h2 className="font-bold text-gray-900 px-1">Quick Actions</h2>
            {QUICK_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={link.href}>
                  <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-card transition-all group">
                    <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors">
                      <link.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <span className="font-semibold text-sm text-gray-700 flex-1">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
