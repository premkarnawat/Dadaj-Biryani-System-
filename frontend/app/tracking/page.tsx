'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChefHat, Package, Bike, Home, Clock } from 'lucide-react';

const STEPS = [
  { key:'PLACED',     label:'Order Placed',   icon:CheckCircle, desc:'We received your order' },
  { key:'ACCEPTED',   label:'Accepted',        icon:CheckCircle, desc:'Restaurant confirmed'   },
  { key:'PREPARING',  label:'Preparing',       icon:ChefHat,     desc:'Chef is cooking your biryani' },
  { key:'PICKED',     label:'Picked Up',       icon:Package,     desc:'Delivery partner has your order' },
  { key:'ON_THE_WAY', label:'On The Way',      icon:Bike,        desc:'Headed to your location' },
  { key:'DELIVERED',  label:'Delivered! 🎉',   icon:Home,        desc:'Enjoy your royal biryani' },
];

export default function TrackingPage() {
  const [step, setStep] = useState(0);
  const [eta,  setEta]  = useState(30);

  useEffect(()=>{
    if (step >= STEPS.length-1) return;
    const t = setInterval(()=>{
      setStep(s => Math.min(s+1, STEPS.length-1));
      setEta(e  => Math.max(0, e-6));
    }, 4000);
    return ()=>clearInterval(t);
  },[step]);

  const isDone = step === STEPS.length-1;

  return (
    <div className="min-h-screen bg-brand-cream pt-20 pb-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-5">Track Order</h1>

        {/* Status card */}
        <motion.div key={step} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className={`rounded-2xl p-5 mb-5 shadow-card text-white ${isDone?'bg-green-500':'bg-gradient-to-r from-primary-500 to-primary-600'}`}>
          <p className="text-sm opacity-80 mb-0.5">Status</p>
          <h2 className="font-display font-bold text-2xl">{STEPS[step].label}</h2>
          {!isDone && (
            <div className="flex items-center gap-1.5 mt-2 opacity-85 text-sm">
              <Clock className="w-4 h-4"/><span>ETA: ~{eta} minutes</span>
            </div>
          )}
        </motion.div>

        {/* Delivery agent (shown from step 3) */}
        {step >= 3 && !isDone && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">🧑</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Ravi Kumar</p>
              <p className="text-xs text-gray-400">Your delivery partner</p>
            </div>
            <a href="tel:+919876543210" className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold">Call</a>
          </motion.div>
        )}

        {/* Steps */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-5">Order Progress</h3>
          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100"/>
            <motion.div className="absolute left-5 top-5 w-0.5 bg-primary-500 origin-top"
              animate={{ scaleY: step / (STEPS.length-1) }}
              transition={{ duration:0.5 }}
              style={{ height: `${((STEPS.length-1)/STEPS.length)*100}%` }}
            />
            <div className="space-y-6">
              {STEPS.map((s,i)=>{
                const done = i<=step; const cur = i===step;
                return (
                  <motion.div key={s.key} animate={{opacity:done?1:0.38}} className="flex items-start gap-4 relative">
                    <motion.div animate={cur?{scale:[1,1.18,1]}:{}} transition={{repeat:Infinity,duration:1.5}}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${done?(cur?'bg-primary-500 shadow-orange':'bg-green-100'):'bg-gray-100'}`}>
                      <s.icon className={`w-5 h-5 ${done?(cur?'text-white':'text-green-600'):'text-gray-400'}`}/>
                    </motion.div>
                    <div className="pt-1">
                      <p className={`font-semibold text-sm ${done?'text-gray-900':'text-gray-400'}`}>{s.label}</p>
                      <p className={`text-xs mt-0.5 ${done?'text-gray-500':'text-gray-300'}`}>{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
