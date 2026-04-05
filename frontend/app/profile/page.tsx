'use client';
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, MapPin, Tag, Settings, LogOut, ChevronRight, Edit, Mail, Phone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const MENU = [
  { icon:ShoppingBag, label:'Order History',   href:'/profile/orders',    desc:'View past orders' },
  { icon:MapPin,      label:'Saved Addresses', href:'/profile/addresses', desc:'Manage delivery addresses' },
  { icon:Tag,         label:'My Offers',       href:'/profile/offers',    desc:'Available coupons & deals' },
  { icon:Settings,    label:'Settings',        href:'/profile/settings',  desc:'Preferences & account' },
];

export default function ProfilePage() {
  const { user, signOut, initialize, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => { if (!initialized) initialize(); }, [initialized, initialize]);
  useEffect(() => { if (initialized && !user) router.push('/auth'); }, [user, initialized, router]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    router.push('/');
  };

  if (!user) return null;

  const letter = user.email?.charAt(0).toUpperCase() ?? 'U';
  const name   = user.user_metadata?.full_name || 'Biryani Lover';
  const phone  = user.user_metadata?.phone;

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-md mx-auto px-4">
        {/* Header card */}
        <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-6 mt-6 text-white shadow-orange">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-display font-bold flex-shrink-0">
              {letter}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl truncate">{name}</h1>
              <div className="flex items-center gap-1 mt-0.5 opacity-85">
                <Mail className="w-3 h-3"/><p className="text-sm truncate">{user.email}</p>
              </div>
              {phone && <div className="flex items-center gap-1 mt-0.5 opacity-75"><Phone className="w-3 h-3"/><p className="text-sm">{phone}</p></div>}
            </div>
            <Link href="/profile/edit">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0">
                <Edit className="w-4 h-4"/>
              </div>
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 bg-white/10 rounded-2xl p-4">
            {[{l:'Orders',v:'12'},{l:'Saved',v:'₹480'},{l:'Points',v:'240'}].map(s=>(
              <div key={s.l} className="text-center">
                <p className="font-bold text-lg">{s.v}</p>
                <p className="text-xs opacity-75">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Menu */}
        <div className="mt-5 space-y-3">
          {MENU.map((item,i)=>(
            <motion.div key={item.href} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}>
              <Link href={item.href}>
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-orange-50 shadow-sm hover:shadow-card hover:border-orange-200 transition-all group">
                  <div className="w-11 h-11 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-500"/>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors"/>
                </div>
              </Link>
            </motion.div>
          ))}

          <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}}
            whileTap={{scale:0.97}} onClick={handleSignOut}
            className="w-full bg-red-50 text-red-500 border border-red-100 rounded-2xl p-4 flex items-center gap-4 hover:bg-red-100 transition-colors">
            <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-500"/>
            </div>
            <span className="font-semibold text-sm">Sign Out</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
