'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus, Leaf, Flame } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface DishCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  rating_count: number;
  is_veg: boolean;
  is_bestseller?: boolean;
}

export default function DishCard({ id, name, description, price, image_url, rating, rating_count, is_veg, is_bestseller }: DishCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image_url, selectedAddOns: [] });
    toast.success(`${name} added to cart!`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card border border-orange-50 hover:shadow-orange transition-all duration-300 group"
    >
      <Link href={`/dishes/${id}`}>
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className={`w-5 h-5 rounded flex items-center justify-center ${is_veg ? 'bg-green-500' : 'bg-red-500'}`}>
              {is_veg ? <Leaf className="w-3 h-3 text-white" /> : <Flame className="w-3 h-3 text-white" />}
            </span>
            {is_bestseller && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                🏆 Bestseller
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-800">{rating}</span>
            <span className="text-xs text-gray-400">({rating_count})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-gray-900 text-base leading-tight mb-1">{name}</h3>
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">{description}</p>

          <div className="flex items-center justify-between">
            <span className="font-bold text-primary-600 text-lg">{formatPrice(price)}</span>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleAddToCart}
              className="bg-primary-500 hover:bg-primary-600 text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
