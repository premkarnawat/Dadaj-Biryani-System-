'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Copy, Tag, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const OFFERS = [
  { code:'DADAJ50',   title:'50% Off First Order', desc:'Max ₹200 · Min order ₹199',  expiry:'31 Dec 2025', gradient:'from-orange-500 to-red-500',    emoji:'🎉', val:'50% OFF',    type:'pct' },
  { code:'WELCOME20', title:'Welcome Offer',        desc:'20% off · Max ₹100 · Min ₹299', expiry:'No expiry', gradient:'from-amber-500 to-orange-500', emoji:'🎊', val:'20% OFF',    type:'pct' },
  { code:'FLAT100',   title:'Flat ₹100 Off',       desc:'Min order ₹499',             expiry:'30 Jun 2025', gradient:'from-green-500 to-emerald-500', emoji:'💸', val:'₹100 OFF',   type:'fixed'},
  { code:'BIRYANI30', title:'Weekend Special',      desc:'30% off · Max ₹150 · Min ₹349',expiry:'Every Sunday',gradient:'from-violet-500 to-purple-500',emoji:'👑', val:'30% OFF',    type:'pct' },
];

export default function OffersPage() {
  const [copied, setCopied] = useState<string|null>(null);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Copied: ${code}`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen pt-16 pb-24" style={{ background:'linear-gradient(135deg, #fff7ed 0%, #fffbf5 50%, #fff 100%)' }}>
      <div className="max-w-md mx-auto px-4">
        <div className="py-5 flex items-center gap-3">
          <Link href="/profile">
            <button className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm">
              <ArrowLeft className="w-4 h-4"/>
            </button>
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">My Offers</h1>
            <p className="text-xs text-gray-400">Tap code to copy</p>
          </div>
        </div>

        <div className="space-y-4">
          {OFFERS.map((o, i) => (
            <motion.div
              key={o.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
              className="rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => copy(o.code)}
            >
              {/* Top gradient section */}
              <div className={`bg-gradient-to-r ${o.gradient} p-5 relative overflow-hidden`}>
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/8 backdrop-blur-[1px]"/>
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none"/>
                <div className="absolute -right-2 -bottom-4 w-20 h-20 rounded-full bg-white/8 pointer-events-none"/>

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{o.emoji}</span>
                      <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Limited Offer</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-xl leading-tight">{o.title}</h3>
                    <p className="text-white/75 text-xs mt-1">{o.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-black text-white text-2xl leading-none">{o.val}</p>
                    <p className="text-white/60 text-xs mt-1">Save big!</p>
                  </div>
                </div>
              </div>

              {/* Bottom white section */}
              <div className="bg-white px-5 py-3 flex items-center justify-between border border-t-0 border-orange-100 rounded-b-2xl"
                style={{ borderTop: `3px dashed rgba(249,115,22,0.3)` }}>
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gray-400"/>
                  <span className="font-black font-mono text-lg text-gray-800 tracking-wider">{o.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{o.expiry}</span>
                  <motion.div whileTap={{ scale: 0.85 }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      copied === o.code ? 'bg-green-500 text-white' : 'bg-primary-500 text-white'
                    }`}>
                    {copied === o.code
                      ? <><CheckCircle className="w-3 h-3"/>Copied!</>
                      : <><Copy className="w-3 h-3"/>Copy</>}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-orange-700 font-medium">Tap any coupon to copy the code</p>
          <p className="text-xs text-orange-500 mt-0.5">Apply it in cart at checkout</p>
          <Link href="/cart">
            <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
              className="mt-3 bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-orange">
              Go to Cart →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
