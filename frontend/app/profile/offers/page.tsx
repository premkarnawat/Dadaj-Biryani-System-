'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Tag, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const OFFERS = [
  { code:'DADAJ50',   title:'50% Off First Order',     desc:'Max discount ₹200. Min order ₹199.',     expiry:'31 Dec 2025', type:'pct',   val:50  },
  { code:'WELCOME20', title:'Welcome Offer – 20% Off',  desc:'Max discount ₹100. Min order ₹299.',     expiry:'No expiry',  type:'pct',   val:20  },
  { code:'FLAT100',   title:'Flat ₹100 Off',           desc:'On orders above ₹499.',                  expiry:'30 Jun 2025', type:'fixed', val:100 },
  { code:'BIRYANI30', title:'Weekend Special – 30% Off',desc:'Max discount ₹150. Min order ₹349.',    expiry:'Every Sunday',type:'pct',   val:30  },
];

export default function OffersPage() {
  const copy = (code:string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-md mx-auto px-4">
        <div className="py-5 flex items-center gap-3">
          <Link href="/profile"><button className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4"/></button></Link>
          <h1 className="font-display font-bold text-xl text-gray-900">My Offers</h1>
        </div>
        <div className="space-y-4">
          {OFFERS.map((o,i)=>(
            <motion.div key={o.code} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="font-black font-mono text-2xl text-white tracking-wider">{o.code}</p>
                  <button onClick={()=>copy(o.code)} className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                    <Copy className="w-3 h-3"/>Copy
                  </button>
                </div>
              </div>
              <div className="px-5 py-4">
                <h3 className="font-bold text-gray-900">{o.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{o.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">Valid till: {o.expiry}</span>
                  <Link href="/cart">
                    <button className="text-xs bg-primary-50 text-primary-600 border border-primary-200 px-3 py-1.5 rounded-xl font-semibold hover:bg-primary-100 transition-colors">
                      Apply Now →
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
