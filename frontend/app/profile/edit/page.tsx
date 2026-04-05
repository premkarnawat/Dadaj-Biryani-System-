'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const { user, initialize } = useAuthStore();
  const router = useRouter();
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '');
      setPhone(user.user_metadata?.phone || '');
    }
  }, [user]);

  const save = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim(), phone: phone.trim() } });
      if (error) throw error;
      await supabase.from('users').update({ full_name: name.trim(), phone: phone.trim() }).eq('id', user.id);
      await initialize();
      toast.success('Profile updated!');
      router.push('/profile');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-md mx-auto px-4">
        <div className="py-5 flex items-center gap-3">
          <Link href="/profile"><button className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4"/></button></Link>
          <h1 className="font-display font-bold text-xl text-gray-900">Edit Profile</h1>
        </div>
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-4xl font-display font-bold text-white shadow-orange">
              {(user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-primary-300 rounded-full flex items-center justify-center cursor-pointer">
              <Camera className="w-3.5 h-3.5 text-primary-500"/>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">{user?.email}</p>
        </div>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"
              className="w-full border border-orange-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone Number</label>
            <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 9876543210"
              className="w-full border border-orange-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-400"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
            <input value={user?.email||''} disabled className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400"/>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={save} disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-2xl font-bold shadow-orange disabled:opacity-60">
            {loading?'Saving...':'Save Changes'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
