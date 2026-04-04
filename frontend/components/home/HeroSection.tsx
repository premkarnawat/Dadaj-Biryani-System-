'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, Clock } from 'lucide-react';

/* ─────────────────────────────────────────────
   DISH DATA
───────────────────────────────────────────── */
const ALL_DISHES = [
  {
    id: 1,
    name: 'Chicken Dum Biryani',
    tag: 'Bestseller',
    price: '₹299',
    rating: 4.9,
    time: '30 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Mutton Dum Biryani',
    tag: 'Most Loved',
    price: '₹399',
    rating: 4.8,
    time: '35 min',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Hyderabadi Veg Biryani',
    tag: 'Pure Veg',
    price: '₹249',
    rating: 4.7,
    time: '25 min',
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=600&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Prawn Biryani',
    tag: 'Chef Special',
    price: '₹449',
    rating: 4.8,
    time: '30 min',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'Paneer Biryani',
    tag: 'Veg Delight',
    price: '₹269',
    rating: 4.6,
    time: '25 min',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&h=600&fit=crop',
  },
];

/* ─────────────────────────────────────────────
   ARC POSITIONS  (3 slots: left / center / right)
   y is POSITIVE → lower on screen → arc curves down
───────────────────────────────────────────── */
const SLOTS = [
  // left
  { x: -210, y: 60,  scale: 0.72, opacity: 0.55, z: 10,  blur: 1.5 },
  // center
  { x: 0,    y: 0,   scale: 1.18, opacity: 1,    z: 30,  blur: 0   },
  // right
  { x: 210,  y: 60,  scale: 0.72, opacity: 0.55, z: 10,  blur: 1.5 },
];

// Off-screen entry (from left) and exit (to right)
const OFF_LEFT  = { x: -480, y: 120, scale: 0.5,  opacity: 0 };
const OFF_RIGHT = { x:  480, y: 120, scale: 0.5,  opacity: 0 };

/* ─────────────────────────────────────────────
   DISH sizes (responsive via CSS clamp)
───────────────────────────────────────────── */
const SIZE_CENTER = 'clamp(200px, 28vw, 340px)';
const SIZE_SIDE   = 'clamp(130px, 18vw, 220px)';

/* ─────────────────────────────────────────────
   SPRING config
───────────────────────────────────────────── */
const SPRING = { type: 'spring', stiffness: 62, damping: 18, mass: 1 } as const;

