'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, ChevronRight } from 'lucide-react';

const DISHES = [
  { id: 1, name: 'Chicken Dum Biryani',     price: 299, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop', rating: 4.9 },
  { id: 2, name: 'Mutton Dum Biryani',       price: 399, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop', rating: 4.8 },
  { id: 3, name: 'Hyderabadi Veg Biryani',   price: 249, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=400&h=400&fit=crop', rating: 4.7 },
  { id: 4, name: 'Prawn Biryani',            price: 449, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', rating: 4.8 },
  { id: 5, name: 'Egg Biryani',              price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', rating: 4.5 },
];

const ORBIT_RADIUS = 130; // px from center

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);

  // Continuous rotation: 1 full rotation per 12 seconds
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setAngle(prev => {
        const next = (prev + 0.5) % 360;
        // Snap active index to whichever dish is at top
        const step = 360 / DISHES.length;
        const topAngle = (360 - next + 90) % 360;
        const idx = Math.round(topAngle / step) % DISHES.length;
        setActiveIndex(idx);
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [paused]);

  const active = DISHES[activeIndex];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/60 to-white overflow-hidden flex items-center pt-16">
      {/* Decorative blobs */}
      <div className="absolute top-16 right-0 w-80 h-80 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 left-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-12">

        {/* ── Left: Text ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 text-center lg:text-left order-2 lg:order-1"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Now Open · Delivering in 30 mins
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-gray-900">Royal</span><br />
            <span className="gradient-text">Biryani</span><br />
            <span className="text-gray-600 text-4xl sm:text-5xl">Delivered Fresh</span>
          </h1>

          {/* Active dish info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl px-4 py-3 inline-flex items-center gap-3 shadow-sm"
            >
              <div>
                <p className="font-bold text-gray-900 text-sm">{active.name}</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">{active.rating}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs font-semibold text-primary-600">₹{active.price}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <div className="flex items-center gap-6 justify-center lg:justify-start">
            {[
              { label: 'Rating', value: '4.8★' },
              { label: 'Orders', value: '10K+' },
              { label: 'Delivery', value: '30 min', icon: Clock },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-bold text-xl text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center lg:justify-start">
            <Link href="/dishes">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-orange flex items-center gap-2"
              >
                Order Now <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/dishes">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-white text-gray-700 px-8 py-3.5 rounded-2xl font-semibold border border-orange-200 hover:border-primary-400 transition-all"
              >
                View Menu
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* ── Right: Orbital Dishes ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center order-1 lg:order-2"
          style={{ height: 420 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Outer dashed ring */}
          <div className="absolute w-72 h-72 border-2 border-dashed border-orange-200/50 rounded-full" />
          <div className="absolute w-80 h-80 border border-orange-100/30 rounded-full" />

          {/* Orbit dishes */}
          {DISHES.map((dish, i) => {
            const step = 360 / DISHES.length;
            const rawAngle = (angle + i * step) * (Math.PI / 180);
            const x = ORBIT_RADIUS * Math.cos(rawAngle);
            const y = ORBIT_RADIUS * Math.sin(rawAngle);
            const isActive = i === activeIndex;
            const scale = isActive ? 1 : 0.62;
            const blur = isActive ? 0 : 2;
            const zIndex = isActive ? 20 : 10;
            const size = isActive ? 110 : 68;

            return (
              <motion.div
                key={dish.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  x: x - size / 2,
                  y: y - size / 2,
                  zIndex,
                }}
                animate={{ scale, filter: `blur(${blur}px)` }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: isActive ? 1.08 : 0.72, filter: 'blur(0px)' }}
                onClick={() => { setActiveIndex(i); setPaused(true); setTimeout(() => setPaused(false), 3000); }}
                className="cursor-pointer"
              >
                <div
                  className={`rounded-full overflow-hidden ring-4 transition-all duration-300 ${
                    isActive
                      ? 'ring-primary-400 shadow-orange shadow-xl'
                      : 'ring-white/80 shadow-md'
                  }`}
                  style={{ width: size, height: size }}
                >
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    width={size}
                    height={size}
                    className="object-cover w-full h-full"
                  />
                </div>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm"
                  >
                    ₹{dish.price}
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Center logo / brand badge */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-30 w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-orange ring-4 ring-white"
          >
            <span className="text-white font-display font-bold text-3xl">D</span>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-0 bg-white rounded-2xl shadow-card px-3 py-2 border border-orange-100 z-30"
          >
            <p className="text-xs text-gray-400">Today&apos;s Special</p>
            <p className="font-bold text-sm text-primary-600">Hyderabadi Dum</p>
            <p className="text-xs font-semibold text-gray-700">₹299 only</p>
          </motion.div>

          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute bottom-8 left-0 bg-white rounded-2xl shadow-card px-3 py-2 border border-orange-100 z-30"
          >
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-800">4.9</span>
            </div>
            <p className="text-xs text-gray-500">Best in City</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
