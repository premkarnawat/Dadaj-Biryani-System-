'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, RotateCcw, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Step = 'email' | 'otp';

export default function AuthPage() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>('email');
  const [email,   setEmail]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [loading, setLoading] = useState(false);

  /* ── Send OTP ── */
  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          // shouldCreateUser:true means Supabase creates auth user if new,
          // OR reuses existing — never duplicates. Our upsert in authStore
          // keeps public.users in sync on every sign-in.
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setStep('otp');
      toast.success('OTP sent! Check your inbox 📧');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  /* ── Verify OTP ── */
  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type:  'email',
      });
      if (error) throw error;
      // authStore.initialize() already subscribed; upsert happens in onAuthStateChange
      toast.success('Welcome back! 🍛');
      router.push('/');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Invalid OTP. Try again.');
      setOtp('');
    } finally { setLoading(false); }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10"
      style={{ background: 'linear-gradient(160deg, #fff7ed 0%, #fffbf5 50%, #fff 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl"/>
        <div className="absolute bottom-20 -left-20 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl"/>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-orange"
          >
            <span className="text-white font-display font-bold text-4xl">D</span>
          </motion.div>
          <h1 className="font-display font-bold text-2xl text-gray-900">DADAJ BIRYANI</h1>
          <p className="text-gray-400 text-sm mt-1">
            {step === 'email' ? 'Sign in or create your account' : 'Enter the code from your email'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card border border-orange-100 p-6">
          <AnimatePresence mode="wait">

            {/* Step 1 — Email */}
            {step === 'email' && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                onSubmit={sendOTP}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-bold text-lg text-gray-900 mb-0.5">Enter your email</h2>
                  <p className="text-sm text-gray-400">
                    We&apos;ll send a <strong>6-digit code</strong>. No password needed.
                  </p>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required autoFocus autoComplete="email"
                    className="w-full pl-10 pr-4 py-3.5 border border-orange-200 rounded-2xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  type="submit" disabled={loading || !email.trim()}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-orange disabled:opacity-60 transition-all"
                >
                  {loading ? <span className="spinner"/> : <><span>Send OTP</span><ArrowRight className="w-4 h-4"/></>}
                </motion.button>

                <p className="text-xs text-center text-gray-400 leading-relaxed">
                  New user? An account is created automatically.<br/>
                  Returning? You&apos;ll be logged back in.
                </p>
              </motion.form>
            )}

            {/* Step 2 — OTP */}
            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                onSubmit={verifyOTP}
                className="space-y-5"
              >
                <div className="text-center">
                  <div className="w-14 h-14 bg-primary-50 border border-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-7 h-7 text-primary-500"/>
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">Check your email</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Code sent to <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </div>

                {/* OTP input */}
                <div>
                  <input
                    type="text" inputMode="numeric"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                    placeholder="000000"
                    maxLength={6} required autoFocus
                    className="w-full py-4 border-2 border-orange-200 rounded-2xl text-center text-3xl font-mono font-bold tracking-[0.6em] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-gray-900"
                  />
                  {/* Progress dots */}
                  <div className="flex justify-center gap-1.5 mt-2.5">
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all duration-200 ${i < otp.length ? 'bg-primary-500 scale-110' : 'bg-gray-200'}`}/>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  type="submit" disabled={loading || otp.length < 6}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-orange disabled:opacity-60"
                >
                  {loading ? <span className="spinner"/> : 'Verify & Continue'}
                </motion.button>

                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={() => { setStep('email'); setOtp(''); }}
                    className="text-gray-400 flex items-center gap-1 hover:text-gray-600 transition-colors">
                    <RotateCcw className="w-3 h-3"/>Change email
                  </button>
                  <button type="button" onClick={sendOTP} disabled={loading}
                    className="text-primary-500 font-semibold hover:text-primary-700 transition-colors disabled:opacity-50">
                    Resend code
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-primary-500 cursor-pointer hover:underline">Terms</span>
          {' '}&amp;{' '}
          <span className="text-primary-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
