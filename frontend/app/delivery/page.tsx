'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Phone, Package, CheckCircle, Navigation } from 'lucide-react';

// Demo delivery boy login + assigned orders view
const ASSIGNED = [
  { id:'DB20240003', customer:'Amit Kumar',  phone:'9876543212', address:'Powai Naka, near State Bank, Satara 415001', items:['Veg Biryani ×2','Gulab Jamun'], total:548, status:'PICKED' },
  { id:'DB20240001', customer:'Rohit Sharma',phone:'9876543210', address:'Sadar Bazar, Clock Tower Road, Satara 415001', items:['Chicken Dum ×2'], total:628, status:'PREPARING' },
];

export default function DeliveryPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone,    setPhone]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [step,     setStep]     = useState<'phone'|'otp'>('phone');
  const [orders,   setOrders]   = useState(ASSIGNED);

  const sendOtp = () => { if(phone.length===10){ setStep('otp'); } };
  const verify  = () => { if(otp==='123456'||otp.length===6){ setLoggedIn(true); } };
  const markDelivered = (id:string) => setOrders(p=>p.map(o=>o.id===id?{...o,status:'DELIVERED'}:o));

  if (!loggedIn) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 pt-16">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-orange">
            <span className="text-2xl">🛵</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Delivery Login</h1>
          <p className="text-gray-400 text-sm mt-1">DADAJ BIRYANI Delivery Partner</p>
        </div>
        <div className="bg-white rounded-3xl shadow-card border border-orange-100 p-6">
          {step==='phone' ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="border border-orange-200 rounded-xl px-3 py-3 text-sm text-gray-500 bg-gray-50">+91</span>
                  <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                    placeholder="Enter mobile number" className="flex-1 border border-orange-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-primary-400"/>
                </div>
              </div>
              <button onClick={sendOtp} className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-bold shadow-orange">
                Send OTP
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">OTP sent to +91 {phone}</p>
              <input value={otp} onChange={e=>setOtp(e.target.value.slice(0,6))}
                placeholder="Enter 6-digit OTP (use 123456)" className="w-full border border-orange-200 rounded-xl px-4 py-3 text-center font-mono text-xl tracking-widest outline-none focus:border-primary-400"/>
              <button onClick={verify} className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-bold shadow-orange">Verify & Login</button>
              <button onClick={()=>setStep('phone')} className="w-full text-gray-400 text-sm">← Change number</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <div className="py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">My Deliveries</h1>
            <p className="text-sm text-gray-400">{orders.filter(o=>o.status!=='DELIVERED').length} pending</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🧑</div>
        </div>

        <div className="space-y-4">
          {orders.map((o,i)=>(
            <motion.div key={o.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
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
                    <span>{o.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-primary-500"/>
                    <a href={`tel:+91${o.phone}`} className="font-semibold text-primary-600 hover:underline">+91 {o.phone}</a>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <Package className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0"/>
                    <span>{o.items.join(', ')}</span>
                  </div>
                </div>

                {o.status!=='DELIVERED' && (
                  <div className="flex gap-2 mt-4">
                    <a href={`https://maps.google.com?q=${encodeURIComponent(o.address)}`} target="_blank" rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                      <Navigation className="w-4 h-4"/>Navigate
                    </a>
                    <button onClick={()=>markDelivered(o.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors">
                      <CheckCircle className="w-4 h-4"/>Mark Delivered
                    </button>
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
