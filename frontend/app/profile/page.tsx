'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, ShoppingBag, Tag, Settings, LogOut, ChevronRight, Phone, Mail } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const MENU_ITEMS = [
  { icon: ShoppingBag, label: 'Order History', href: '/profile/orders', desc: 'View past orders' },
  { icon: MapPin, label: 'Saved Addresses', href: '/profile/addresses', desc: 'Manage delivery addresses' },
  { icon: Tag, label: 'My Offers', href: '/profile/offers', desc: 'Available coupons & deals' },
  { icon: Settings, label: 'Settings', href: '/profile/settings', desc: 'Preferences & account' },
];

export default function ProfilePage() {
  const { user, signOut, initialize, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => { if (!initialized) initialize(); }, [initialized, initialize]);

  useEffect(() => {
    if (initialized && !user) router.push('/auth');
  }, [user, initialized, router]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/');
  };

  if (!user) return null;

  const avatarLetter = user.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-md mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-6 mt-6 text-white shadow-orange"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-display font-bold">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl">{user.user_metadata?.full_name || 'Biryani Lover'}</h1>
              <div className="flex items-center gap-1 mt-1 opacity-85">
                <Mail className="w-3 h-3" />
                <p className="text-sm truncate">{user.email}</p>
              </div>
              {user.user_metadata?.phone && (
                <div className="flex items-center gap-1 mt-0.5 opacity-75">
                  <Phone className="w-3 h-3" />
                  <p className="text-sm">{user.user_metadata.phone}</p>
                </div>
              )}
            </div>
            <Link href="/profile/edit" className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            {[{ label: 'Orders', value: '12' }, { label: 'Saved', value: '₹480' }, { label: 'Points', value: '240' }].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-bold text-lg">{stat.value}</p>
                <p className="text-xs opacity-75">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="mt-6 space-y-3">
          {MENU_ITEMS.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={item.href}>
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-orange-50 shadow-sm hover:shadow-card hover:border-orange-200 transition-all group">
                  <div className="w-11 h-11 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors">
                    <item.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Sign Out */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="w-full bg-red-50 text-red-500 border border-red-100 rounded-2xl p-4 flex items-center gap-4 hover:bg-red-100 transition-colors"
          >
            <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-semibold text-sm">Sign Out</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
