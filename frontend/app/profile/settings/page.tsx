'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Bell, Globe, Moon, Shield, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [notifs,    setNotifs]    = useState(true);
  const [emailAlerts,setEmail]    = useState(true);
  const [lang,      setLang]      = useState('en');

  const Toggle = ({val,set}:{val:boolean,set:(v:boolean)=>void}) => (
    <button onClick={()=>{set(!val);toast.success('Setting updated');}}
      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${val?'bg-primary-500':'bg-gray-300'}`}>
      <div className={`absolute w-5 h-5 bg-white rounded-full shadow top-0.5 transition-all duration-200 ${val?'left-6':'left-0.5'}`}/>
    </button>
  );

  const ROWS = [
    { icon:Bell,   label:'Push Notifications',   desc:'Order updates, offers', ctrl:<Toggle val={notifs}    set={setNotifs}/> },
    { icon:Globe,  label:'Email Alerts',          desc:'Order confirmation emails', ctrl:<Toggle val={emailAlerts} set={setEmail}/> },
  ];

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-md mx-auto px-4">
        <div className="py-5 flex items-center gap-3">
          <Link href="/profile"><button className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4"/></button></Link>
          <h1 className="font-display font-bold text-xl text-gray-900">Settings</h1>
        </div>

        <div className="space-y-3">
          {/* Preferences */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <p className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Preferences</p>
            {ROWS.map((r,i)=>(
              <div key={r.label} className="flex items-center gap-3 px-4 py-3.5 border-t border-orange-50">
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0"><r.icon className="w-4 h-4 text-primary-500"/></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{r.label}</p>
                  <p className="text-xs text-gray-400">{r.desc}</p>
                </div>
                {r.ctrl}
              </div>
            ))}
          </div>

          {/* Language */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Language</p>
            <div className="flex gap-2">
              {[{v:'en',l:'English'},{v:'hi',l:'हिंदी'},{v:'mr',l:'मराठी'}].map(({v,l})=>(
                <button key={v} onClick={()=>{setLang(v);toast.success(`Language: ${l}`);}}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${lang===v?'bg-primary-500 text-white border-primary-500':'border-gray-200 text-gray-600'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
            <p className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
            {[
              {icon:Shield, label:'Privacy Policy', href:'#'},
              {icon:Globe,  label:'Terms of Service', href:'#'},
            ].map(item=>(
              <Link key={item.label} href={item.href}>
                <div className="flex items-center gap-3 px-4 py-3.5 border-t border-orange-50 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0"><item.icon className="w-4 h-4 text-primary-500"/></div>
                  <span className="font-semibold text-sm text-gray-800 flex-1">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400"/>
                </div>
              </Link>
            ))}
          </div>

          {/* App info */}
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 text-center">
            <p className="font-display font-bold text-primary-600 text-lg">DADAJ BIRYANI</p>
            <p className="text-xs text-gray-400 mt-0.5">Version 1.0.0 · Made with ❤️ in Satara</p>
          </div>
        </div>
      </div>
    </div>
  );
}
