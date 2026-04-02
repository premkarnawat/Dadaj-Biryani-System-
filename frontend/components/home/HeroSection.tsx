'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, MapPin } from 'lucide-react';

const FEATURED_DISHES = [
  { id: 1, name: 'Chicken Dum Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop', angle: 0 },
  { id: 2, name: 'Mutton Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=300&fit=crop', angle: 72 },
  { id: 3, name: 'Veg Biryani', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=300&h=300&fit=crop', angle: 144 },
  { id: 4, name: 'Prawn Biryani', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop', angle: 216 },
  { id: 5, name: 'Hyderabadi Biryani', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop', angle: 288 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white overflow-hidden flex items-center pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 -right-20 w-96 h-96 border-2 border-orange-200/40 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-6 text-center lg:text-left"
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
            <span className="text-gray-900">Biryani</span>
            <br />
            <span className="gradient-text">Royale</span>
            <br />
            <span className="text-gray-700 text-4xl sm:text-5xl">Experience</span>
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            Crafted with the finest Basmati rice and royal Dum-pukht tradition. Every grain tells a story of authentic flavors passed down through generations.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 justify-center lg:justify-start">
            <div className="text-center">
              <p className="font-bold text-2xl text-gray-900">4.8</p>
              <div className="flex gap-0.5 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Rating</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="font-bold text-2xl text-gray-900">10K+</p>
              <p className="text-xs text-gray-500 mt-1">Orders Delivered</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center flex items-center gap-1">
              <Clock className="w-4 h-4 text-primary-500" />
              <div>
                <p className="font-bold text-2xl text-gray-900">30</p>
                <p className="text-xs text-gray-500">Min Delivery</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 justify-center lg:justify-start">
            <Link href="/dishes">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-orange hover:shadow-lg transition-all"
              >
                Order Now 🍛
              </motion.button>
            </Link>
            <Link href="/dishes">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-white text-gray-700 px-8 py-3.5 rounded-2xl font-semibold text-base border border-orange-200 hover:border-primary-400 transition-all"
              >
                View Menu
              </motion.button>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 justify-center lg:justify-start">
            <MapPin className="w-4 h-4 text-primary-400" />
            <span>Delivering to Pune & nearby areas</span>
          </div>
        </motion.div>

        {/* Right: Rotating dish circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex items-center justify-center h-[400px] sm:h-[500px]"
        >
          {/* Central dish */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-10 w-44 h-44 rounded-full overflow-hidden shadow-2xl ring-4 ring-white ring-offset-4 ring-offset-orange-50"
          >
            <Image
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop"
              alt="Signature Biryani"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="text-white text-xs font-bold bg-primary-500/80 px-2 py-0.5 rounded-full">
                Signature
              </span>
            </div>
          </motion.div>

          {/* Orbit ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute w-72 h-72 sm:w-80 sm:h-80"
          >
            {FEATURED_DISHES.map((dish) => {
              const rad = (dish.angle * Math.PI) / 180;
              const r = 140;
              const x = r * Math.cos(rad);
              const y = r * Math.sin(rad);

              return (
                <motion.div
                  key={dish.id}
                  style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)` }}
                  className="absolute w-14 h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-white"
                  whileHover={{ scale: 1.3 }}
                >
                  <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Outer dashed ring */}
          <div className="absolute w-80 h-80 sm:w-96 sm:h-96 border-2 border-dashed border-orange-200/50 rounded-full" />

          {/* Floating badge */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card px-3 py-2 border border-orange-100"
          >
            <p className="text-xs text-gray-500">Today&apos;s Special</p>
            <p className="font-bold text-sm text-primary-600">Hyderabadi Dum</p>
            <p className="text-xs text-gray-700 font-semibold">₹299 only</p>
          </motion.div>

          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card px-3 py-2 border border-orange-100"
          >
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-800">4.9</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Best in City</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
