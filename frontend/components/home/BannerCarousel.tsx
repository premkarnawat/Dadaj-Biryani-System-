'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: '50% OFF on First Order',
    subtitle: 'Use code: DADAJ50',
    bg: 'from-orange-500 to-red-500',
    emoji: '🎉',
  },
  {
    id: 2,
    title: 'Free Delivery Above ₹500',
    subtitle: 'Order more, save more!',
    bg: 'from-amber-500 to-orange-500',
    emoji: '🛵',
  },
  {
    id: 3,
    title: 'Weekend Special Combo',
    subtitle: 'Biryani + Raita + Dessert @ ₹399',
    bg: 'from-red-500 to-pink-500',
    emoji: '🍛',
  },
  {
    id: 4,
    title: 'Royal Hyderabadi Dum',
    subtitle: 'Authentic Dum-pukht method',
    bg: 'from-emerald-500 to-teal-500',
    emoji: '👑',
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + BANNERS.length) % BANNERS.length);
  const next = () => setCurrent((c) => (c + 1) % BANNERS.length);

  return (
    <div className="relative overflow-hidden rounded-2xl h-36 sm:h-44 mx-4 sm:mx-0 shadow-card">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-r ${BANNERS[current].bg} flex items-center justify-between px-8`}
        >
          <div className="text-white">
            <p className="text-sm font-semibold opacity-90 mb-1">Limited Time Offer</p>
            <h3 className="font-display font-bold text-2xl sm:text-3xl leading-tight">
              {BANNERS[current].title}
            </h3>
            <p className="text-sm mt-1 opacity-85">{BANNERS[current].subtitle}</p>
          </div>
          <div className="text-6xl sm:text-8xl opacity-80 select-none">
            {BANNERS[current].emoji}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
