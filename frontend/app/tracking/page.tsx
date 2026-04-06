'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChefHat, Package, Bike, Home, Clock, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

const STEPS = [
  { key:'PLACED',     label:'Order Placed',       icon:CheckCircle, desc:'We received your order'        },
  { key:'ACCEPTED',   label:'Accepted',            icon:CheckCircle, desc:'Restaurant confirmed'           },
  { key:'PREPARING',  label:'Preparing',           icon:ChefHat,     desc:'Chef is cooking your biryani'  },
  { key:'PICKED',     label:'Picked Up',           icon:Package,     desc:'Delivery partner has your order'},
  { key:'ON_THE_WAY', label:'On The Way 🛵',       icon:Bike,        desc:'Headed to your location'       },
  { key:'DELIVERED',  label:'Delivered! 🎉',       icon:Home,        desc:'Enjoy your royal biryani'      },
];

export default function TrackingPage() {
  const { user } = useAuthStore();
  const [step,    setStep]    = useState(0);
  const [eta,     setEta]     = useState(28);
  const [orderId, setOrderId] = useState<string|null>(null);
  const chanRef = useRef<ReturnType<typeof supabase.channel>|null>(null);

  // Auto-demo advance
  useEffect(() => {
    if (step >= STEPS.length-1) return;
    const t = setInterval(() => {
      setStep(s => Math.min(s+1, STEPS.length-1));
      setEta(e  => Math.max(0, e-5));
    }, 4500);
    return () => clearInterval(t);
  }, [step]);

  // Supabase realtime — subscribe to latest order status if user is logged in
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('orders')
        .select('id, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending:false })
        .limit(1)
        .single();

      if (data) {
        setOrderId(data.id);
        const idx = STEPS.findIndex(s => s.key === data.status);
        if (idx>=0) setStep(idx);

        // Subscribe to realtime updates
        chanRef.current = supabase
          .channel(`order-${data.id}`)
          .on('postgres_changes', {
            event:'UPDATE', schema:'public',
            table:'orders', filter:`id=eq.${data.id}`,
          }, payload => {
            const idx2 = STEPS.findIndex(s => s.key === payload.new.status);
            if (idx2>=0) setStep(idx2);
          })
          .subscribe();
      }
    };
    load();
    return () => { chanRef.current?.unsubscribe(); };
  }, [user]);

  const isDone = step === STEPS.length-1;

  return (
    <div className="min-h-screen bg-brand-cream pt-20 pb-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-5">Track Order</h1>

        {/* Status hero */}
        <motion.div key={step} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className={`rounded-2xl p-5 mb-5 shadow-card text-white ${isDone?'bg-green-500':'bg-gradient-to-r from-primary-500 to-primary-600'}`}>
          <p className="text-sm opacity-80 mb-0.5">Current Status</p>
          <h2 className="font-display font-bold text-2xl">{STEPS[step].label}</h2>
          {!isDone && eta>0 && (
            <div className="flex items-center gap-1.5 mt-2 opacity-85 text-sm">
              <Clock className="w-4 h-4"/><span>ETA: ~{eta} minutes</span>
            </div>
          )}
          {orderId && <p className="text-xs opacity-60 mt-2 font-mono">Order: {orderId.slice(0,8).toUpperCase()}</p>}
        </motion.div>

        {/* Delivery agent card */}
        {step >= 3 && !isDone && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">🧑</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Ravi Kumar</p>
              <p className="text-xs text-gray-400">Your delivery partner · +91 9876543210</p>
            </div>
            <a href="tel:+919876543210" className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors">
              <Phone className="w-4 h-4"/>
            </a>
          </motion.div>
        )}

        {/* Progress steps */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-5">Order Progress</h3>
          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100"/>
            <motion.div className="absolute left-5 top-5 w-0.5 bg-primary-400 origin-top"
              animate={{ scaleY: STEPS.length>1 ? step/(STEPS.length-1) : 0 }}
              transition={{ duration:0.6 }}
              style={{ height:`${((STEPS.length-1)/STEPS.length)*100}%` }}
            />
            <div className="space-y-6">
              {STEPS.map((s,i) => {
                const done = i<=step; const cur = i===step;
                return (
                  <motion.div key={s.key} animate={{opacity:done?1:0.38}} className="flex items-start gap-4 relative">
                    <motion.div animate={cur?{scale:[1,1.2,1]}:{}} transition={{repeat:Infinity,duration:1.6}}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${done?(cur?'bg-primary-500 shadow-orange':'bg-green-100'):'bg-gray-100'}`}>
                      <s.icon className={`w-5 h-5 ${done?(cur?'text-white':'text-green-600'):'text-gray-400'}`}/>
                    </motion.div>
                    <div className="pt-1.5">
                      <p className={`font-semibold text-sm ${done?'text-gray-900':'text-gray-400'}`}>{s.label}</p>
                      <p className={`text-xs mt-0.5 ${done?'text-gray-500':'text-gray-300'}`}>{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Re-order after delivery */}
        {isDone && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            className="mt-4 bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex gap-3">
            <a href="/dishes" className="flex-1">
              <button className="w-full bg-primary-500 text-white py-3 rounded-xl font-bold text-sm shadow-orange">Order Again 🍛</button>
            </a>
            <a href="/profile/orders" className="flex-1">
              <button className="w-full bg-white text-gray-700 py-3 rounded-xl font-semibold text-sm border border-orange-200">View Invoice</button>
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
