'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Package, CheckCircle, Navigation, IndianRupee, CreditCard, Banknote } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const ASSIGNED = [
  {
    id:'DB20240003', customer:'Amit Kumar', phone:'9876543212',
    address:'Powai Naka, near State Bank, Satara 415001',
    items:['Veg Biryani ×2','Gulab Jamun'], total:575, status:'PICKED',
    payment:'UPI', paymentStatus:'PAID', lat:17.682, lng:73.990,
  },
  {
    id:'DB20240001', customer:'Rohit Sharma', phone:'9876543210',
    address:'Sadar Bazar, Clock Tower Road, Satara 415001',
    items:['Chicken Dum ×2'], total:659, status:'PREPARING',
    payment:'COD', paymentStatus:'PENDING', lat:17.688, lng:73.998,
  },
];

export default function DeliveryPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone,    setPhone]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [step,     setStep]     = useState<'phone'|'otp'>('phone');
  const [orders,   setOrders]   = useState(ASSIGNED);
  const [loading,  setLoading]  = useState(false);

  // Try GPS permission for delivery boy
  const [agentGps, setAgentGps] = useState<{lat:number;lng:number}|null>(null);

  useEffect(() => {
    if (!loggedIn) return;
    const watcher = navigator.geolocation?.watchPosition(
      pos => setAgentGps({ lat:pos.coords.latitude, lng:pos.coords.longitude }),
      () => {},
      { enableHighAccuracy:true, maximumAge:5000 }
    );
    return () => { if (watcher) navigator.geolocation.clearWatch(watcher); };
  }, [loggedIn]);

  // Push GPS to Supabase every 10s
  useEffect(() => {
    if (!agentGps || !loggedIn) return;
    const t = setInterval(async () => {
      // In production: update delivery_tracking table with order_id + lat + lng
      // await supabase.from('delivery_tracking').upsert({ order_id: ..., lat: agentGps.lat, lng: agentGps.lng });
    }, 10000);
    return () => clearInterval(t);
  }, [agentGps, loggedIn]);

  const sendOtp = () => { if (phone.length===10) { setStep('otp'); toast.success('OTP sent (use 123456)'); } };
  const verify  = () => {
    if (otp==='123456'||otp.length===6) { setLoggedIn(true); toast.success('Welcome, Ravi! 🛵'); }
    else toast.error('Invalid OTP');
  };
  const markDelivered = (id:string) => {
    setOrders(p=>p.map(o=>o.id===id?{...o,status:'DELIVERED',paymentStatus:'PAID'}:o));
    toast.success('Order marked as delivered!');
  };

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16"
      style={{background:'linear-gradient(135deg,#fff7ed,#fffbf5)'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-orange text-4xl">🛵</div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Delivery Login</h1>
          <p className="text-gray-400 text-sm mt-1">DADAJ BIRYANI Delivery Partner</p>
        </div>
        <div className="bg-white rounded-3xl shadow-card border border-orange-100 p-6">
          <AnimatePresence mode="wait">
            {step==='phone' ? (
              <motion.div key="ph" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="border border-orange-200 rounded-xl px-3 py-3 text-sm text-gray-500 bg-gray-50 flex-shrink-0">+91</span>
                    <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      placeholder="9876543210" className="flex-1 border border-orange-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary-400"/>
                  </div>
                </div>
                <button onClick={sendOtp} disabled={phone.length!==10}
                  className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-bold shadow-orange disabled:opacity-50">Send OTP</button>
              </motion.div>
            ) : (
              <motion.div key="ot" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                <p className="text-sm text-gray-500 text-center">OTP sent to +91 {phone}</p>
                <input value={otp} onChange={e=>setOtp(e.target.value.slice(0,6))} placeholder="6-digit OTP (123456)"
                  className="w-full border border-orange-200 rounded-xl px-4 py-3 text-center font-mono text-xl tracking-widest outline-none focus:border-primary-400"/>
                <button onClick={verify} className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-bold shadow-orange">Verify & Login</button>
                <button onClick={()=>setStep('phone')} className="w-full text-gray-400 text-sm">← Change number</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 pb-24 px-4" style={{background:'linear-gradient(160deg,#fff7ed,#fffbf5,#fff)'}}>
      <div className="max-w-md mx-auto">
        <div className="py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">My Deliveries</h1>
            <p className="text-sm text-gray-400">{orders.filter(o=>o.status!=='DELIVERED').length} pending</p>
          </div>
          <div className="flex items-center gap-2">
            {agentGps && <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-2.5 py-1.5 text-xs text-green-600 font-medium"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>GPS On</div>}
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🧑</div>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((o,i)=>(
            <motion.div key={o.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              
              {/* Bill header */}
              <div className={`px-4 py-3 flex items-center justify-between ${o.payment==='COD'?'bg-amber-50 border-b border-amber-200':'bg-green-50 border-b border-green-200'}`}>
                <div className="flex items-center gap-2">
                  {o.payment==='COD'
                    ? <Banknote className="w-4 h-4 text-amber-600"/><span className="text-xs font-bold text-amber-700">COD</span>
                    : <CreditCard className="w-4 h-4 text-green-600"/>}
                  <span className={`text-xs font-bold ${o.payment==='COD'?'text-amber-700':'text-green-700'}`}>
                    {o.payment}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.paymentStatus==='PAID'?'bg-green-200 text-green-800':'bg-red-100 text-red-700'}`}>
                    {o.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-gray-700 font-bold"/>
                  <span className="font-black text-lg text-gray-900">{o.total}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{o.customer}</p>
                    <p className="text-xs font-mono text-gray-400">{o.id}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${o.status==='DELIVERED'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-700'}`}>
                    {o.status.replace('_',' ')}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0"/>
                    <span className="leading-snug">{o.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-primary-500"/>
                    <a href={`tel:+91${o.phone}`} className="font-semibold text-primary-600">+91 {o.phone}</a>
                  </div>
                  <div className="flex items-start gap-2 text-gray-500">
                    <Package className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0"/>
                    <span className="text-xs leading-relaxed">{o.items.join(' · ')}</span>
                  </div>
                </div>

                {/* COD collect notice */}
                {o.payment==='COD' && o.paymentStatus==='PENDING' && o.status!=='DELIVERED' && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700 font-medium flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5"/>
                    Collect ₹{o.total} in cash on delivery
                  </div>
                )}

                {o.status!=='DELIVERED' && (
                  <div className="flex gap-2 mt-4">
                    <a href={`https://maps.google.com?q=${encodeURIComponent(o.address)}`} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                      <Navigation className="w-4 h-4"/>Navigate
                    </a>
                    <button onClick={()=>markDelivered(o.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors shadow-sm">
                      <CheckCircle className="w-4 h-4"/>Delivered
                    </button>
                  </div>
                )}

                {o.status==='DELIVERED' && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-green-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5"/>Delivered successfully
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
