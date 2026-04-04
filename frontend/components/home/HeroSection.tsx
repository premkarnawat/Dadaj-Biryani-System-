'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, Clock } from 'lucide-react';

/* ─── Dish data ─── */
const ALL_DISHES = [
  { id: 1, name: 'Chicken Dum Biryani',   tag: 'Bestseller',   price: '₹299', rating: 4.9, time: '30 min', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=600&fit=crop' },
  { id: 2, name: 'Mutton Dum Biryani',    tag: 'Most Loved',   price: '₹399', rating: 4.8, time: '35 min', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=600&fit=crop' },
  { id: 3, name: 'Hyderabadi Veg Biryani',tag: 'Pure Veg',     price: '₹249', rating: 4.7, time: '25 min', image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=600&h=600&fit=crop' },
  { id: 4, name: 'Prawn Biryani',         tag: 'Chef Special', price: '₹449', rating: 4.8, time: '30 min', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop' },
  { id: 5, name: 'Paneer Biryani',        tag: 'Veg Delight',  price: '₹269', rating: 4.6, time: '25 min', image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&h=600&fit=crop' },
];

/* ─── Each slot's resting transform ─── */
// The y offset (positive = lower) creates the arc illusion:
// side dishes sit 40px below center, forming a visual curve.
const SLOT_CONFIG = [
  { x: -220, y: 40,  scale: 0.82, opacity: 0.72, z: 10, tilt:  8, blur: 0   }, // LEFT
  { x:    0, y:  0,  scale: 1.22, opacity: 1,    z: 30, tilt:  0, blur: 0   }, // CENTER
  { x:  220, y: 40,  scale: 0.82, opacity: 0.72, z: 10, tilt: -8, blur: 0   }, // RIGHT
];

const ENTER_FROM = { x: -420, y: 120, scale: 0.55, opacity: 0 }; // new dish enters bottom-left
const EXIT_TO    = { x:  420, y: 120, scale: 0.55, opacity: 0 }; // old dish exits bottom-right

const SPRING = { type: 'spring', stiffness: 55, damping: 16, mass: 1.1 } as const;

/* ─── Sizes ─── */
const SZ_CENTER = 'clamp(190px, 27vw, 330px)';
const SZ_SIDE   = 'clamp(120px, 17vw, 210px)';

export default function HeroSection() {
  /*
    `slots` = array of 3 dish-indices currently visible.
    slots[0] = LEFT, slots[1] = CENTER, slots[2] = RIGHT.

    On each tick we:
      1. Record `slots[2]` as the dish that will EXIT.
      2. Pull `nextDish` into `slots[0]` (entering LEFT).
      3. Shift: new slots = [nextDish, old[0], old[1]].
  */
  const [slots,    setSlots]    = useState([0, 1, 2]);
  const [exitDish, setExitDish] = useState<number | null>(null);
  const [entering, setEntering] = useState(false);
  const nextIdx = useRef(3); // index of next dish to enter

  // Preload next image whenever slots change
  useEffect(() => {
    const n = nextIdx.current % ALL_DISHES.length;
    const img = new window.Image();
    img.src = ALL_DISHES[n].image;
  }, [slots]);

  function advance() {
    setSlots(prev => {
      const outgoing = prev[2];              // exits to bottom-right
      const incoming = nextIdx.current % ALL_DISHES.length;
      nextIdx.current += 1;

      setExitDish(outgoing);
      setEntering(true);

      // After animation settles clear flags
      setTimeout(() => {
        setExitDish(null);
        setEntering(false);
      }, 1000);

      return [incoming, prev[0], prev[1]];   // shift: new → LEFT, old LEFT → CENTER, old CENTER → RIGHT
    });
  }

  useEffect(() => {
    const id = setInterval(advance, 4200);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const centerDish = ALL_DISHES[slots[1]];

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col"
      style={{ minHeight: '88vh', paddingTop: '4rem' }}
    >
      {/* ══ BACKGROUND (unchanged) ══ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 75% at 50% 25%, #BF2B0A 0%, #8B1A08 45%, #5C0D04 100%)' }} />
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bgpat" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="42" stroke="#fff" strokeWidth="1"   fill="none" />
              <circle cx="50" cy="50" r="28" stroke="#fff" strokeWidth="0.8" fill="none" />
              <circle cx="50" cy="50" r="14" stroke="#fff" strokeWidth="0.6" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgpat)" />
        </svg>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '35%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.35))' }} />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="relative z-10 flex flex-col flex-1 items-center">

        {/* ── Heading ── */}
        <div className="text-center mt-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="h-px w-10 bg-amber-400/60" />
            <span className="text-amber-300 text-xs font-bold uppercase" style={{ letterSpacing: '0.45em' }}>
              Authentic Indian
            </span>
            <div className="h-px w-10 bg-amber-400/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-black uppercase leading-none"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              color: '#F5E0C8',
              fontFamily: '"Impact", "Arial Black", sans-serif',
              textShadow: '0 4px 28px rgba(0,0,0,0.55)',
            }}
          >
            ROYAL BIRYANI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-amber-100/60 text-sm sm:text-base mt-2 tracking-wide"
          >
            Slow-cooked in royal dum tradition · Delivered fresh
          </motion.p>
        </div>

        {/* ══ ARC DISH STAGE ══ */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{ minHeight: 'clamp(270px, 44vw, 430px)', marginTop: '0.5rem' }}
        >
          {/* Wooden arc board */}
          <svg
            className="absolute pointer-events-none"
            style={{ width: 'clamp(400px, 74vw, 850px)', top: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}
            viewBox="0 0 860 380" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="wg2" cx="50%" cy="10%" r="80%">
                <stop offset="0%"   stopColor="#D4924A" />
                <stop offset="50%"  stopColor="#A0642A" />
                <stop offset="100%" stopColor="#6E3E12" />
              </radialGradient>
              <pattern id="wg2grain" x="0" y="0" width="6" height="360" patternUnits="userSpaceOnUse">
                <line x1="3" y1="0" x2="3" y2="360" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <path d="M 30 370 C 30 140 220 10 430 10 C 640 10 830 140 830 370" fill="url(#wg2)" stroke="#7A4A18" strokeWidth="2"/>
            <path d="M 30 370 C 30 140 220 10 430 10 C 640 10 830 140 830 370" fill="url(#wg2grain)"/>
            <path d="M 140 370 C 140 195 278 80 430 80 C 582 80 720 195 720 370" fill="#7B1008"/>
            <path d="M 135 370 C 135 192 276 75 430 75 C 584 75 725 192 725 370" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="10"/>
          </svg>

          {/* ── 3 active slot dishes ── */}
          {slots.map((dishIdx, slotIdx) => {
            const dish = ALL_DISHES[dishIdx % ALL_DISHES.length];
            const cfg  = SLOT_CONFIG[slotIdx];
            const isCenter = slotIdx === 1;
            const sz   = isCenter ? SZ_CENTER : SZ_SIDE;

            // Is this the dish that JUST entered? Start from ENTER_FROM.
            const isEntering = entering && slotIdx === 0;

            return (
              <motion.div
                key={`slot-${slotIdx}-${dishIdx}`}
                initial={isEntering ? ENTER_FROM : false}
                animate={{
                  x:       cfg.x,
                  y:       cfg.y,
                  scale:   cfg.scale,
                  opacity: cfg.opacity,
                  rotate:  cfg.tilt,
                }}
                transition={SPRING}
                style={{
                  position: 'absolute',
                  zIndex:   cfg.z,
                  display:  'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Floating on center only */}
                <motion.div
                  animate={isCenter ? { y: [0, -13, 0] } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'relative' }}
                >
                  {/* Glow under center */}
                  {isCenter && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -18,
                        left: '10%',
                        width: '80%',
                        height: 38,
                        borderRadius: '50%',
                        background: 'rgba(220,80,0,0.52)',
                        filter: 'blur(22px)',
                        zIndex: -1,
                      }}
                    />
                  )}

                  {/* Dish image circle */}
                  <div
                    style={{
                      width:  sz,
                      height: sz,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: isCenter
                        ? '0 0 55px rgba(220,80,0,0.5), 0 28px 70px rgba(0,0,0,0.65)'
                        : '0 10px 36px rgba(0,0,0,0.55)',
                      border: isCenter
                        ? '5px solid rgba(255,255,255,0.13)'
                        : '3px solid rgba(255,255,255,0.08)',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      priority={isCenter}
                      className="object-cover"
                      sizes={isCenter ? '330px' : '210px'}
                      style={{
                        filter: isCenter
                          ? 'brightness(1.08) contrast(1.05) saturate(1.1)'
                          : 'brightness(0.82) contrast(0.95) saturate(0.9)',
                      }}
                    />
                    {/* Rim shadow */}
                    <div style={{ position:'absolute',inset:0,borderRadius:'50%',boxShadow:'inset 0 0 24px rgba(0,0,0,0.35)',pointerEvents:'none' }} />
                    {/* Side dish vignette */}
                    {!isCenter && (
                      <div style={{ position:'absolute',inset:0,borderRadius:'50%',background:'rgba(80,10,0,0.25)',pointerEvents:'none' }} />
                    )}
                  </div>

                  {/* Center badges */}
                  {isCenter && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, type: 'spring', damping: 14 }}
                        style={{
                          position:'absolute', bottom:-2, right:-14, zIndex:40,
                          background:'white', borderRadius:14,
                          boxShadow:'0 4px 18px rgba(0,0,0,0.18)',
                          padding:'6px 12px',
                          border:'1px solid rgba(249,115,22,0.15)',
                        }}
                      >
                        <p style={{ fontSize:10, color:'#9ca3af', lineHeight:1, marginBottom:2 }}>{dish.tag}</p>
                        <p style={{ fontSize:17, fontWeight:800, color:'#ea580c', lineHeight:1 }}>{dish.price}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring', damping: 14 }}
                        style={{
                          position:'absolute', top:8, left:-16, zIndex:40,
                          background:'white', borderRadius:14,
                          boxShadow:'0 4px 18px rgba(0,0,0,0.18)',
                          padding:'6px 10px',
                          border:'1px solid rgba(249,115,22,0.15)',
                          display:'flex', alignItems:'center', gap:5,
                        }}
                      >
                        <Star style={{ width:13,height:13,fill:'#FBBF24',color:'#FBBF24' }} />
                        <span style={{ fontWeight:700, fontSize:13, color:'#1f2937' }}>{dish.rating}</span>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            );
          })}

          {/* ── Exiting dish (RIGHT → EXIT) ── */}
          {exitDish !== null && (
            <motion.div
              key={`exit-${exitDish}`}
              initial={{ x: 220, y: 40, scale: 0.82, opacity: 0.72, rotate: -8 }}
              animate={EXIT_TO}
              transition={SPRING}
              style={{ position:'absolute', zIndex:5 }}
            >
              <div
                style={{
                  width: SZ_SIDE, height: SZ_SIDE,
                  borderRadius:'50%', overflow:'hidden', position:'relative',
                  boxShadow:'0 10px 36px rgba(0,0,0,0.55)',
                  border:'3px solid rgba(255,255,255,0.08)',
                }}
              >
                <Image
                  src={ALL_DISHES[exitDish % ALL_DISHES.length].image}
                  alt="" fill className="object-cover"
                  style={{ filter:'brightness(0.82) contrast(0.95)' }}
                  sizes="210px"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Center dish info + CTA ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={centerDish.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38 }}
            className="flex flex-col items-center gap-4 pb-10 px-4 mt-2"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="h-px w-8 bg-amber-400/50" />
                <p className="text-amber-300 text-xs font-semibold uppercase" style={{ letterSpacing:'0.35em' }}>
                  {centerDish.tag}
                </p>
                <div className="h-px w-8 bg-amber-400/50" />
              </div>
              <h2
                className="font-display font-bold text-white text-xl sm:text-2xl"
                style={{ textShadow:'0 2px 12px rgba(0,0,0,0.4)' }}
              >
                {centerDish.name}
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-amber-200/60 text-xs">
                <Clock className="w-3 h-3" />
                <span>{centerDish.time}</span>
              </div>
            </div>

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

            {/* Dots */}
            <div className="flex gap-2">
              {ALL_DISHES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:      slots[1] === i ? 24 : 8,
                    height:     8,
                    background: slots[1] === i ? '#F59E0B' : 'rgba(255,255,255,0.28)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
