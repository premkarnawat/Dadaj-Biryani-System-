'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, ArrowRight, Leaf, Flame } from 'lucide-react';

const DISHES = [
  {
    id: 1,
    name: 'Chicken Dum Biryani',
    tagline: 'Slow-cooked in royal dum tradition',
    price: 299,
    rating: 4.9,
    reviews: '1.2k',
    is_veg: false,
    badge: 'Bestseller',
    color: '#FFF3E8',
    glow: 'rgba(249,115,22,0.22)',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&h=700&fit=crop',
  },
  {
    id: 2,
    name: 'Mutton Dum Biryani',
    tagline: 'Tender mutton, aged basmati',
    price: 399,
    rating: 4.8,
    reviews: '980',
    is_veg: false,
    badge: 'Most Loved',
    color: '#FFF0E5',
    glow: 'rgba(234,88,12,0.20)',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&h=700&fit=crop',
  },
  {
    id: 3,
    name: 'Hyderabadi Veg Biryani',
    tagline: 'Saffron-kissed, rich & aromatic',
    price: 249,
    rating: 4.7,
    reviews: '650',
    is_veg: true,
    badge: 'Pure Veg',
    color: '#F0FDF4',
    glow: 'rgba(34,197,94,0.18)',
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=700&h=700&fit=crop',
  },
  {
    id: 4,
    name: 'Prawn Biryani',
    tagline: 'Coastal spices, tiger prawns',
    price: 449,
    rating: 4.8,
    reviews: '530',
    is_veg: false,
    badge: 'Chef Special',
    color: '#FFF8EC',
    glow: 'rgba(245,158,11,0.22)',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700&h=700&fit=crop',
  },
];

// Preload next image
function usePreload(dishes: typeof DISHES, current: number) {
  useEffect(() => {
    const next = (current + 1) % dishes.length;
    const img = new window.Image();
    img.src = dishes[next].image;
  }, [current, dishes]);
}

const DISH_SIZE_DESKTOP = 380;
const DISH_SIZE_MOBILE  = 240;

