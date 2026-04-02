'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed, ShoppingCart, MessageCircle, User, Settings } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dishes', label: 'Dishes', icon: UtensilsCrossed },
  { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: true },
  { href: '/help', label: 'Help', icon: MessageCircle, guestOnly: true },
  { href: '/profile', label: 'Profile', icon: User, authOnly: true },
  { href: '/profile/settings', label: 'Settings', icon: Settings, authOnly: true, hideOnDesktop: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCartStore();
  const { user } = useAuthStore();

  const visibleItems = navItems.filter((item) => {
    if (item.authOnly && !user) return false;
    if (item.guestOnly && user) return false;
    return true;
  });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-orange-100 bottom-nav-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const count = item.badge ? itemCount() : 0;

          return (
            <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-0.5 px-3 py-1">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-primary-100 text-primary-600' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </motion.div>
              <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
