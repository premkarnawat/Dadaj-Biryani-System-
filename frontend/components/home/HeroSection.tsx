'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

/* ── Dish data ── */
const DISHES = [
  {
    id: 1,
    name: 'CHICKEN DUM\nBIRYANI',
    subtitle: 'SLOW-COOKED · ROYAL SPICES',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&h=700&fit=crop',
    price: '₹299',
    left:  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=300&fit=crop',
    right: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=300&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'MUTTON DUM\nBIRYANI',
    subtitle: 'AGED BASMATI · TENDER MUTTON',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&h=700&fit=crop',
    price: '₹399',
    left:  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop',
    right: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'HYDERABADI\nVEG BIRYANI',
    subtitle: 'SAFFRON RICE · PURE VEG',
    image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=700&h=700&fit=crop',
    price: '₹249',
    left:  'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=300&h=300&fit=crop',
    right: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop',
  },
];

/* ── Tilt hook ── */
function useTilt(strength = 8) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 120, damping: 20 });
  const ry = useSpring(y, { stiffness: 120, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width  - 0.5;
    const py = (e.clientY - rect.top)  / rect.height - 0.5;
    x.set( py * strength);
    y.set(-px * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return { rx, ry, onMove, onLeave };
}

export default function HeroSection() {
  const [idx,  setIdx]  = useState(0);
  const [show, setShow] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* cycle every 5 s */
  useEffect(() => {
    timer.current = setTimeout(() => setShow(false), 4200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [idx]);

  const onExit = () => {
    setIdx(i => (i + 1) % DISHES.length);
    setShow(true);
  };

  const dish = DISHES[idx];
  const tilt = useTilt(10);

  /* variants */
  const centerV = {
    initial: { scale: 0.72, opacity: 0, y: 60 },
    animate: { scale: 1,    opacity: 1, y: 0,  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
    exit:    { scale: 0.85, opacity: 0, y: 80, transition: { duration: 0.5,  ease: [0.55, 0, 1, 0.45] } },
  };
  const sideV = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1,   opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
    exit:    { scale: 0.8, opacity: 0, transition: { duration: 0.35 } },
  };
  const textV = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0,  transition: { delay: 0.3, duration: 0.5  } },
    exit:    { opacity: 0, y: -10, transition: { duration: 0.25 } },
  };

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ minHeight: '100vh', paddingTop: '4rem' }}
    >
      {/* ══ RICH RED BACKGROUND ══ */}
      <div className="absolute inset-0 z-0" style={{ background: '#8B1A1A' }}>
        {/* Subtle radial light center */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 30%, #B22222 0%, #7B0E0E 55%, #5C0A0A 100%)' }}
        />
        {/* Swirl pattern overlay — SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="swirl" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path
                d="M60 10 C80 10, 110 30, 110 60 C110 90, 80 110, 60 110 C40 110, 10 90, 10 60 C10 30, 40 10, 60 10 Z
                   M60 25 C72 25, 95 42, 95 60 C95 78, 72 95, 60 95 C48 95, 25 78, 25 60 C25 42, 48 25, 60 25 Z"
                stroke="#fff" strokeWidth="1.5" fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#swirl)" />
        </svg>
        {/* Vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
      </div>

      {/* ══ WOODEN ARC BOARD ══ */}
      <div className="absolute z-10 pointer-events-none" style={{ top: '-8%', left: '50%', transform: 'translateX(-50%)', width: '110%', maxWidth: 1100 }}>
        <svg viewBox="0 0 1100 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <defs>
            <radialGradient id="woodGrad" cx="50%" cy="20%" r="70%">
              <stop offset="0%"   stopColor="#C68B47" />
              <stop offset="40%"  stopColor="#A0662A" />
              <stop offset="100%" stopColor="#7A4A18" />
            </radialGradient>
            {/* Wood grain lines */}
            <pattern id="grain" x="0" y="0" width="8" height="300" patternUnits="userSpaceOnUse">
              <line x1="4" y1="0" x2="4" y2="300" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
            </pattern>
          </defs>
          {/* Outer arc */}
          <path
            d="M 50 480 C 50 180, 280 20, 550 20 C 820 20, 1050 180, 1050 480"
            fill="url(#woodGrad)"
            stroke="#8B5A20"
            strokeWidth="2"
          />
          {/* Wood grain overlay */}
          <path
            d="M 50 480 C 50 180, 280 20, 550 20 C 820 20, 1050 180, 1050 480"
            fill="url(#grain)"
          />
          {/* Inner arc cutout (hollow ring) */}
          <path
            d="M 160 480 C 160 230, 330 90, 550 90 C 770 90, 940 230, 940 480"
            fill="#8B1A1A"
          />
          {/* Subtle inner shadow */}
          <path
            d="M 155 480 C 155 226, 328 85, 550 85 C 772 85, 945 226, 945 480"
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="8"
          />
        </svg>
      </div>

      {/* ══ FLOATING MICRO ELEMENTS ══ */}
      {/* Left: Boiled egg */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute z-20 pointer-events-none"
        style={{ left: '4%', top: '42%', width: 90 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1607532941433-304659e8198a?w=180&h=180&fit=crop"
          alt="egg" width={90} height={90}
          className="rounded-full shadow-2xl object-cover"
          style={{ border: '3px solid rgba(255,255,255,0.15)' }}
        />
      </motion.div>
      {/* Left: Chili */}
      <motion.div
        animate={{ y: [0, 10, 0], rotate: [10, -5, 10] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute z-20 pointer-events-none"
        style={{ left: '7%', top: '62%' }}
      >
        <div className="text-5xl drop-shadow-lg">🌶️</div>
      </motion.div>
      {/* Left: Spoon */}
      <motion.div
        animate={{ rotate: [-25, -20, -25], y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute z-20 pointer-events-none"
        style={{ left: '1%', top: '72%' }}
      >
        <div className="text-5xl drop-shadow-lg" style={{ transform: 'rotate(-25deg)' }}>🥄</div>
        <div className="text-4xl drop-shadow-lg mt-1" style={{ transform: 'rotate(-20deg)', marginLeft: 8 }}>🥄</div>
      </motion.div>

      {/* Right: Spices */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute z-20 pointer-events-none"
        style={{ right: '5%', top: '44%' }}
      >
        <div className="text-5xl drop-shadow-lg">🫙</div>
      </motion.div>
      {/* Right: Mint */}
      <motion.div
        animate={{ y: [0, 8, 0], x: [0, 4, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute z-20 pointer-events-none"
        style={{ right: '3%', top: '62%' }}
      >
        <div className="text-5xl drop-shadow-lg">🫚</div>
      </motion.div>
      {/* Right: Handi */}
      <motion.div
        animate={{ rotate: [8, 14, 8], y: [0, -5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute z-20 pointer-events-none"
        style={{ right: '1%', top: '74%' }}
      >
        <div className="text-5xl drop-shadow-lg" style={{ transform: 'rotate(8deg)' }}>🫕</div>
        <div className="text-4xl drop-shadow-lg" style={{ transform: 'rotate(12deg)', marginLeft: 12 }}>🌿</div>
      </motion.div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="relative z-30 flex flex-col items-center" style={{ minHeight: '100vh', paddingTop: '2rem' }}>

        {/* ── subtitle above heading ── */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center gap-3 mb-3 mt-6"
        >
          <div className="h-px w-10 bg-amber-300/70" />
          <span className="text-amber-300 text-xs font-semibold tracking-[0.45em] uppercase">Authentic Indian</span>
          <div className="h-px w-10 bg-amber-300/70" />
        </motion.div>

        {/* ── BIG HEADING ── */}
        <AnimatePresence mode="wait">
          {show && (
            <motion.h1
              key={`title-${dish.id}`}
              variants={textV}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center font-black uppercase leading-none tracking-tight"
              style={{
                fontSize: 'clamp(3.2rem, 9vw, 7.5rem)',
                color: '#F5E6D0',
                fontFamily: '"Impact", "Arial Black", sans-serif',
                textShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1)',
                letterSpacing: '-0.01em',
                whiteSpace: 'pre-line',
              }}
            >
              {dish.name}
            </motion.h1>
          )}
        </AnimatePresence>

        {/* ── THREE BOWLS LAYOUT ── */}
        <div
          className="relative w-full flex items-end justify-center"
          style={{ marginTop: '-1rem', minHeight: 420 }}
        >
          {/* LEFT small bowl */}
          <AnimatePresence mode="wait">
            {show && (
              <motion.div
                key={`left-${dish.id}`}
                variants={sideV}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute z-20"
                style={{ left: '8%', top: 20 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  className="relative cursor-pointer"
                  style={{ width: 'clamp(100px,14vw,170px)', height: 'clamp(100px,14vw,170px)' }}
                >
                  <Image
                    src={dish.left}
                    alt="side dish"
                    fill
                    className="object-cover rounded-full"
                    style={{
                      boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                      border: '4px solid rgba(255,255,255,0.12)',
                    }}
                  />
                  {/* Dark bowl rim overlay */}
                  <div className="absolute inset-0 rounded-full ring-4 ring-black/30 pointer-events-none" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT small bowl */}
          <AnimatePresence mode="wait">
            {show && (
              <motion.div
                key={`right-${dish.id}`}
                variants={sideV}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute z-20"
                style={{ right: '8%', top: 20 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  className="relative cursor-pointer"
                  style={{ width: 'clamp(100px,14vw,170px)', height: 'clamp(100px,14vw,170px)' }}
                >
                  <Image
                    src={dish.right}
                    alt="side dish"
                    fill
                    className="object-cover rounded-full"
                    style={{
                      boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                      border: '4px solid rgba(255,255,255,0.12)',
                    }}
                  />
                  <div className="absolute inset-0 rounded-full ring-4 ring-black/30 pointer-events-none" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CENTER big bowl */}
          <div
            className="relative z-30 mx-auto"
            onMouseMove={tilt.onMove}
            onMouseLeave={tilt.onLeave}
            style={{ width: 'clamp(240px,38vw,420px)', height: 'clamp(240px,38vw,420px)' }}
          >
            <AnimatePresence mode="wait" onExitComplete={onExit}>
              {show && (
                <motion.div
                  key={dish.id}
                  variants={centerV}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ rotateX: tilt.rx, rotateY: tilt.ry, transformPerspective: 800 }}
                  className="w-full h-full"
                >
                  {/* Floating animation */}
                  <motion.div
                    animate={{ y: [0, -16, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    className="w-full h-full relative"
                  >
                    {/* Glow under bowl */}
                    <div
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full blur-3xl"
                      style={{ width: '80%', height: 50, background: 'rgba(200,80,0,0.5)' }}
                    />
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      priority
                      className="object-cover rounded-full"
                      style={{
                        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.4)',
                        border: '5px solid rgba(255,255,255,0.10)',
                      }}
                      sizes="(max-width:768px) 240px, 420px"
                    />
                    {/* Rim shadow */}
                    <div className="absolute inset-0 rounded-full ring-8 ring-black/20 pointer-events-none" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom info + CTA ── */}
        <AnimatePresence mode="wait">
          {show && (
            <motion.div
              key={`cta-${dish.id}`}
              variants={textV}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center gap-4 mt-2 pb-10"
            >
              {/* Dish subtitle + price */}
              <div className="text-center">
                <div className="flex items-center gap-3 justify-center mb-1">
                  <div className="h-px w-8 bg-amber-400/50" />
                  <p className="text-amber-300 text-xs font-semibold tracking-[0.35em]">{dish.subtitle}</p>
                  <div className="h-px w-8 bg-amber-400/50" />
                </div>
                <p className="text-white/60 text-sm tracking-widest font-medium">{dish.price}</p>
              </div>

              {/* CTA */}
              <Link href="/dishes">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 0 32px rgba(245,158,11,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2.5 font-bold text-sm tracking-[0.2em] uppercase px-10 py-4 rounded-full border-2 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderColor: 'rgba(245,158,11,0.7)',
                    color: '#F5E6D0',
                    backdropFilter: 'blur(12px)',
                    letterSpacing: '0.2em',
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  ORDER NOW
                </motion.button>
              </Link>

              {/* Dot indicators */}
              <div className="flex gap-2 mt-1">
                {DISHES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setShow(false); setTimeout(() => { setIdx(i); setShow(true); }, 100); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === idx
                        ? 'w-6 h-2 bg-amber-400'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
