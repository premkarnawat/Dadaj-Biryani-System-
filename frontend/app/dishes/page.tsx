'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Leaf, Flame } from 'lucide-react';
import DishCard from '@/components/dishes/DishCard';

const ALL_DISHES = [
  { id: 'chicken-dum', name: 'Chicken Dum Biryani', description: 'Slow-cooked tender chicken layered with fragrant basmati rice and royal spices.', price: 299, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop', rating: 4.9, rating_count: 1240, is_veg: false, is_bestseller: true, category: 'non-veg-biryani' },
  { id: 'mutton-dum', name: 'Mutton Dum Biryani', description: 'Tender mutton pieces in aromatic dum-cooked basmati – the royal classic.', price: 399, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop', rating: 4.8, rating_count: 980, is_veg: false, is_bestseller: true, category: 'non-veg-biryani' },
  { id: 'veg-hyd', name: 'Hyderabadi Veg Biryani', description: 'Mixed vegetables and paneer cooked with saffron-infused rice.', price: 249, image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&h=400&fit=crop', rating: 4.7, rating_count: 650, is_veg: true, is_bestseller: true, category: 'veg-biryani' },
  { id: 'prawn-biryani', name: 'Prawn Biryani', description: 'Juicy tiger prawns marinated in coastal spices, layered with long-grain basmati.', price: 449, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', rating: 4.8, rating_count: 530, is_veg: false, is_bestseller: false, category: 'non-veg-biryani' },
  { id: 'paneer-biryani', name: 'Paneer Biryani', description: 'Creamy cottage cheese cubes in aromatic rice with Mughlai spices.', price: 269, image_url: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop', rating: 4.6, rating_count: 440, is_veg: true, is_bestseller: false, category: 'veg-biryani' },
  { id: 'egg-biryani', name: 'Egg Biryani', description: 'Boiled eggs cooked with whole spices and basmati rice.', price: 199, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', rating: 4.5, rating_count: 380, is_veg: false, is_bestseller: false, category: 'non-veg-biryani' },
  { id: 'mushroom-biryani', name: 'Mushroom Biryani', description: 'Fresh button mushrooms in aromatic basmati — light yet flavorful.', price: 229, image_url: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=400&h=400&fit=crop', rating: 4.5, rating_count: 290, is_veg: true, is_bestseller: false, category: 'veg-biryani' },
  { id: 'fish-biryani', name: 'Fish Biryani', description: 'Coastal-style biryani with marinated fish fillets and tangy spices.', price: 379, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', rating: 4.6, rating_count: 320, is_veg: false, is_bestseller: false, category: 'non-veg-biryani' },
];

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Non-Veg', value: 'non-veg-biryani' },
  { label: 'Veg', value: 'veg-biryani' },
  { label: 'Combos', value: 'combo-meals' },
  { label: 'Sides', value: 'sides-drinks' },
];

export default function DishesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  const filtered = ALL_DISHES
    .filter((d) => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
      if (vegOnly && !d.is_veg) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.rating_count - a.rating_count;
    });

  return (
    <div className="min-h-screen bg-brand-cream pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="py-6">
          <h1 className="font-display font-bold text-3xl text-gray-900">Our Menu</h1>
          <p className="text-gray-400 mt-1">{filtered.length} delicious biryanis await you</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-orange-100 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search biryanis..."
              className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-orange-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none shadow-sm"
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Veg Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
              vegOnly
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-600 border-orange-100 hover:border-green-400'
            }`}
          >
            <Leaf className="w-4 h-4" />
            Veg Only
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white shadow-orange'
                  : 'bg-white text-gray-600 border border-orange-100 hover:border-primary-300'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Dishes Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-6xl mb-4">🍛</p>
              <h3 className="font-display font-semibold text-xl text-gray-600">No dishes found</h3>
              <p className="text-gray-400 mt-1">Try a different search or filter</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              {filtered.map((dish, i) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <DishCard {...dish} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
