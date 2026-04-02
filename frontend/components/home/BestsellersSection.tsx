'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import DishCard from '@/components/dishes/DishCard';

const BESTSELLERS = [
  {
    id: 'chicken-dum',
    name: 'Chicken Dum Biryani',
    description: 'Slow-cooked tender chicken layered with fragrant basmati rice and royal spices.',
    price: 299,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    rating: 4.9,
    rating_count: 1240,
    is_veg: false,
    is_bestseller: true,
  },
  {
    id: 'mutton-dum',
    name: 'Mutton Dum Biryani',
    description: 'Tender mutton pieces in aromatic dum-cooked basmati – the royal classic.',
    price: 399,
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop',
    rating: 4.8,
    rating_count: 980,
    is_veg: false,
    is_bestseller: true,
  },
  {
    id: 'veg-hyd',
    name: 'Hyderabadi Veg Biryani',
    description: 'Mixed vegetables and paneer cooked with saffron-infused rice in authentic dum style.',
    price: 249,
    image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&h=400&fit=crop',
    rating: 4.7,
    rating_count: 650,
    is_veg: true,
    is_bestseller: true,
  },
  {
    id: 'prawn-biryani',
    name: 'Prawn Biryani',
    description: 'Juicy tiger prawns marinated in coastal spices, layered with long-grain basmati.',
    price: 449,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop',
    rating: 4.8,
    rating_count: 530,
    is_veg: false,
    is_bestseller: false,
  },
];

export default function BestsellersSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">
            🏆 Bestsellers
          </h2>
          <p className="text-gray-400 text-sm mt-1">Most loved by our customers</p>
        </div>
        <Link href="/dishes" className="text-primary-500 text-sm font-semibold hover:text-primary-700">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {BESTSELLERS.map((dish, i) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <DishCard {...dish} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
