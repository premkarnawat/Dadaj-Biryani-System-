'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, Trash2, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ALLOWED_AREAS = [
  'Sadar Bazar','Powai Naka','Shahupuri','Sangam Mahuli',
  'Guruwar Peth','Ajinkyatara','Sangamnagar',
];

interface Address { id:string; label:string; line1:string; city:string; pin:string; isDefault:boolean }

const SAMPLE: Address[] = [
  { id:'1', label:'Home', line1:'12, Sadar Bazar, Near Clock Tower', city:'Satara', pin:'415001', isDefault:true },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(SAMPLE);
  const [showForm,  setShowForm]  = useState(false);
  const [area,      setArea]      = useState('');
  const [house,     setHouse]     = useState('');
  const [landmark,  setLandmark]  = useState('');
  const [pin,       setPin]       = useState('');
  const [label,     setLabel]     = useState('Home');
  const [areaErr,   setAreaErr]   = useState('');

  const save = () => {
    const match = ALLOWED_AREAS.find(a => area.toLowerCase().includes(a.toLowerCase()));
    if (!match) { setAreaErr('We only deliver to: '+ALLOWED_AREAS.join(', ')); return; }
    setAreaErr('');
    const newAddr: Address = {
      id: Date.now().toString(), label,
      line1: `${house}, ${area}${landmark ? ', Near '+landmark : ''}`,
      city:'Satara', pin, isDefault: addresses.length === 0,
    };
    setAddresses(p => [...p, newAddr]);
    toast.success('Address saved!');
    setShowForm(false); setHouse(''); setArea(''); setLandmark(''); setPin('');
  };

  const remove = (id:string) => setAddresses(p => p.filter(a => a.id !== id));
  const setDefault = (id:string) => setAddresses(p => p.map(a => ({...a, isDefault: a.id===id})));

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-md mx-auto px-4">
        <div className="py-5 flex items-center gap-3">
          <Link href="/profile"><button className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4"/></button></Link>
          <h1 className="font-display font-bold text-xl text-gray-900">Saved Addresses</h1>
        </div>

        {/* Allowed areas banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 mb-4 text-xs text-orange-700">
          <p className="font-bold mb-1">📍 We deliver only to:</p>
          <p>{ALLOWED_AREAS.join(' · ')}</p>
        </div>

        <div className="space-y-3">
          {addresses.map(a => (
            <motion.div key={a.id} layout className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary-500"/></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-800">{a.label}</p>
                    {a.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Default</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{a.line1}</p>
                  <p className="text-xs text-gray-400">{a.city} – {a.pin}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {!a.isDefault && <button onClick={()=>setDefault(a.id)} className="flex-1 text-xs bg-green-50 text-green-700 border border-green-200 py-1.5 rounded-xl font-semibold flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3"/>Set Default</button>}
                <button onClick={()=>remove(a.id)} className="w-9 h-8 bg-red-50 text-red-400 border border-red-200 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
          onClick={()=>setShowForm(true)}
          className="w-full mt-4 border-2 border-dashed border-orange-300 text-primary-600 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors">
          <Plus className="w-4 h-4"/>Add New Address
        </motion.button>
      </div>

      {/* Add form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowForm(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,y:60}} animate={{opacity:1,y:0}} exit={{opacity:0,y:60}}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl text-gray-900">Add Address</h2>
                <button onClick={()=>setShowForm(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center"><X className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Label</label>
                  <div className="flex gap-2">
                    {['Home','Work','Other'].map(l=>(
                      <button key={l} onClick={()=>setLabel(l)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${label===l?'bg-primary-500 text-white border-primary-500':'border-gray-200 text-gray-600'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                {[
                  {label:'House / Flat No *', val:house, set:setHouse, ph:'e.g. 12, Shree Apartments'},
                  {label:'Area / Street *', val:area, set:setArea, ph:'e.g. Sadar Bazar'},
                  {label:'Landmark', val:landmark, set:setLandmark, ph:'e.g. Near Clock Tower'},
                  {label:'Pincode *', val:pin, set:setPin, ph:'415001'},
                ].map(f=>(
                  <div key={f.label}>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                    <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400"/>
                  </div>
                ))}
                {areaErr && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl p-3">{areaErr}</p>}
                <button onClick={save} className="w-full bg-primary-500 text-white py-3.5 rounded-2xl font-bold shadow-orange mt-2">Save Address</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
