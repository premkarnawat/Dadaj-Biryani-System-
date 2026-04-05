'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Clock, MapPin, Download, FileText } from 'lucide-react';

export default function OrderSuccessPage() {
  const [orderId] = useState(`DB${Date.now().toString().slice(-8)}`);
  const [time]    = useState(new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}));

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center pt-16 px-4">
      <motion.div initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} transition={{type:'spring',damping:18}}
        className="max-w-sm w-full text-center">

        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:'spring',damping:14}}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500"/>
        </motion.div>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.35}}>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-1">Order Placed! 🎉</h1>
          <p className="text-gray-400 text-sm mb-1">Your biryani is being prepared with love</p>
          <p className="font-mono text-xs text-gray-400">Order ID: {orderId}</p>
        </motion.div>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
          className="mt-6 bg-white rounded-2xl border border-orange-100 shadow-sm p-5 space-y-4 text-left">
          {[
            { icon: Clock,    label: 'Estimated Delivery', value: '25–35 minutes' },
            { icon: MapPin,   label: 'Delivering to',      value: 'Sadar Bazar, Satara' },
            { icon: FileText, label: 'Placed at',          value: time },
          ].map(({icon:Icon,label,value})=>(
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-500"/>
              </div>
              <div><p className="font-semibold text-sm text-gray-800">{label}</p><p className="text-xs text-gray-400">{value}</p></div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.65}}
          className="mt-5 flex gap-3">
          <Link href="/tracking" className="flex-1">
            <button className="w-full bg-primary-500 text-white py-3.5 rounded-2xl font-bold shadow-orange text-sm">Track Order 🛵</button>
          </Link>
          <Link href="/" className="flex-1">
            <button className="w-full bg-white text-gray-700 py-3.5 rounded-2xl font-semibold border border-orange-200 text-sm">Home</button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
