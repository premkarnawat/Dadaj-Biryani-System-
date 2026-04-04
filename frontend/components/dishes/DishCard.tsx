'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus, Leaf, Flame, Clock } from 'lucide-react';
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
  is_bestseller: boolean;
  prepTime?: string;
  cat?: string;
  category?: string;
  onClick?: () => void;
}

export default function DishCard({
  id,
  name,
  description,
  price,
  image_url,
  rating,
  rating_count,
  is_veg,
  is_bestseller,
  prepTime = '25–30 min',
  cat,
  category,
  onClick,
}: DishCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const displayCategory = cat || category;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image_url, selectedAddOns: [] });
    toast.success(`${name} added to cart!`, { icon: '🍛' });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(); // for modal
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <Link href={`/dishes/${id}`} className="block">
        {/* ── Card shell ── */}
        <div
          className="relative bg-white rounded-3xl overflow-hidden"
          style={{
            boxShadow:
              '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* ── Image ── */}
          <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <span
                className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${
                  is_veg ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {is_veg ? (
                  <Leaf className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Flame className="w-3.5 h-3.5 text-white" />
                )}
              </span>

              {is_bestseller && (
                <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                  🏆 Best
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-800">{rating}</span>
              <span className="text-xs text-gray-400">({rating_count})</span>
            </div>
          </div>

          {/* ── Info ── */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-gray-900 text-base leading-snug">
                  {name}
                </h3>

                <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {description}
                </p>

                {/* Category */}
                {displayCategory && (
                  <p className="text-xs text-primary-500 mt-1 font-medium">
                    {displayCategory}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-gray-300" />
                  <span className="text-xs text-gray-400">
                    {prepTime}
                  </span>
                </div>
              </div>

              {/* Price + Add */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="font-bold text-primary-600 text-lg leading-none">
                  {formatPrice(price)}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={handleAdd}
                  className="w-9 h-9 bg-primary-500 hover:bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-orange transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
