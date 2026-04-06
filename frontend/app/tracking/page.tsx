'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChefHat, Package, Bike, Home, Clock, Phone, Navigation } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

const STEPS = [
  { key:'PLACED',     label:'Order Placed',   icon:CheckCircle, desc:'We received your order'         },
  { key:'ACCEPTED',   label:'Accepted',        icon:CheckCircle, desc:'Restaurant confirmed'            },
  { key:'PREPARING',  label:'Preparing',       icon:ChefHat,     desc:'Chef is cooking your biryani'   },
  { key:'PICKED',     label:'Picked Up',       icon:Package,     desc:'Delivery partner picked up'     },
  { key:'ON_THE_WAY', label:'On The Way 🛵',   icon:Bike,        desc:'Headed to your location'        },
  { key:'DELIVERED',  label:'Delivered! 🎉',   icon:Home,        desc:'Enjoy your royal biryani'       },
];

// Simple map using Google Static Maps API (no JS SDK needed)
const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function StaticMap({ agentLat, agentLng, userLat, userLng }: { agentLat:number; agentLng:number; userLat:number; userLng:number }) {
  if (!GMAPS_KEY) return (
    <div className="w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
      <div className="text-center text-gray-400 text-sm">
        <Navigation className="w-8 h-8 mx-auto mb-2 text-gray-300"/>
        <p>Map not configured</p>
        <p className="text-xs mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
      </div>
    </div>
  );

  const center = `${(agentLat+userLat)/2},${(agentLng+userLng)/2}`;
  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=14&size=600x300&scale=2`
    + `&markers=color:orange%7Clabel:🛵%7C${agentLat},${agentLng}`
    + `&markers=color:green%7Clabel:H%7C${userLat},${userLng}`
    + `&path=color:0xf97316%7Cweight:4%7C${agentLat},${agentLng}%7C${userLat},${userLng}`
    + `&key=${GMAPS_KEY}`;

  return (
    <div className="w-full h-48 rounded-2xl overflow-hidden border border-orange-100 shadow-sm relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Delivery map" className="w-full h-full object-cover"/>
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-600 font-medium flex items-center gap-1">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"/>Live tracking
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const { user } = useAuthStore();
  const [step,    setStep]    = useState(0);
  const [eta,     setEta]     = useState(28);
  const [orderId, setOrderId] = useState<string|null>(null);
  // Simulated agent location (Satara area)
  const [agentPos, setAgentPos] = useState({ lat:17.685, lng:73.987 });
  const USER_POS = { lat:17.680, lng:73.995 }; // user home
  const chanRef   = useRef<ReturnType<typeof supabase.channel>|null>(null);

  // Simulate agent movement toward user
  useEffect(() => {
    if (step < 3) return;
    const t = setInterval(() => {
      setAgentPos(prev => ({
        lat: prev.lat + (USER_POS.lat - prev.lat) * 0.06,
        lng: prev.lng + (USER_POS.lng - prev.lng) * 0.06,
      }));
    }, 3000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Demo auto-advance
  useEffect(() => {
    if (step >= STEPS.length-1) return;
    const t = setInterval(() => {
      setStep(s => Math.min(s+1, STEPS.length-1));
      setEta(e  => Math.max(0, e-5));
    }, 4500);
    return () => clearInterval(t);
  }, [step]);

  // Supabase realtime
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('orders').select('id,status').eq('user_id',user.id)
        .order('created_at',{ascending:false}).limit(1).single();
      if (!data) return;
      setOrderId(data.id);
      const idx = STEPS.findIndex(s=>s.key===data.status);
      if (idx>=0) setStep(idx);
      chanRef.current = supabase.channel(`order-${data.id}`)
        .on('postgres_changes',{event:'UPDATE',schema:'public',table:'orders',filter:`id=eq.${data.id}`},
          payload => { const i=STEPS.findIndex(s=>s.key===payload.new.status); if(i>=0) setStep(i); })
        .subscribe();
    };
    load();
    return () => { chanRef.current?.unsubscribe(); };
  }, [user]);

  const isDone = step === STEPS.length-1;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4" style={{background:'linear-gradient(160deg,#fff7ed 0%,#fffbf5 60%,#fff 100%)'}}>
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-gray-900">Track Order</h1>
          {orderId && <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{orderId.slice(0,8).toUpperCase()}</span>}
        </div>

        {/* Status hero */}
        <motion.div key={step} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className={`rounded-2xl p-5 text-white shadow-lg ${isDone?'bg-green-500':'bg-gradient-to-r from-primary-500 to-primary-600'}`}>
          <p className="text-sm opacity-80 mb-0.5">Current Status</p>
          <h2 className="font-display font-bold text-2xl">{STEPS[step].label}</h2>
          {!isDone && eta>0 && (
            <div className="flex items-center gap-1.5 mt-2 opacity-85 text-sm">
              <Clock className="w-4 h-4"/><span>ETA: ~{eta} minutes</span>
            </div>
          )}
        </motion.div>

        {/* Live map (shows when picked up or later) */}
        {step >= 3 && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                Live Location
              </h3>
              <StaticMap agentLat={agentPos.lat} agentLng={agentPos.lng} userLat={USER_POS.lat} userLng={USER_POS.lng}/>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"/>Delivery partner</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"/>Your location</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Agent card */}
        {step >= 3 && !isDone && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">🧑</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Ravi Kumar</p>
              <p className="text-xs text-gray-400">Delivery Partner · 2-wheeler</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-xs text-green-600 font-medium">Location sharing on</span>
              </div>
            </div>
            <a href="tel:+919876543210"
              className="w-11 h-11 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm">
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
              animate={{ scaleY: step/(STEPS.length-1) }} transition={{ duration:0.6 }}
              style={{ height:`${((STEPS.length-1)/STEPS.length)*100}%` }}/>
            <div className="space-y-5">
              {STEPS.map((s,i)=>{
                const done=i<=step; const cur=i===step;
                return (
                  <motion.div key={s.key} animate={{opacity:done?1:0.38}} className="flex items-start gap-4 relative">
                    <motion.div animate={cur?{scale:[1,1.18,1]}:{}} transition={{repeat:Infinity,duration:1.5}}
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

        {isDone && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex gap-3">
            <a href="/dishes" className="flex-1"><button className="w-full bg-primary-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-orange">Order Again 🍛</button></a>
            <a href="/profile/orders" className="flex-1"><button className="w-full bg-white text-gray-700 py-3.5 rounded-2xl font-semibold text-sm border border-orange-200">Invoice</button></a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
