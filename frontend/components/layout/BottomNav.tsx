'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed, ShoppingCart, MessageCircle, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href:'/',        label:'Home',   icon:Home           },
  { href:'/dishes',  label:'Menu',   icon:UtensilsCrossed},
  { href:'/cart',    label:'Cart',   icon:ShoppingCart, badge:true },
  { href:'/help',    label:'Help',   icon:MessageCircle  },
  { href:'/profile', label:'Profile',icon:User, authHref:'/auth' },
];

export default function BottomNav() {
  const pathname   = usePathname();
  const { itemCount } = useCartStore();
  const { user }   = useAuthStore();

  // Hide on admin, delivery, auth pages
  if (['/admin','/delivery','/auth'].some(p => pathname.startsWith(p))) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-orange-100 bottom-nav-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {NAV.map((item) => {
          const href    = item.authHref && !user ? item.authHref : item.href;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const count   = item.badge ? itemCount() : 0;

          return (
            <Link key={item.href} href={href}>
              <div className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
                <motion.div
                  whileTap={{ scale: 0.82 }}
                  className={`relative p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {count > 0 && (
                    <motion.span initial={{scale:0}} animate={{scale:1}}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                      {count > 9 ? '9+' : count}
                    </motion.span>
                  )}
                </motion.div>
                <span className={`text-xs font-medium leading-none ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div layoutId="bottomNav"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary-500 rounded-full"/>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
