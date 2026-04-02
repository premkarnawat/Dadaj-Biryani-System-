'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Leaf, Flame, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const SAMPLE_DISHES = [
  { id: 'chicken-dum', name: 'Chicken Dum Biryani', price: 299, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', is_veg: false, is_available: true, is_bestseller: true, category: 'Non-Veg Biryani', rating: 4.9 },
  { id: 'mutton-dum', name: 'Mutton Dum Biryani', price: 399, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=200&fit=crop', is_veg: false, is_available: true, is_bestseller: true, category: 'Non-Veg Biryani', rating: 4.8 },
  { id: 'veg-hyd', name: 'Hyderabadi Veg Biryani', price: 249, image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=200&h=200&fit=crop', is_veg: true, is_available: true, is_bestseller: true, category: 'Veg Biryani', rating: 4.7 },
  { id: 'prawn-biryani', name: 'Prawn Biryani', price: 449, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop', is_veg: false, is_available: false, is_bestseller: false, category: 'Non-Veg Biryani', rating: 4.8 },
];

export default function AdminDishesPage() {
  const [dishes, setDishes] = useState(SAMPLE_DISHES);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDish, setEditDish] = useState<typeof SAMPLE_DISHES[0] | null>(null);
  const [form, setForm] = useState({ name: '', price: '', is_veg: false, is_bestseller: false, category: 'Non-Veg Biryani', image_url: '' });

  const filtered = dishes.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditDish(null);
    setForm({ name: '', price: '', is_veg: false, is_bestseller: false, category: 'Non-Veg Biryani', image_url: '' });
    setShowModal(true);
  };

  const openEdit = (dish: typeof SAMPLE_DISHES[0]) => {
    setEditDish(dish);
    setForm({ name: dish.name, price: String(dish.price), is_veg: dish.is_veg, is_bestseller: dish.is_bestseller, category: dish.category, image_url: dish.image_url });
    setShowModal(true);
  };

  const toggleAvailability = (id: string) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, is_available: !d.is_available } : d));
    toast.success('Availability updated');
  };

  const deleteDish = (id: string) => {
    setDishes(prev => prev.filter(d => d.id !== id));
    toast.success('Dish removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editDish) {
      setDishes(prev => prev.map(d => d.id === editDish.id ? { ...d, ...form, price: Number(form.price) } : d));
      toast.success('Dish updated!');
    } else {
      const newDish = { id: Date.now().toString(), ...form, price: Number(form.price), is_available: true, rating: 4.5 };
      setDishes(prev => [...prev, newDish]);
      toast.success('Dish added!');
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Manage Dishes</h1>
            <p className="text-gray-500 text-sm">{dishes.length} items</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={openAdd}
            className="bg-primary-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-orange"
          >
            <Plus className="w-4 h-4" /> Add Dish
          </motion.button>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200 mb-6 max-w-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes..." className="bg-transparent text-sm outline-none w-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((dish, i) => (
            <motion.div key={dish.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative h-40">
                <Image src={dish.image_url} alt={dish.name} fill className="object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`w-5 h-5 rounded flex items-center justify-center ${dish.is_veg ? 'bg-green-500' : 'bg-red-500'}`}>
                    {dish.is_veg ? <Leaf className="w-3 h-3 text-white" /> : <Flame className="w-3 h-3 text-white" />}
                  </span>
                  {dish.is_bestseller && <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">Best</span>}
                </div>
                <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold ${dish.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {dish.is_available ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 leading-tight">{dish.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{dish.category} · ⭐ {dish.rating}</p>
                <p className="font-bold text-primary-600 text-base mt-1">{formatPrice(dish.price)}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => toggleAvailability(dish.id)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors ${dish.is_available ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {dish.is_available ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => openEdit(dish)} className="bg-blue-50 text-blue-600 p-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteDish(dish.id)} className="bg-red-50 text-red-500 p-1.5 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl text-gray-900">{editDish ? 'Edit Dish' : 'Add New Dish'}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Dish Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required min={1}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Image URL</label>
                  <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    <option>Veg Biryani</option>
                    <option>Non-Veg Biryani</option>
                    <option>Combo Meals</option>
                    <option>Sides &amp; Drinks</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_veg} onChange={e => setForm(f => ({ ...f, is_veg: e.target.checked }))}
                      className="w-4 h-4 accent-green-500" />
                    <span className="text-sm text-gray-700 font-medium">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_bestseller} onChange={e => setForm(f => ({ ...f, is_bestseller: e.target.checked }))}
                      className="w-4 h-4 accent-amber-500" />
                    <span className="text-sm text-gray-700 font-medium">Bestseller</span>
                  </label>
                </div>
                <button type="submit"
                  className="w-full bg-primary-500 text-white py-3 rounded-xl font-bold shadow-orange hover:bg-primary-600 transition-colors">
                  {editDish ? 'Save Changes' : 'Add Dish'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