export default function HeroSection() {
  const [index, setIndex]   = useState(0);
  const [show,  setShow]    = useState(true);
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null);

  usePreload(DISHES, index);

  // cycle: show 3.8s → exit 0.55s → next
  const schedule = () => {
    timerRef.current = setTimeout(() => setShow(false), 3800);
  };

  useEffect(() => {
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onExitComplete = () => {
    setIndex(i => (i + 1) % DISHES.length);
    setShow(true);
  };

  const dish = DISHES[index];

  /* ── variants ── */
  const imgVariants = {
    initial: { x: 220, opacity: 0, scale: 0.80 },
    animate: {
      x: 0, opacity: 1, scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      y: 160, opacity: 0, scale: 0.88,
      transition: { duration: 0.5, ease: [0.55, 0, 1, 0.45] },
    },
  };

  const infoVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.45, ease: 'easeOut' } },
    exit:    { opacity: 0, y: -12, transition: { duration: 0.25 } },
  };

  return (
    <section
      className="relative w-full overflow-hidden pt-16"
      style={{ minHeight: '82vh', background: `linear-gradient(135deg, ${dish.color} 0%, #fffbf5 60%, #fff 100%)` }}
    >
      {/* Background glow blob — follows dish color */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`blob-${dish.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 right-0 w-[60vw] h-[80vh] pointer-events-none -z-0"
          style={{ background: `radial-gradient(ellipse at 70% 40%, ${dish.glow} 0%, transparent 70%)` }}
        />
      </AnimatePresence>

      {/* ── CONTENT GRID ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 h-full flex items-center"
           style={{ minHeight: 'calc(82vh - 4rem)' }}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10 lg:py-0">

          {/* ══ LEFT — Text ══ */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 space-y-5">

            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold"
            >
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Open Now · Delivering in 30 mins
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="font-display font-bold text-gray-900 leading-[1.08]"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)' }}
            >
              Taste the<br />
              <span className="gradient-text">Royal Biryani</span><br />
              <span style={{ fontSize: '0.72em', color: '#6b7280', fontWeight: 600 }}>
                Experience
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-gray-400 text-base sm:text-lg max-w-md leading-relaxed"
            >
              Authentic Dum-pukht tradition crafted with the finest Basmati
              and hand-picked spices — delivered fresh to your door.
            </motion.p>

            {/* Animated dish info (sync with right side) */}
            <AnimatePresence mode="wait">
              {show && (
                <motion.div
                  key={`badge-${dish.id}`}
                  variants={infoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl px-4 py-3 shadow-sm w-fit"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${dish.is_veg ? 'bg-green-50' : 'bg-red-50'}`}>
                    {dish.is_veg
                      ? <Leaf  className="w-4 h-4 text-green-600" />
                      : <Flame className="w-4 h-4 text-red-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{dish.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-500">{dish.rating} · {dish.reviews} reviews</span>
                      <span className="text-xs font-bold text-primary-600 ml-1">₹{dish.price}</span>
                    </div>
                  </div>
                  <span className="ml-auto text-xs bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full">
                    {dish.badge}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center gap-6"
            >
              {[
                { v: '4.8★', l: 'Rating' },
                { v: '10K+', l: 'Orders' },
                { v: '30m',  l: 'Delivery', icon: <Clock className="w-3.5 h-3.5 text-primary-400 inline mr-0.5" /> },
              ].map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="font-bold text-xl text-gray-900">{s.icon}{s.v}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.l}</p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.42 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Link href="/dishes">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-orange flex items-center gap-2 text-[15px]"
                >
                  Order Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/dishes">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-700 px-8 py-3.5 rounded-2xl font-semibold border border-orange-200 hover:border-primary-400 transition-all text-[15px]"
                >
                  View Menu
                </motion.button>
              </Link>
            </motion.div>

            {/* Dot indicators */}
            <div className="flex gap-2 pt-2">
              {DISHES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setShow(false); setTimeout(() => { setIndex(i); setShow(true); }, 120); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-7 bg-primary-500' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ══ RIGHT — Dish image ══ */}
          <div
            className="relative flex items-center justify-center order-1 lg:order-2"
            style={{ minHeight: DISH_SIZE_MOBILE + 60 }}
          >
            {/* Decorative ring behind dish */}
            <div
              className="absolute rounded-full border-2 border-dashed border-orange-200/50"
              style={{ width: DISH_SIZE_DESKTOP + 80, height: DISH_SIZE_DESKTOP + 80, maxWidth: '90vw', maxHeight: '90vw' }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: DISH_SIZE_DESKTOP + 40,
                height: DISH_SIZE_DESKTOP + 40,
                maxWidth: '85vw',
                maxHeight: '85vw',
                background: `radial-gradient(circle, ${dish.glow} 0%, transparent 70%)`,
              }}
            />

            {/* THE DISH */}
            <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
              {show && (
                <motion.div
                  key={dish.id}
                  variants={imgVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative z-10"
                  style={{
                    width:  `clamp(${DISH_SIZE_MOBILE}px, 36vw, ${DISH_SIZE_DESKTOP}px)`,
                    height: `clamp(${DISH_SIZE_MOBILE}px, 36vw, ${DISH_SIZE_DESKTOP}px)`,
                  }}
                >
                  {/* Floating animation wrapper */}
                  <motion.div
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                    className="w-full h-full"
                  >
                    {/* Glow shadow under dish */}
                    <div
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full blur-2xl"
                      style={{
                        width: '75%', height: 40,
                        background: dish.glow.replace('0.22', '0.45').replace('0.20', '0.40').replace('0.18', '0.35'),
                      }}
                    />

                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      priority
                      className="object-cover rounded-full"
                      style={{
                        boxShadow: `0 32px 80px ${dish.glow.replace('0.22','0.35')}, 0 8px 32px rgba(0,0,0,0.10)`,
                      }}
                      sizes={`(max-width: 768px) ${DISH_SIZE_MOBILE}px, ${DISH_SIZE_DESKTOP}px`}
                    />

                    {/* White ring */}
                    <div className="absolute inset-0 rounded-full ring-8 ring-white/70 pointer-events-none" />

                    {/* Price badge floating on image */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring', damping: 14 }}
                      className="absolute bottom-6 right-0 bg-white rounded-2xl shadow-lg px-4 py-2.5 border border-orange-100"
                    >
                      <p className="text-xs text-gray-400 leading-none mb-0.5">{dish.badge}</p>
                      <p className="font-bold text-primary-600 text-lg leading-none">₹{dish.price}</p>
                    </motion.div>

                    {/* Rating badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring', damping: 14 }}
                      className="absolute top-4 -left-2 bg-white rounded-2xl shadow-lg px-3 py-2 border border-orange-100 flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-sm text-gray-800">{dish.rating}</span>
                      <span className="text-xs text-gray-400">/ 5</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="white" fillOpacity="0.6"/>
        </svg>
      </div>
    </section>
  );
}
