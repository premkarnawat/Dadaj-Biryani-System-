'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('admin@dadajbiryani.com');
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND}/admin/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user',  JSON.stringify(data.admin));
      toast.success(`Welcome, ${data.admin.name}!`);
      router.push('/admin');
    } catch (err: unknown) {
      if (email==='admin@dadajbiryani.com' && password==='Admin@123') {
        localStorage.setItem('admin_token', 'demo-token');
        localStorage.setItem('admin_user',  JSON.stringify({name:'Admin',email}));
        toast.success('Welcome, Admin! (Demo mode)');
        router.push('/admin');
      } else {
        toast.error(err instanceof Error ? err.message : 'Invalid credentials');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-orange">
            <span className="text-white font-display font-bold text-3xl">D</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">DADAJ BIRYANI</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-400"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  required placeholder="Admin@123"
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-400"/>
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold shadow-orange disabled:opacity-60">
              {loading?'Signing in...':'Sign In to Admin'}
            </motion.button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">Demo: admin@dadajbiryani.com / Admin@123</p>
        </div>
      </motion.div>
    </div>
  );
}
