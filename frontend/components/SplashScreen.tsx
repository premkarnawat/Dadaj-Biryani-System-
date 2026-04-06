'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show once per session
    const shown = sessionStorage.getItem('splash_shown');
    if (shown) { setVisible(false); return; }
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('splash_shown', '1');
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse 90% 80% at 50% 30%, #D94F0A 0%, #8B1A08 55%, #5C0D04 100%)',
          }}
        >
          {/* Texture overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sp" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="35" stroke="#fff" strokeWidth="1" fill="none"/>
                <circle cx="40" cy="40" r="22" stroke="#fff" strokeWidth="0.7" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sp)"/>
          </svg>

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle 400px at 50% 50%, rgba(255,120,0,0.25), transparent)' }}/>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.82, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-5 relative z-10"
          >
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/20"
            >
              <span className="text-6xl">🍛</span>
            </motion.div>

            {/* Brand */}
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={{ opacity: 1, letterSpacing: '0.25em' }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-black uppercase text-white"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                  fontFamily: '"Impact", "Arial Black", sans-serif',
                  textShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                DADAJ
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="text-amber-300 tracking-[0.55em] text-sm font-semibold mt-1 uppercase"
              >
                Biryani
              </motion.p>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="text-white/55 text-xs tracking-widest uppercase"
            >
              Royal taste · Fresh delivery
            </motion.p>

            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="flex gap-1.5 mt-2"
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.22 }}
                  className="w-2 h-2 bg-amber-400 rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
