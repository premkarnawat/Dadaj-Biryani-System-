'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    tag: 'Limited Time',
    title: '50% OFF',
    subtitle: 'on your first order',
    code: 'DADAJ50',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    emoji: '🎉',
    accent: 'bg-yellow-400',
  },
  {
    id: 2,
    tag: 'Free Delivery',
    title: 'Orders ₹500+',
    subtitle: 'no delivery fee, ever',
    code: null,
    gradient: 'from-amber-500 via-orange-500 to-red-400',
    emoji: '🛵',
    accent: 'bg-white/30',
  },
  {
    id: 3,
    tag: 'Weekend Special',
    title: 'Combo @ ₹399',
    subtitle: 'Biryani + Raita + Dessert',
    code: 'COMBO39',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    emoji: '🍛',
    accent: 'bg-green-300/40',
  },
  {
    id: 4,
    tag: 'Royal Pick',
    title: 'Hyderabadi Dum',
    subtitle: 'Authentic slow-cooked biryani',
    code: null,
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    emoji: '👑',
    accent: 'bg-purple-300/30',
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const t = setInterval(() => go(1), 4500);
    return () => clearInterval(t);
  }, [current]);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent(c => (c + dir + BANNERS.length) % BANNERS.length);
  };

  const b = BANNERS[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="relative overflow-hidden rounded-3xl h-36 sm:h-44 shadow-lg">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={b.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-r ${b.gradient} flex items-center px-6 sm:px-10 justify-between overflow-hidden`}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

          {/* Floating circle decoration */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`absolute -right-16 -top-16 w-64 h-64 rounded-full ${b.accent}`}
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className={`absolute -left-8 -bottom-8 w-40 h-40 rounded-full ${b.accent}`}
          />

          {/* Content */}
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {b.tag}
              </span>
            </div>
            <h3 className="font-display font-bold text-3xl sm:text-4xl leading-none">{b.title}</h3>
            <p className="text-white/85 text-sm mt-1">{b.subtitle}</p>
            {b.code && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1"
              >
                <Tag className="w-3 h-3" />
                <span className="text-xs font-bold font-mono tracking-wider">{b.code}</span>
              </motion.div>
            )}
          </div>

          {/* Emoji */}
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 text-6xl sm:text-8xl select-none"
          >
            {b.emoji}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/15 hover:bg-black/25 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors z-20"
      >
        <ChevronLeft className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/15 hover:bg-black/25 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors z-20"
      >
        <ChevronRight className="w-4 h-4 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/45'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
