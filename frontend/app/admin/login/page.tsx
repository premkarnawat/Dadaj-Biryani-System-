'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Shield, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
type Step = 'credentials' | 'otp';

export default function AdminLoginPage() {
  const router   = useRouter();
  const [step,     setStep]     = useState<Step>('credentials');
  const [email,    setEmail]    = useState('admin@dadajbiryani.com');
  const [password, setPassword] = useState('');
  const [otp,      setOtp]      = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Store token + advance to 2FA
      localStorage.setItem('admin_token_pending', data.token);
      localStorage.setItem('admin_user_pending',  JSON.stringify(data.admin));
      setStep('otp');
      toast.success('OTP sent to admin email! (Demo: 123456)');
    } catch {
      // Demo fallback
      if (email === 'admin@dadajbiryani.com' && password === 'Admin@123') {
        localStorage.setItem('admin_token_pending', 'demo-token');
        localStorage.setItem('admin_user_pending',  JSON.stringify({ name:'Admin', email }));
        setStep('otp');
        toast.success('Demo mode: use OTP 123456');
      } else {
        toast.error('Invalid credentials. Try Admin@123');
      }
    } finally { setLoading(false); }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456' && otp.length < 6) { toast.error('Invalid OTP'); return; }
    setLoading(true);
    try {
      const token     = localStorage.getItem('admin_token_pending') || 'demo';
      const adminUser = localStorage.getItem('admin_user_pending')  || '{}';
      // Move from pending to active
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user',  adminUser);
      localStorage.removeItem('admin_token_pending');
      localStorage.removeItem('admin_user_pending');
      // Set cookie for middleware
      document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict`;
      toast.success('Welcome to Admin Panel!');
      router.push('/admin');
    } finally { setLoading(false); }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: '#0f0f1a' }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #BF2B0A 0%, #8B1A08 50%, #5C0D04 100%)' }}
      >
        {/* Texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="ap" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="34" stroke="#fff" strokeWidth="1" fill="none"/>
            <circle cx="40" cy="40" r="20" stroke="#fff" strokeWidth="0.6" fill="none"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#ap)"/>
        </svg>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{background:'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,120,0,0.2), transparent)'}}/>

        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',damping:14}}
            className="w-24 h-24 bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <span className="text-5xl">🍛</span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            className="font-black text-white text-4xl uppercase tracking-widest mb-2"
            style={{fontFamily:'"Impact","Arial Black",sans-serif'}}>
            DADAJ
          </motion.h1>
          <p className="text-amber-300 tracking-[0.5em] text-sm font-semibold mb-8">BIRYANI</p>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
            Admin control panel. Manage orders, dishes, users, and delivery in real-time.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[{v:'10K+',l:'Orders'},{v:'4.8★',l:'Rating'},{v:'30min',l:'Delivery'}].map(s=>(
              <div key={s.l} className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <p className="font-bold text-white text-lg">{s.v}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-orange">
              <span className="text-white font-display font-bold text-3xl">D</span>
            </div>
            <h1 className="font-display font-bold text-xl text-white">DADAJ BIRYANI</h1>
            <p className="text-gray-500 text-sm">Admin Panel</p>
          </div>

          <AnimatePresence mode="wait">

            {/* Step 1 — Credentials */}
            {step === 'credentials' && (
              <motion.div key="creds" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">Sign in</h2>
                  <p className="text-gray-500 text-sm mt-1">Enter your admin credentials</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/6 border border-white/12 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-primary-500 focus:bg-white/10 transition-all"
                        style={{background:'rgba(255,255,255,0.05)'}}/>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>
                      <input type={showPwd?'text':'password'} value={password}
                        onChange={e=>setPassword(e.target.value)} required placeholder="Admin@123"
                        className="w-full pl-11 pr-12 py-3.5 bg-white/6 border border-white/12 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-primary-500 focus:bg-white/10 transition-all"
                        style={{background:'rgba(255,255,255,0.05)'}}/>
                      <button type="button" onClick={()=>setShowPwd(!showPwd)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                        {showPwd?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>

                  <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                    type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-orange disabled:opacity-60 text-[15px] mt-2">
                    {loading ? <span className="spinner"/> : <><span>Continue</span><ChevronRight className="w-4 h-4"/></>}
                  </motion.button>
                </form>

                <div className="mt-6 p-4 rounded-2xl border border-white/8" style={{background:'rgba(255,255,255,0.04)'}}>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Demo Credentials</p>
                  <p className="text-xs text-gray-400 font-mono">admin@dadajbiryani.com</p>
                  <p className="text-xs text-gray-400 font-mono">Admin@123</p>
                </div>
              </motion.div>
            )}

            {/* Step 2 — OTP */}
            {step === 'otp' && (
              <motion.div key="otp2fa" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-primary-500/15 border border-primary-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary-400"/>
                  </div>
                  <h2 className="text-2xl font-bold text-white">2FA Verification</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Enter the 6-digit code sent to<br/>
                    <span className="text-gray-300 font-medium">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleOtp} className="space-y-5">
                  <div>
                    <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                      placeholder="000000" maxLength={6} required autoFocus
                      className="w-full py-5 border-2 border-white/12 rounded-2xl text-center font-mono text-3xl tracking-[0.8em] text-white placeholder-gray-700 outline-none focus:border-primary-500 transition-all"
                      style={{background:'rgba(255,255,255,0.05)'}}/>
                    <div className="flex justify-center gap-2 mt-3">
                      {[0,1,2,3,4,5].map(i=>(
                        <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i<otp.length?'bg-primary-500':'bg-white/15'}`}/>
                      ))}
                    </div>
                  </div>

                  <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                    type="submit" disabled={loading||otp.length<6}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold shadow-orange disabled:opacity-60 text-[15px]">
                    {loading ? <span className="spinner"/> : 'Verify & Enter Admin'}
                  </motion.button>

                  <button type="button" onClick={()=>{setStep('credentials');setOtp('');}}
                    className="w-full text-gray-500 text-sm hover:text-gray-300 transition-colors">
                    ← Back to login
                  </button>
                </form>

                <div className="mt-6 p-3 rounded-xl border border-amber-500/20 bg-amber-500/8 text-center">
                  <p className="text-xs text-amber-400 font-mono">Demo OTP: <strong>123456</strong></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
