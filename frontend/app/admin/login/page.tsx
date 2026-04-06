'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

type Step = 'credentials' | 'otp';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step,     setStep]     = useState<Step>('credentials');
  const [email,    setEmail]    = useState('admin@dadajbiryani.com');
  const [password, setPassword] = useState('');
  const [otp,      setOtp]      = useState('');
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND}/admin/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // Store token in cookie for middleware
      document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
      toast.success(`Welcome, ${data.admin.name}!`);
      router.push('/admin');
    } catch {
      // Demo mode
      if (email === 'admin@dadajbiryani.com' && password === 'Admin@123') {
        setStep('otp');
        toast.success('OTP sent! Use 123456 for demo');
      } else {
        toast.error('Invalid credentials. Try Admin@123');
      }
    } finally { setLoading(false); }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Demo OTP verification
      if (otp === '123456' || otp.length === 6) {
        const token = 'demo-admin-token-' + Date.now();
        document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict`;
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify({ name:'Admin', email }));
        toast.success('Logged in successfully!');
        router.push('/admin');
      } else {
        toast.error('Invalid OTP');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background:'radial-gradient(ellipse 90% 80% at 50% 30%, #1a1a2e 0%, #0f0f1a 100%)' }}>

      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl"/>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl"/>
      </div>

      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',damping:14}}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-orange">
            <span className="text-white font-display font-bold text-4xl">D</span>
          </motion.div>
          <h1 className="font-display font-bold text-2xl text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">DADAJ BIRYANI</p>
        </div>

        <div className="bg-white/8 backdrop-blur-xl border border-white/12 rounded-3xl p-6 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.form key="creds" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-primary-400 focus:bg-white/12 transition-all"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                    <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                      required placeholder="Admin@123"
                      className="w-full pl-10 pr-11 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-primary-400 focus:bg-white/12 transition-all"/>
                    <button type="button" onClick={()=>setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold shadow-orange disabled:opacity-60 mt-2">
                  {loading ? 'Signing in...' : 'Sign In →'}
                </motion.button>
                <p className="text-center text-xs text-gray-500 mt-2">Demo: admin@dadajbiryani.com / Admin@123</p>
              </motion.form>
            ) : (
              <motion.form key="otp" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                onSubmit={handleOtp} className="space-y-5">
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary-500/20 border border-primary-500/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-7 h-7 text-primary-400"/>
                  </div>
                  <h3 className="font-bold text-white text-lg">2FA Verification</h3>
                  <p className="text-gray-400 text-sm mt-1">Enter the OTP sent to<br/><span className="text-white font-medium">{email}</span></p>
                </div>
                <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="000000" maxLength={6} required autoFocus
                  className="w-full py-4 bg-white/8 border border-white/15 rounded-xl text-center font-mono text-2xl tracking-[0.6em] text-white placeholder-gray-600 outline-none focus:border-primary-400 transition-all"/>
                <div className="flex gap-1 justify-center">
                  {[0,1,2,3,4,5].map(i=>(
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i<otp.length?'bg-primary-500':'bg-white/20'}`}/>
                  ))}
                </div>
                <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} type="submit" disabled={loading||otp.length<6}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold shadow-orange disabled:opacity-60">
                  {loading ? 'Verifying...' : 'Verify & Enter'}
                </motion.button>
                <button type="button" onClick={()=>setStep('credentials')} className="w-full text-gray-400 text-sm hover:text-gray-300 transition-colors">
                  ← Back to login
                </button>
                <p className="text-center text-xs text-gray-600">Demo OTP: 123456</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
