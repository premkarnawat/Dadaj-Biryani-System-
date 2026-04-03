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
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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
          shouldCreateUser: true,
          // Force OTP (6-digit code) instead of magic link
          emailRedirectTo: undefined,
        },
      });
      if (error) throw error;
      setStep('otp');
      toast.success('OTP sent! Check your email inbox.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email',
      });
      if (error) throw error;

      // Upsert into users table so auth user and public.users stay in sync
      if (data.user) {
        await supabase.from('users').upsert(
          {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name ?? null,
          },
          { onConflict: 'id', ignoreDuplicates: false }
        );
      }

      toast.success('Welcome to DADAJ BIRYANI! 🍛');
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP';
      toast.error(msg);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP digit handler ── */
  const handleOtpChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setOtp(digits);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14 }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-orange"
          >
            <span className="text-white font-display font-bold text-4xl">D</span>
          </motion.div>
          <h1 className="font-display font-bold text-2xl text-gray-900">DADAJ BIRYANI</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to order royal biryani 🍛</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-orange-100 p-6">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Email ── */}
            {step === 'email' && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                onSubmit={sendOTP}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Enter your email</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    We&apos;ll send a <strong>6-digit OTP</strong> to your inbox
                  </p>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-orange disabled:opacity-60 transition-all"
                >
                  {loading
                    ? <span className="spinner" />
                    : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>
                  }
                </motion.button>
              </motion.form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                onSubmit={verifyOTP}
                className="space-y-5"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-5 h-5 text-primary-500" />
                    <h2 className="font-bold text-lg text-gray-900">Enter OTP</h2>
                  </div>
                  <p className="text-sm text-gray-400">
                    Sent to <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </div>

                {/* Single input styled like separate boxes */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={e => handleOtpChange(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full px-4 py-4 border-2 border-orange-200 rounded-xl text-center text-3xl font-mono font-bold tracking-[0.6em] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-gray-900"
                  />
                  {/* Progress dots */}
                  <div className="flex justify-center gap-1.5 mt-2">
                    {[0,1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          i < otp.length ? 'bg-primary-500 scale-110' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-orange disabled:opacity-60 transition-all"
                >
                  {loading ? <span className="spinner" /> : 'Verify & Login'}
                </motion.button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setOtp(''); }}
                    className="text-gray-400 flex items-center gap-1 hover:text-gray-600 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Change email
                  </button>
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading}
                    className="text-primary-500 font-semibold hover:text-primary-700 transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-primary-500 cursor-pointer">Terms</span> &amp;{' '}
          <span className="text-primary-500 cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
