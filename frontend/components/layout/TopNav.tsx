'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MapPin, User, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import CartDrawer from '@/components/cart/CartDrawer';

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isOpen, toggleCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-glass' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-orange">
              <span className="text-white font-display font-bold text-lg">D</span>
            </div>
            <div>
              <p className="font-display font-bold text-primary-600 text-lg leading-none">DADAJ</p>
              <p className="text-xs text-gray-500 tracking-widest">BIRYANI</p>
            </div>
          </Link>

          {/* Location (desktop) */}
          <button className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-500 transition-colors">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="font-medium">Deliver to: </span>
            <span className="text-gray-800 font-semibold">Pune, 411001</span>
            <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Search (desktop) */}
          <div className="hidden md:flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-orange-100 w-64 shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search biryanis..."
              className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative bg-primary-500 text-white rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-orange"
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Profile */}
            <Link href={user ? '/profile' : '/auth'}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 bg-white border border-orange-100 rounded-xl flex items-center justify-center shadow-sm hover:border-primary-300 transition-colors"
              >
                <User className="w-4 h-4 text-gray-600" />
              </motion.div>
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden w-9 h-9 bg-white border border-orange-100 rounded-xl flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass border-t border-orange-100 px-4 py-3 space-y-3"
            >
              <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-orange-100">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search biryanis..." className="bg-transparent text-sm outline-none w-full" />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Pune, 411001</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
    </>
  );
}
