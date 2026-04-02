'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  {
    slug: 'veg-biryani',
    name: 'Veg Biryani',
    description: 'Fresh vegetables & spices',
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=300&h=300&fit=crop',
    color: 'from-green-400 to-emerald-500',
    badge: '🌿',
    count: 8,
  },
  {
    slug: 'non-veg-biryani',
    name: 'Non-Veg Biryani',
    description: 'Succulent meats & aromatic spices',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop',
    color: 'from-red-400 to-orange-500',
    badge: '🍗',
    count: 12,
  },
  {
    slug: 'combo-meals',
    name: 'Combo Meals',
    description: 'Complete meal deals',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=300&fit=crop',
    color: 'from-amber-400 to-yellow-500',
    badge: '🍱',
    count: 5,
  },
  {
    slug: 'sides-drinks',
    name: 'Sides & Drinks',
    description: 'Raita, shorba & beverages',
    image: 'https://images.unsplash.com/photo-1622480651131-2e3c3cdb6eef?w=300&h=300&fit=crop',
    color: 'from-blue-400 to-cyan-500',
    badge: '🥤',
    count: 10,
  },
];

export default function CategoriesSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">Categories</h2>
          <p className="text-gray-400 text-sm mt-1">What are you craving today?</p>
        </div>
        <Link href="/dishes" className="text-primary-500 text-sm font-semibold hover:text-primary-700">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/dishes?category=${cat.slug}`}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden rounded-2xl h-36 sm:h-44 cursor-pointer shadow-card group"
              >
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60`} />
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <p className="text-2xl mb-1">{cat.badge}</p>
                  <h3 className="text-white font-bold text-sm leading-tight">{cat.name}</h3>
                  <p className="text-white/80 text-xs">{cat.count} items</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
