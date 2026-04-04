'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import CartDrawer from '@/components/cart/CartDrawer';

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const onHero = !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          onHero
            ? { background: 'transparent' }
            : {
                background: 'rgba(255,251,245,0.92)',
                backdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(249,115,22,0.12)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              }
        }
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-orange">
              <span className="text-white font-display font-bold text-lg">D</span>
            </div>
            <div>
              <p className={`font-display font-bold text-lg leading-none transition-colors ${onHero ? 'text-amber-200' : 'text-primary-600'}`}>
                DADAJ
              </p>
              <p className={`text-xs tracking-widest transition-colors ${onHero ? 'text-amber-300/70' : 'text-gray-400'}`}>
                BIRYANI
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {([['/', 'Home'], ['/dishes', 'Menu'], ['/tracking', 'Track Order'], ['/help', 'Help']] as [string, string][]).map(([href, label]) => (
              <Link key={href} href={href}>
                <span className={`text-sm font-medium transition-colors hover:text-primary-400 ${onHero ? 'text-amber-100/90' : 'text-gray-600'}`}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className={`relative px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                onHero
                  ? 'bg-white/10 border border-white/20 text-amber-100 hover:bg-white/20'
                  : 'bg-primary-500 text-white shadow-orange'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:block text-sm font-semibold">Cart</span>
              <AnimatePresence>
                {itemCount() > 0 && (
                  <motion.span
                    key={itemCount()}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <Link href={user ? '/profile' : '/auth'}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  onHero
                    ? 'bg-white/10 border border-white/20 text-amber-100 hover:bg-white/20'
                    : 'bg-white border border-orange-100 text-gray-600 hover:border-primary-300'
                }`}
              >
                <User className="w-4 h-4" />
              </motion.div>
            </Link>

            <button
              onClick={() => setMenuOpen(m => !m)}
              className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                onHero
                  ? 'bg-white/10 border border-white/20 text-amber-100'
                  : 'bg-white border border-orange-100 text-gray-600'
              }`}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-sm border-t border-orange-100"
            >
              <div className="px-4 py-3 space-y-1">
                {([['/', 'Home'], ['/dishes', 'Menu'], ['/tracking', 'Track Order'], ['/help', 'Help']] as [string, string][]).map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                    <div className="py-2.5 text-sm font-medium text-gray-700 border-b border-orange-50 last:border-0">
                      {label}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}
