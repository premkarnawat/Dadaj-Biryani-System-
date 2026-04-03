'use client';

import { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
}: DishCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const controls = useAnimation();
  const imgRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED: Safe cart position (NO SSR error)
  const getCartPosition = () => {
    if (typeof window === 'undefined') {
      return { x: 1200, y: 32 }; // fallback
    }
    return { x: window.innerWidth - 80, y: 32 };
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const cartPos = getCartPosition(); // ✅ FIX

    // 🎬 Fly-to-cart animation
    await controls.start({
      x: [0, cartPos.x - startX],
      y: [0, cartPos.y - startY],
      scale: [1, 0.15],
      opacity: [1, 0],
      transition: { duration: 0.55, ease: 'easeIn' },
    });

    // Reset position
    controls.set({ x: 0, y: 0, scale: 1, opacity: 1 });

    addItem({
      id,
      name,
      price,
      image_url,
      selectedAddOns: [],
    });

    toast.success(`${name} added!`, { icon: '🍛' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(249,115,22,0.18)' }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl overflow-hidden border border-orange-50/80 shadow-sm group cursor-pointer"
    >
      <Link href={`/dishes/${id}`}>
        {/* Image */}
        <div className="relative h-44 overflow-hidden" ref={imgRef}>
          <motion.div animate={controls} className="w-full h-full">
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />

          {/* Veg / Non-veg badge */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span
              className={`w-5 h-5 rounded flex items-center justify-center ${
                is_veg ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {is_veg ? (
                <Leaf className="w-3 h-3 text-white" />
              ) : (
                <Flame className="w-3 h-3 text-white" />
              )}
            </span>

            {is_bestseller && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                🏆 Best
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-800">{rating}</span>
            <span className="text-xs text-gray-400">({rating_count})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
            {name}
          </h3>

          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-bold text-primary-600 text-base">
              {formatPrice(price)}
            </span>

            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
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
