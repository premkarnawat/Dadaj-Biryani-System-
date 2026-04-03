'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const ORDERS = [
  { id: 'DB20240001', customer: 'Rohit Sharma', phone: '9876543210', items: ['Chicken Dum x2', 'Extra Raita'], total: 628, status: 'PREPARING', address: 'MG Road, Pune', time: '10:32 AM' },
  { id: 'DB20240002', customer: 'Priya Patel', phone: '9876543211', items: ['Mutton Dum x1'], total: 399, status: 'PLACED', address: 'FC Road, Pune', time: '10:28 AM' },
  { id: 'DB20240003', customer: 'Amit Kumar', phone: '9876543212', items: ['Veg Biryani x2', 'Gulab Jamun'], total: 548, status: 'ON_THE_WAY', address: 'Kothrud, Pune', time: '10:15 AM' },
  { id: 'DB20240004', customer: 'Sneha Joshi', phone: '9876543213', items: ['Prawn Biryani x1', 'Salan'], total: 489, status: 'DELIVERED', address: 'Baner, Pune', time: '9:50 AM' },
  { id: 'DB20240005', customer: 'Vikram Singh', phone: '9876543214', items: ['Hyderabadi Dum x2'], total: 598, status: 'ACCEPTED', address: 'Viman Nagar, Pune', time: '10:05 AM' },
];

const ALL_STATUSES = ['ALL', 'PLACED', 'ACCEPTED', 'PREPARING', 'PICKED', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700 border-blue-200',
  ACCEPTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PREPARING: 'bg-orange-100 text-orange-700 border-orange-200',
  PICKED: 'bg-purple-100 text-purple-700 border-purple-200',
  ON_THE_WAY: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

const NEXT_STATUS: Record<string, string> = {
  PLACED: 'ACCEPTED', ACCEPTED: 'PREPARING', PREPARING: 'PICKED',
  PICKED: 'ON_THE_WAY', ON_THE_WAY: 'DELIVERED',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    if (filter !== 'ALL' && o.status !== filter) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
    return true;
  });

  const updateStatus = (id: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Order ${id} updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200 flex-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer or order ID..." className="bg-transparent text-sm outline-none w-full" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Orders */}
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{order.customer}</p>
                    <span className="text-xs font-mono text-gray-400">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{order.items.join(' · ')}</p>
                  <p className="text-xs text-gray-400 mt-0.5">📍 {order.address} · {order.time} · 📞 {order.phone}</p>
                </div>

                <div className="flex items-center gap-3">
                  <p className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</p>

                  {/* Status Actions */}
                  <div className="flex gap-2">
                    {NEXT_STATUS[order.status] && (
                      <button
                        onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                        className="bg-primary-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-primary-600 transition-colors"
                      >
                        → {NEXT_STATUS[order.status].replace('_', ' ')}
                      </button>
                    )}
                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <button
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