/* ─────────────────────────────────────────────
   HELPER — dish image circle
───────────────────────────────────────────── */
function DishCircle({
  src, alt, size, glow,
}: { src: string; alt: string; size: string; glow: boolean }) {
  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{
        width: size, height: size,
        boxShadow: glow
          ? '0 0 60px rgba(220,80,0,0.55), 0 24px 64px rgba(0,0,0,0.6)'
          : '0 12px 40px rgba(0,0,0,0.55)',
        border: '4px solid rgba(255,255,255,0.10)',
        flexShrink: 0,
      }}
    >
      <Image src={src} alt={alt} fill priority className="object-cover" sizes="340px" />
      {/* Inner rim shadow */}
      <div className="absolute inset-0 rounded-full shadow-inner ring-2 ring-black/20 pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function HeroSection() {
  // `queue` is a sliding window: we always show indices [0,1,2]
  // index 0 = left, 1 = center, 2 = right
  // Every tick we push a new dish in from left and pop right out
  const [queue, setQueue]         = useState([0, 1, 2]);          // indices into ALL_DISHES
  const [entering, setEntering]   = useState<number | null>(null); // dish idx coming in from off-left
  const [exiting,  setExiting]    = useState<number | null>(null); // dish idx going off-right
  const nextRef                   = useRef(3 % ALL_DISHES.length); // next dish to enter

  /* Preload next image */
  useEffect(() => {
    const img = new window.Image();
    img.src = ALL_DISHES[nextRef.current].image;
  }, [queue]);

  /* Auto-advance every 4 s */
  useEffect(() => {
    const id = setInterval(advance, 4000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function advance() {
    setQueue(prev => {
      const exitIdx  = prev[2];               // rightmost exits
      const enterIdx = nextRef.current;       // new one enters from left
      nextRef.current = (enterIdx + 1) % ALL_DISHES.length;

      setExiting(exitIdx);
      setEntering(enterIdx);

      // Shift: drop rightmost, prepend new
      return [enterIdx, prev[0], prev[1]];
    });

    // Clear exit/enter flags after animation settles
    setTimeout(() => {
      setExiting(null);
      setEntering(null);
    }, 900);
  }

  const centerDish = ALL_DISHES[queue[1]];

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: '88vh', paddingTop: '4rem' }}
    >
      {/* ══ BACKGROUND ══ */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 75% at 50% 25%, #BF2B0A 0%, #8B1A08 45%, #5C0D04 100%)',
          }}
        />
        {/* Swirl / mandala texture */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.07 }}
        >
          <defs>
            <pattern id="arc-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="42" stroke="#fff" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="28" stroke="#fff" strokeWidth="0.8" fill="none" />
              <circle cx="50" cy="50" r="14" stroke="#fff" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arc-pattern)" />
        </svg>
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        {/* Bottom fade to page */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '35%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.35))',
          }}
        />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="relative z-10 flex flex-col flex-1 items-center">

        {/* ── Top: subtitle + heading ── */}
        <div className="text-center mt-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="h-px w-10 bg-amber-400/60" />
            <span
              className="text-amber-300 text-xs font-bold uppercase"
              style={{ letterSpacing: '0.45em' }}
            >
              Authentic Indian
            </span>
            <div className="h-px w-10 bg-amber-400/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-black uppercase leading-none text-center"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              color: '#F5E0C8',
              fontFamily: '"Impact", "Arial Black", sans-serif',
              textShadow: '0 4px 28px rgba(0,0,0,0.55)',
              letterSpacing: '-0.01em',
            }}
          >
            ROYAL BIRYANI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-amber-100/60 text-sm sm:text-base mt-2 tracking-wide"
          >
            Slow-cooked in royal dum tradition · Delivered fresh
          </motion.p>
        </div>

        {/* ── ARC DISH STAGE ── */}
        <div
          className="relative flex items-center justify-center w-full flex-1"
          style={{ minHeight: 'clamp(260px, 42vw, 420px)', marginTop: '1rem' }}
        >
          {/* Wooden arc board SVG — behind dishes */}
          <svg
            className="absolute pointer-events-none"
            style={{
              width: 'clamp(420px, 75vw, 860px)',
              top: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
            }}
            viewBox="0 0 860 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="wg" cx="50%" cy="10%" r="80%">
                <stop offset="0%"   stopColor="#D4924A" />
                <stop offset="50%"  stopColor="#A0642A" />
                <stop offset="100%" stopColor="#6E3E12" />
              </radialGradient>
              <pattern id="wgrain" x="0" y="0" width="6" height="360" patternUnits="userSpaceOnUse">
                <line x1="3" y1="0" x2="3" y2="360" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
              </pattern>
            </defs>
            {/* Outer arc */}
            <path
              d="M 30 370 C 30 140 220 10 430 10 C 640 10 830 140 830 370"
              fill="url(#wg)"
              stroke="#7A4A18" strokeWidth="2"
            />
            <path
              d="M 30 370 C 30 140 220 10 430 10 C 640 10 830 140 830 370"
              fill="url(#wgrain)"
            />
            {/* Inner cutout */}
            <path
              d="M 140 370 C 140 195 278 80 430 80 C 582 80 720 195 720 370"
              fill="#7B1008"
            />
            {/* Inner shadow */}
            <path
              d="M 135 370 C 135 192 276 75 430 75 C 584 75 725 192 725 370"
              fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="10"
            />
          </svg>

          {/* ── 3 dishes on the arc ── */}
          {/* Each dish is positioned absolutely relative to this container */}
          <div
            className="absolute"
            style={{
              width: '100%',
              height: '100%',
              top: 0, left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Render 3 slots + entering ghost */}
            {queue.map((dishIdx, slotIdx) => {
              const dish = ALL_DISHES[dishIdx];
              const slot = SLOTS[slotIdx];
              const isCenter = slotIdx === 1;
              const size = isCenter ? SIZE_CENTER : SIZE_SIDE;

              return (
                <motion.div
                  key={`${dishIdx}-${slotIdx}`}
                  initial={
                    slotIdx === 0 && entering === dishIdx
                      ? { ...OFF_LEFT }
                      : { x: slot.x, y: slot.y, scale: slot.scale, opacity: slot.opacity }
                  }
                  animate={{
                    x: slot.x,
                    y: slot.y,
                    scale: slot.scale,
                    opacity: slot.opacity,
                    filter: `blur(${slot.blur}px)`,
                  }}
                  transition={SPRING}
                  style={{
                    position: 'absolute',
                    zIndex: slot.z,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <motion.div
                    /* subtle float for center dish only */
                    animate={isCenter ? { y: [0, -12, 0] } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Glow under center dish */}
                    {isCenter && (
                      <div
                        className="absolute rounded-full blur-3xl"
                        style={{
                          width: '80%', height: 40,
                          bottom: -20, left: '10%',
                          background: 'rgba(220,80,0,0.55)',
                          zIndex: -1,
                        }}
                      />
                    )}
                    <DishCircle src={dish.image} alt={dish.name} size={size} glow={isCenter} />

                    {/* Center dish: price + rating badge */}
                    {isCenter && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35, type: 'spring', damping: 14 }}
                          className="absolute bg-white rounded-2xl shadow-xl px-3 py-2 border border-orange-100"
                          style={{ bottom: -4, right: -16, zIndex: 40 }}
                        >
                          <p className="text-xs text-gray-400 leading-none mb-0.5">{dish.tag}</p>
                          <p className="font-bold text-primary-600 text-lg leading-none">{dish.price}</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.45, type: 'spring', damping: 14 }}
                          className="absolute bg-white rounded-2xl shadow-xl px-3 py-2 border border-orange-100 flex items-center gap-1.5"
                          style={{ top: 10, left: -18, zIndex: 40 }}
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-sm text-gray-800">{dish.rating}</span>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Exiting dish — animates off to right */}
            {exiting !== null && (
              <motion.div
                key={`exit-${exiting}`}
                initial={{ x: 210, y: 60, scale: 0.72, opacity: 0.55 }}
                animate={{ ...OFF_RIGHT }}
                transition={SPRING}
                style={{ position: 'absolute', zIndex: 5 }}
              >
                <DishCircle
                  src={ALL_DISHES[exiting].image}
                  alt=""
                  size={SIZE_SIDE}
                  glow={false}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Center dish info + CTA ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={centerDish.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4 pb-10 px-4 mt-2"
          >
            {/* Dish name + time */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="h-px w-8 bg-amber-400/50" />
                <p
                  className="text-amber-300 text-xs font-semibold uppercase"
                  style={{ letterSpacing: '0.35em' }}
                >
                  {centerDish.tag}
                </p>
                <div className="h-px w-8 bg-amber-400/50" />
              </div>
              <h2
                className="font-display font-bold text-white text-xl sm:text-2xl"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                {centerDish.name}
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-amber-200/60 text-xs">
                <Clock className="w-3 h-3" />
                <span>{centerDish.time}</span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/dishes">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 36px rgba(245,158,11,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2.5 font-bold text-sm uppercase px-10 py-3.5 rounded-full border-2 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  borderColor: 'rgba(245,158,11,0.75)',
                  color: '#F5E6D0',
                  backdropFilter: 'blur(12px)',
                  letterSpacing: '0.18em',
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                ORDER NOW
              </motion.button>
            </Link>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {ALL_DISHES.map((_, i) => {
                const isCenter = queue[1] === i;
                return (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:   isCenter ? 24 : 8,
                      height:  8,
                      background: isCenter ? '#F59E0B' : 'rgba(255,255,255,0.30)',
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
