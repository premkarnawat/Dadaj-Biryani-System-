'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Leaf, Flame, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Dish { id:string; name:string; price:number; image_url:string; is_veg:boolean; is_available:boolean; is_bestseller:boolean; category:string; rating:number }

const INIT: Dish[] = [
  { id:'chicken-dum',  name:'Chicken Dum Biryani',   price:299, image_url:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', is_veg:false, is_available:true,  is_bestseller:true,  category:'Non-Veg', rating:4.9 },
  { id:'mutton-dum',   name:'Mutton Dum Biryani',    price:399, image_url:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=200&fit=crop', is_veg:false, is_available:true,  is_bestseller:true,  category:'Non-Veg', rating:4.8 },
  { id:'veg-hyd',      name:'Hyderabadi Veg Biryani',price:249, image_url:'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=200&h=200&fit=crop', is_veg:true,  is_available:true,  is_bestseller:true,  category:'Veg',    rating:4.7 },
  { id:'prawn-biryani',name:'Prawn Biryani',          price:449, image_url:'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop', is_veg:false, is_available:false, is_bestseller:false, category:'Non-Veg', rating:4.8 },
];

const EMPTY = { name:'', price:'', image_url:'', category:'Non-Veg', is_veg:false, is_bestseller:false };

export default function AdminDishesPage() {
  const [dishes,   setDishes]   = useState<Dish[]>(INIT);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState<Dish|null>(null);
  const [form,     setForm]     = useState(EMPTY);

  const filtered = dishes.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (d:Dish) => { setEditing(d); setForm({name:d.name,price:String(d.price),image_url:d.image_url,category:d.category,is_veg:d.is_veg,is_bestseller:d.is_bestseller}); setModal(true); };

  const save = (e:React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setDishes(p=>p.map(d=>d.id===editing.id?{...d,...form,price:Number(form.price)}:d));
      toast.success('Dish updated!');
    } else {
      const nd:Dish = { id:Date.now().toString(),...form,price:Number(form.price),is_available:true,rating:4.5 };
      setDishes(p=>[...p,nd]);
      toast.success('Dish added!');
    }
    setModal(false);
  };

  const toggle   = (id:string) => { setDishes(p=>p.map(d=>d.id===id?{...d,is_available:!d.is_available}:d)); toast.success('Availability updated'); };
  const remove   = (id:string) => { setDishes(p=>p.filter(d=>d.id!==id)); toast.success('Dish removed'); };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Manage Dishes</h1>
            <p className="text-gray-400 text-sm">{dishes.length} items</p>
          </div>
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={openAdd}
            className="bg-primary-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-orange">
            <Plus className="w-4 h-4"/>Add Dish
          </motion.button>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200 mb-6 max-w-sm shadow-sm">
          <Search className="w-4 h-4 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes..." className="bg-transparent text-sm outline-none w-full"/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((d,i)=>(
            <motion.div key={d.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative h-40">
                <Image src={d.image_url} alt={d.name} fill className="object-cover"/>
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`w-5 h-5 rounded flex items-center justify-center ${d.is_veg?'bg-green-500':'bg-red-500'}`}>
                    {d.is_veg?<Leaf className="w-3 h-3 text-white"/>:<Flame className="w-3 h-3 text-white"/>}
                  </span>
                  {d.is_bestseller && <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">Best</span>}
                </div>
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold ${d.is_available?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                  {d.is_available?'On':'Off'}
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-800 leading-tight">{d.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-bold text-primary-600">{formatPrice(d.price)}</p>
                  <p className="text-xs text-gray-400">⭐ {d.rating}</p>
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button onClick={()=>toggle(d.id)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors ${d.is_available?'bg-red-50 text-red-500 hover:bg-red-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {d.is_available?'Disable':'Enable'}
                  </button>
                  <button onClick={()=>openEdit(d)} className="bg-blue-50 text-blue-600 p-1.5 rounded-lg hover:bg-blue-100 transition-colors"><Edit className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>remove(d.id)} className="bg-red-50 text-red-500 p-1.5 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setModal(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-xl text-gray-900">{editing?'Edit Dish':'Add New Dish'}</h2>
                <button onClick={()=>setModal(false)} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200"><X className="w-4 h-4"/></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                {[
                  {label:'Dish Name *',   key:'name',      type:'text',   ph:'e.g. Chicken Dum Biryani', req:true},
                  {label:'Price (₹) *',   key:'price',     type:'number', ph:'e.g. 299',                 req:true},
                  {label:'Image URL',     key:'image_url', type:'url',    ph:'https://...',              req:false},
                ].map(f=>(
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                    <input type={f.type} value={form[f.key as keyof typeof form] as string}
                      required={f.req} placeholder={f.ph}
                      onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400"/>
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                  <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    {['Veg','Non-Veg','Combo','Sides'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  {[{key:'is_veg',label:'Vegetarian'},{key:'is_bestseller',label:'Bestseller'}].map(f=>(
                    <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[f.key as keyof typeof form] as boolean}
                        onChange={e=>setForm(p=>({...p,[f.key]:e.target.checked}))} className="w-4 h-4 accent-primary-500"/>
                      <span className="text-sm text-gray-700 font-medium">{f.label}</span>
                    </label>
                  ))}
                </div>
                <button type="submit" className="w-full bg-primary-500 text-white py-3 rounded-xl font-bold shadow-orange hover:bg-primary-600 transition-colors">
                  {editing?'Save Changes':'Add Dish'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
