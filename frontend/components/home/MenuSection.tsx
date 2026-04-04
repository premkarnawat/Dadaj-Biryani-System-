'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DishCard from '@/components/dishes/DishCard';
import DishModal from '@/components/dishes/DishModal';

const CATEGORIES = ['All', 'Non-Veg', 'Veg', 'Combos'];

const DISHES = [
  { id: 'chicken-dum',  name: 'Chicken Dum Biryani',   description: 'Slow-cooked tender chicken layered with fragrant basmati rice and royal spices. Served with raita and salan.', price: 299, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop', rating: 4.9, rating_count: 1240, is_veg: false, is_bestseller: true,  prepTime: '30–35 min', cat: 'Non-Veg' },
  { id: 'mutton-dum',   name: 'Mutton Dum Biryani',     description: 'Tender mutton pieces in aromatic dum-cooked basmati. Overnight marinated, slow-braised for 5 hours.',         price: 399, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop', rating: 4.8, rating_count: 980,  is_veg: false, is_bestseller: true,  prepTime: '35–40 min', cat: 'Non-Veg' },
  { id: 'veg-hyd',      name: 'Hyderabadi Veg Biryani', description: 'Saffron-infused basmati with fresh paneer and seasonal vegetables. Rich Mughlai spice base.',               price: 249, image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=600&h=400&fit=crop', rating: 4.7, rating_count: 650,  is_veg: true,  is_bestseller: true,  prepTime: '25–30 min', cat: 'Veg'    },
  { id: 'prawn',        name: 'Prawn Biryani',           description: 'Tiger prawns marinated in coastal spices, layered with long-grain basmati. A seafood lover\'s dream.',       price: 449, image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop', rating: 4.8, rating_count: 530,  is_veg: false, is_bestseller: false, prepTime: '30–35 min', cat: 'Non-Veg' },
  { id: 'paneer',       name: 'Paneer Biryani',          description: 'Creamy cottage cheese cubes tossed in Mughlai spices, layered with aromatic aged basmati.',                  price: 269, image_url: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&h=400&fit=crop', rating: 4.6, rating_count: 440,  is_veg: true,  is_bestseller: false, prepTime: '25–30 min', cat: 'Veg'    },
  { id: 'egg',          name: 'Egg Biryani',             description: 'Golden boiled eggs cooked with whole spices and fragrant basmati. Light yet deeply satisfying.',             price: 199, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', rating: 4.5, rating_count: 380,  is_veg: false, is_bestseller: false, prepTime: '20–25 min', cat: 'Non-Veg' },
  { id: 'combo1',       name: 'Royal Family Combo',      description: 'Chicken Dum + Mutton Dum + 2 Raitas + 1 Salan. Feeds 4 people royally. Best value deal.',                    price: 899, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', rating: 4.9, rating_count: 210,  is_veg: false, is_bestseller: true,  prepTime: '40–45 min', cat: 'Combos' },
];

type Dish = typeof DISHES[number];

export default function MenuSection() {
  const [activeTab,   setActiveTab]   = useState('All');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filtered = activeTab === 'All'
    ? DISHES
    : DISHES.filter(d => d.cat === activeTab);

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 px-1">
        <div>
          <p className="text-primary-500 text-xs font-bold tracking-widest uppercase mb-1">Our Menu</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 leading-tight">
            Made Fresh,<br className="hidden sm:block" /> Every Order
          </h2>
        </div>
        <Link href="/dishes">
          <motion.span whileHover={{ x: 3 }} className="text-primary-500 text-sm font-semibold cursor-pointer hidden sm:block">
            See all →
          </motion.span>
        </Link>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-7 px-1">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.93 }}
            onClick={() => setActiveTab(cat)}
            className={`flex-shrink-0 px-5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              activeTab === cat
                ? 'bg-primary-500 text-white shadow-orange'
                : 'bg-white text-gray-600 border border-orange-100 hover:border-primary-300'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((dish, i) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.38 }}
            >
              <DishCard
                {...dish}
                onClick={() => setSelectedDish(dish)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Mobile see all */}
      <div className="mt-8 text-center sm:hidden">
        <Link href="/dishes">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="bg-white border border-orange-200 text-gray-700 px-8 py-3 rounded-2xl font-semibold text-sm hover:border-primary-400 transition-all"
          >
            See Full Menu →
          </motion.button>
        </Link>
      </div>

      {/* Dish Modal */}
      <AnimatePresence>
        {selectedDish && (
          <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
