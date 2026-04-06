'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import CartDrawer from '@/components/cart/CartDrawer';

const NAV_LINKS: [string, string][] = [['/', 'Home'], ['/dishes', 'Menu'], ['/tracking', 'Track Order'], ['/help', 'Help']];

export default function TopNav() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { itemCount, toggleCart } = useCartStore();
  const { user }                  = useAuthStore();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // On hero (dark bg) = transparent + light text | scrolled = white glass + dark text
  const onHero = !scrolled;

  const headerStyle = onHero
    ? { background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }
    : { background: 'rgba(255,251,245,0.94)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(249,115,22,0.12)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' };

  return (
    <>
      <motion.header
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={headerStyle}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-start leading-none flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-orange flex-shrink-0">
                <span className="text-white font-display font-bold text-base">D</span>
              </div>
              <span className={`font-display font-bold text-xl leading-none transition-colors ${onHero ? 'text-amber-100' : 'text-primary-600'}`}>
                DADAJ
              </span>
            </div>
            <span className={`text-[10px] tracking-[0.38em] uppercase ml-10 font-medium transition-colors ${onHero ? 'text-amber-300/70' : 'text-gray-400'}`}>
              Biryani
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 flex-1 justify-center">
            {NAV_LINKS.map(([href, label]) => (
              <Link key={href} href={href}>
                <span className={`text-sm font-medium transition-colors hover:text-primary-400 ${onHero ? 'text-amber-100/85' : 'text-gray-600'}`}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Location pill — desktop */}
          <div className={`hidden lg:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${onHero ? 'border-white/20 text-amber-200' : 'border-orange-200 text-gray-500'}`}>
            <MapPin className="w-3 h-3 text-primary-400 flex-shrink-0"/>
            <span className="truncate max-w-[120px]">Satara, 415001</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
              onClick={toggleCart}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                onHero ? 'bg-white/12 border border-white/20 text-amber-100 hover:bg-white/22' : 'bg-primary-500 text-white shadow-orange'
              }`}
            >
              <ShoppingCart className="w-4 h-4"/>
              <span className="hidden sm:block">Cart</span>
              <AnimatePresence>
                {itemCount() > 0 && (
                  <motion.span key={itemCount()} initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold leading-none">
                    {itemCount() > 9 ? '9+' : itemCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Profile */}
            <Link href={user ? '/profile' : '/auth'}>
              <motion.div whileHover={{ scale:1.05 }} whileTap={{ scale:0.93 }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  onHero ? 'bg-white/12 border border-white/20 text-amber-100 hover:bg-white/22' : 'bg-white border border-orange-100 text-gray-600 hover:border-primary-300 shadow-sm'
                }`}>
                {user
                  ? <span className="font-bold text-sm">{(user.email||'U').charAt(0).toUpperCase()}</span>
                  : <User className="w-4 h-4"/>}
              </motion.div>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                onHero ? 'bg-white/12 border border-white/20 text-amber-100' : 'bg-white border border-orange-100 text-gray-600'
              }`}
            >
              {menuOpen ? <X className="w-4 h-4"/> : <Menu className="w-4 h-4"/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
              className="md:hidden overflow-hidden bg-white/96 backdrop-blur-sm border-t border-orange-100">
              <div className="px-4 py-3 space-y-0.5">
                {NAV_LINKS.map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                    <div className="py-3 text-sm font-medium text-gray-700 border-b border-orange-50 last:border-0 flex items-center justify-between">
                      {label}
                      <span className="text-gray-300">›</span>
                    </div>
                  </Link>
                ))}
                {!user && (
                  <Link href="/auth" onClick={() => setMenuOpen(false)}>
                    <div className="py-3 text-sm font-semibold text-primary-600">Sign In / Register</div>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}
