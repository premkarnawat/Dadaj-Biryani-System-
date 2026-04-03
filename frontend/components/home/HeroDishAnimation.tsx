'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, ChevronRight, Leaf, Flame } from 'lucide-react';

const DISHES = [
  {
    id: 1,
    name: 'Chicken Dum Biryani',
    tagline: 'Slow-cooked royal dum tradition',
    price: 299,
    rating: 4.9,
    reviews: 1240,
    is_veg: false,
    tag: '🏆 Bestseller',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Mutton Dum Biryani',
    tagline: 'Tender mutton, aged basmati rice',
    price: 399,
    rating: 4.8,
    reviews: 980,
    is_veg: false,
    tag: '🔥 Most Loved',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Hyderabadi Veg Biryani',
    tagline: 'Saffron-kissed, rich & aromatic',
    price: 249,
    rating: 4.7,
    reviews: 650,
    is_veg: true,
    tag: '🌿 Pure Veg',
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=600&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Prawn Biryani',
    tagline: 'Coastal spices, tiger prawns',
    price: 449,
    rating: 4.8,
    reviews: 530,
    is_veg: false,
    tag: '🦐 Chef Special',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'Paneer Biryani',
    tagline: 'Creamy paneer, Mughlai spices',
    price: 269,
    rating: 4.6,
    reviews: 440,
    is_veg: true,
    tag: '🧀 Veg Delight',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&h=600&fit=crop',
  },
];

// Dish: enter from right, stay center, exit downward
const dishVariants = {
  initial: {
    x: 160,
    opacity: 0,
    scale: 0.82,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x:       { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
      opacity: { duration: 0.4,  ease: 'easeOut' },
      scale:   { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  exit: {
    y: 130,
    opacity: 0,
    scale: 0.88,
    transition: {
      y:       { duration: 0.5, ease: [0.55, 0, 1, 0.45] },
      opacity: { duration: 0.35, ease: 'easeIn' },
      scale:   { duration: 0.5, ease: 'easeIn' },
    },
  },
};

// Text fades in after dish settles
const textVariants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.45, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

export default function HeroDishAnimation() {
  const [index, setIndex]   = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    // Show dish for 3.4s, then exit (0.5s), then show next
    const show = setTimeout(() => setActive(false), 3400);
    return () => clearTimeout(show);
  }, [index]);

  useEffect(() => {
    if (active) return;
    // After exit animation (0.5s), advance index
    const next = setTimeout(() => {
      setIndex(i => (i + 1) % DISHES.length);
      setActive(true);
    }, 520);
    return () => clearTimeout(next);
  }, [active]);

  const dish = DISHES[index];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50/60 to-white pt-16">
      {/* ── Decorative blobs ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center text-center"
           style={{ minHeight: '72vh', paddingTop: '3rem', paddingBottom: '3rem' }}>

        {/* ── Brand pill ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
        >
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          Now Open · Delivering in 30 mins
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-gray-900 mb-2 leading-tight"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
        >
          Royal <span className="gradient-text">Biryani</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-400 text-base sm:text-lg mb-8"
        >
          Authentic Dum-pukht tradition — delivered fresh to you
        </motion.p>

        {/* ── CONVEYOR DISH ── */}
        <div
          className="relative flex items-center justify-center w-full"
          style={{ height: 'clamp(220px, 38vw, 360px)' }}
        >
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={dish.id}
                variants={dishVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute flex flex-col items-center"
              >
                {/* Dish image */}
                <div
                  className="relative rounded-full overflow-hidden ring-8 ring-white shadow-2xl"
                  style={{
                    width:  'clamp(200px, 32vw, 320px)',
                    height: 'clamp(200px, 32vw, 320px)',
                    boxShadow: '0 24px 64px rgba(249,115,22,0.28), 0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Soft shadow under dish */}
                <div className="w-3/4 h-5 bg-black/10 blur-xl rounded-full -mt-3 mx-auto" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Dish Info (synced with dish) ── */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={`info-${dish.id}`}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center mt-4 space-y-3"
            >
              {/* Tag + veg indicator */}
              <div className="flex items-center gap-2">
                <span className="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">
                  {dish.tag}
                </span>
                <span className={`w-5 h-5 rounded flex items-center justify-center ${dish.is_veg ? 'bg-green-500' : 'bg-red-500'}`}>
                  {dish.is_veg
                    ? <Leaf  className="w-3 h-3 text-white" />
                    : <Flame className="w-3 h-3 text-white" />}
                </span>
              </div>

              {/* Name */}
              <h2 className="font-display font-bold text-gray-900 text-2xl sm:text-3xl">
                {dish.name}
              </h2>

              {/* Tagline */}
              <p className="text-gray-400 text-sm sm:text-base">{dish.tagline}</p>

              {/* Price + rating row */}
              <div className="flex items-center gap-4">
                <span className="font-bold text-primary-600 text-2xl">₹{dish.price}</span>
                <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-xl px-3 py-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-800 text-sm">{dish.rating}</span>
                  <span className="text-gray-400 text-xs">({dish.reviews})</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dot indicators ── */}
        <div className="flex gap-2 mt-6">
          {DISHES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setActive(true); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-7 bg-primary-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-6 sm:gap-10 mt-8"
        >
          {[
            { label: 'Rating', value: '4.8★' },
            { label: 'Orders', value: '10K+' },
            { label: 'Delivery', value: '30 min', sub: <Clock className="w-3 h-3 inline mr-0.5 text-primary-400" /> },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-bold text-xl text-gray-900">{s.sub}{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-3 mt-8 mb-4"
        >
          <Link href="/dishes">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-orange flex items-center gap-2 text-base"
            >
              Order Now <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link href="/dishes">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-white text-gray-700 px-8 py-3.5 rounded-2xl font-semibold border border-orange-200 hover:border-primary-400 transition-all text-base"
            >
              View Menu
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
