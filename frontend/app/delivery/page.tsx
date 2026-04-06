'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Package, CheckCircle,
  Navigation, IndianRupee, CreditCard, Banknote
} from 'lucide-react';
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
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone'|'otp'>('phone');
  const [orders, setOrders] = useState(ASSIGNED);
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

  useEffect(() => {
    if (!agentGps || !loggedIn) return;
    const t = setInterval(async () => {
      // Supabase tracking logic here
    }, 10000);
    return () => clearInterval(t);
  }, [agentGps, loggedIn]);

  const sendOtp = () => {
    if (phone.length===10) {
      setStep('otp');
      toast.success('OTP sent (use 123456)');
    }
  };

  const verify = () => {
    if (otp==='123456'||otp.length===6) {
      setLoggedIn(true);
      toast.success('Welcome, Ravi! 🛵');
    } else toast.error('Invalid OTP');
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
                <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                  placeholder="Enter mobile number"
                  className="w-full border border-orange-200 rounded-xl px-3 py-3"/>
                <button onClick={sendOtp} className="w-full bg-primary-500 text-white py-3 rounded-xl font-bold">
                  Send OTP
                </button>
              </motion.div>
            ) : (
              <motion.div key="ot" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-4">
                <input value={otp} onChange={e=>setOtp(e.target.value.slice(0,6))}
                  placeholder="Enter OTP"
                  className="w-full border border-orange-200 rounded-xl px-3 py-3 text-center"/>
                <button onClick={verify} className="w-full bg-primary-500 text-white py-3 rounded-xl font-bold">
                  Verify
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 pb-24 px-4"
      style={{background:'linear-gradient(160deg,#fff7ed,#fffbf5,#fff)'}}>

      <div className="max-w-md mx-auto space-y-4">
        {orders.map((o)=>(
          <div key={o.id} className="bg-white rounded-2xl p-4 shadow">

            {/* FIXED PAYMENT UI */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {o.payment === 'COD' ? (
                  <>
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">COD</span>
                  </>
                ) : (
                  <CreditCard className="w-4 h-4 text-green-600" />
                )}
                <span className="text-xs font-semibold">{o.paymentStatus}</span>
              </div>

              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4"/>
                <span className="font-bold">{o.total}</span>
              </div>
            </div>

            <p className="font-bold">{o.customer}</p>
            <p className="text-xs text-gray-500">{o.address}</p>

            <button onClick={()=>markDelivered(o.id)}
              className="mt-3 w-full bg-green-500 text-white py-2 rounded-xl">
              Mark Delivered
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
