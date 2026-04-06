'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Leaf, Flame, Plus, Minus, ShoppingCart, Clock, ChefHat, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const DISHES: Record<string, {
  id:string; name:string; description:string; longDesc:string; price:number;
  image_url:string; rating:number; rating_count:number; is_veg:boolean;
  is_bestseller:boolean; prepTime:string; serves:string; calories:string;
  addOns:{name:string; price:number; emoji:string}[]; tags:string[]; ingredients:string[];
}> = {
  'chicken-dum': {
    id:'chicken-dum', name:'Chicken Dum Biryani', description:'Slow-cooked tender chicken in aromatic basmati.',
    longDesc:'Our signature Chicken Dum Biryani uses the ancient dum-pukht technique — slow-cooking layers of marinated chicken and long-grain basmati rice in a sealed handi for 4 hours. Each grain absorbs saffron, caramelized onions and whole spices.',
    price:299, image_url:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=800&fit=crop',
    rating:4.9, rating_count:1240, is_veg:false, is_bestseller:true, prepTime:'30–35 min', serves:'1–2', calories:'680 kcal',
    addOns:[{name:'Extra Raita',price:30,emoji:'🥛'},{name:'Salan',price:40,emoji:'🍲'},{name:'Boiled Egg',price:20,emoji:'🥚'},{name:'Extra Portion',price:150,emoji:'🍛'},{name:'Papad',price:15,emoji:'🫓'}],
    tags:['Spicy','Dum-cooked','Saffron'], ingredients:['Long-grain Basmati','Chicken Thighs','Saffron','Caramelized Onions','Whole Spices','Yogurt'],
  },
  'mutton-dum': {
    id:'mutton-dum', name:'Mutton Dum Biryani', description:'Tender mutton in the royal dum style.',
    longDesc:'Slow-braised bone-in mutton marinated overnight in yogurt and spices, layered with aged Basmati rice and cooked dum style for 5 hours.',
    price:399, image_url:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=800&fit=crop',
    rating:4.8, rating_count:980, is_veg:false, is_bestseller:true, prepTime:'35–40 min', serves:'1–2', calories:'780 kcal',
    addOns:[{name:'Extra Raita',price:30,emoji:'🥛'},{name:'Salan',price:40,emoji:'🍲'},{name:'Extra Portion',price:200,emoji:'🍛'}],
    tags:['Rich','Dum-cooked','Slow-braised'], ingredients:['Bone-in Mutton','Aged Basmati','Yogurt','Saffron','Fried Onions','Whole Spices'],
  },
  'veg-hyd': {
    id:'veg-hyd', name:'Hyderabadi Veg Biryani', description:'Vegetables and paneer in saffron-infused rice.',
    longDesc:'A vegetarian masterpiece — seasonal vegetables, fresh paneer, and cashews slow-cooked in saffron-infused rice with classic Hyderabadi spices.',
    price:249, image_url:'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=800&h=800&fit=crop',
    rating:4.7, rating_count:650, is_veg:true, is_bestseller:true, prepTime:'25–30 min', serves:'1', calories:'560 kcal',
    addOns:[{name:'Extra Raita',price:30,emoji:'🥛'},{name:'Papad',price:15,emoji:'🫓'},{name:'Gulab Jamun',price:50,emoji:'🍮'}],
    tags:['Saffron','Paneer','Light'], ingredients:['Basmati Rice','Fresh Paneer','Vegetables','Saffron','Cashews','Mughlai Spices'],
  },
  'prawn-biryani': {
    id:'prawn-biryani', name:'Prawn Biryani', description:'Tiger prawns in coastal spice, layered basmati.',
    longDesc:'Jumbo tiger prawns marinated in tangy coastal masala, layered with long-grain basmati and slow-cooked. Bursting with coastal flavors.',
    price:449, image_url:'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=800&fit=crop',
    rating:4.8, rating_count:530, is_veg:false, is_bestseller:false, prepTime:'30–35 min', serves:'1–2', calories:'640 kcal',
    addOns:[{name:'Extra Raita',price:30,emoji:'🥛'},{name:'Salan',price:40,emoji:'🍲'}],
    tags:['Coastal','Spicy','Seafood'], ingredients:['Tiger Prawns','Basmati','Coastal Masala','Curry Leaves','Coconut','Tamarind'],
  },
  'paneer-biryani': {
    id:'paneer-biryani', name:'Paneer Biryani', description:'Creamy paneer in aromatic aged basmati.',
    longDesc:'Fresh cottage cheese cubes marinated in Mughlai spices, layered with aromatic basmati rice. Rich yet vegetarian.',
    price:269, image_url:'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&h=800&fit=crop',
    rating:4.6, rating_count:440, is_veg:true, is_bestseller:false, prepTime:'25–30 min', serves:'1', calories:'620 kcal',
    addOns:[{name:'Extra Raita',price:30,emoji:'🥛'},{name:'Papad',price:15,emoji:'🫓'}],
    tags:['Mughlai','Paneer','Creamy'], ingredients:['Fresh Paneer','Basmati','Mughlai Spices','Cashews','Cream','Saffron'],
  },
  'egg-biryani': {
    id:'egg-biryani', name:'Egg Biryani', description:'Golden eggs with whole spices and basmati.',
    longDesc:'Golden boiled eggs cooked in a rich masala base, layered with fragrant basmati rice and slow-cooked to perfection.',
    price:199, image_url:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop',
    rating:4.5, rating_count:380, is_veg:false, is_bestseller:false, prepTime:'20–25 min', serves:'1', calories:'520 kcal',
    addOns:[{name:'Extra Raita',price:30,emoji:'🥛'},{name:'Salan',price:40,emoji:'🍲'}],
    tags:['Light','Spicy','Everyday'], ingredients:['Boiled Eggs','Basmati','Whole Spices','Onion Masala','Coriander','Fried Onions'],
  },
};

export default function DishDetailPage() {
  const { id }   = useParams<{id:string}>();
  const router   = useRouter();
  const addItem  = useCartStore(s => s.addItem);
  const { user } = useAuthStore();
  const [qty,      setQty]      = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [liked,    setLiked]    = useState(false);
  const [activeTab,setActiveTab]= useState<'about'|'ingredients'>('about');

  const dish = DISHES[id];

  if (!dish) return (
    <div className="min-h-screen flex items-center justify-center pt-16" style={{background:'linear-gradient(135deg,#fff7ed,#fffbf5)'}}>
      <div className="text-center px-4">
        <p className="text-6xl mb-4">🍛</p>
        <h2 className="font-display text-2xl text-gray-600 mb-4">Dish not found</h2>
        <button onClick={()=>router.push('/dishes')} className="bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold shadow-orange">View Menu</button>
      </div>
    </div>
  );

  const toggleAddon = (name:string) => setSelected(p => p.includes(name) ? p.filter(n=>n!==name) : [...p, name]);
  const addonTotal  = dish.addOns.filter(a=>selected.includes(a.name)).reduce((s,a)=>s+a.price,0);
  const total       = (dish.price + addonTotal) * qty;

  const handleLike = () => {
    if (!user) { toast.error('Please login to add to wishlist'); router.push('/auth'); return; }
    setLiked(!liked);
    toast.success(liked ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const handleAdd = () => {
    const selectedAddOns = dish.addOns.filter(a=>selected.includes(a.name)).map(a=>({name:a.name,price:a.price}));
    addItem({ id:dish.id, name:dish.name, price:dish.price+addonTotal, image_url:dish.image_url, selectedAddOns });
    toast.success(`${dish.name} added! 🍛`);
  };

  return (
    <div
      className="min-h-screen pb-32"
      style={{ background: 'linear-gradient(160deg, #fff7ed 0%, #fffbf5 40%, #fff8f0 70%, #fffbf5 100%)' }}
    >
      {/* SVG texture */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.035] z-0" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="dp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="25" stroke="#f97316" strokeWidth="0.8" fill="none"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#dp)"/>
      </svg>

      {/* Back */}
      <button onClick={()=>router.back()}
        className="fixed top-20 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-card border border-orange-100">
        <ArrowLeft className="w-5 h-5 text-gray-700"/>
      </button>
      {/* Like */}
      <motion.button whileTap={{scale:0.85}} onClick={handleLike}
        className="fixed top-20 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-card border border-orange-100">
        <Heart className={`w-5 h-5 transition-colors ${liked?'fill-red-500 text-red-500':'text-gray-400'}`}/>
      </motion.button>

      {/* Hero image */}
      <div className="relative pt-16 flex items-center justify-center overflow-hidden" style={{height:320}}>
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 60%, rgba(249,115,22,0.08), transparent 70%)'}}/>
        <motion.div animate={{rotate:360}} transition={{duration:28,repeat:Infinity,ease:'linear'}}
          className="relative z-10" style={{width:240,height:240}}>
          <Image src={dish.image_url} alt={dish.name} fill priority className="object-cover rounded-full"
            style={{boxShadow:'0 24px 64px rgba(249,115,22,0.22), 0 8px 24px rgba(0,0,0,0.10)'}}/>
          <div className="absolute inset-0 rounded-full ring-4 ring-white/70 pointer-events-none"/>
        </motion.div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/8 blur-2xl rounded-full"/>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 mt-2 space-y-4">
        {/* Badges + title */}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${dish.is_veg?'bg-green-500':'bg-red-500'}`}>
              {dish.is_veg?<Leaf className="w-3.5 h-3.5 text-white"/>:<Flame className="w-3.5 h-3.5 text-white"/>}
            </span>
            {dish.is_bestseller && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">🏆 Bestseller</span>}
            {dish.tags.map(t=><span key={t} className="bg-orange-50 text-orange-600 text-xs px-2.5 py-0.5 rounded-full border border-orange-200">{t}</span>)}
          </div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display font-bold text-2xl text-gray-900 leading-tight">{dish.name}</h1>
            <span className="font-bold text-primary-600 text-2xl flex-shrink-0">{formatPrice(dish.price)}</span>
          </div>
          {/* Quick stats */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>
              <span className="font-bold text-sm text-gray-800">{dish.rating}</span>
              <span className="text-xs text-gray-400">({dish.rating_count})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-3.5 h-3.5 text-primary-400"/>{dish.prepTime}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ChefHat className="w-3.5 h-3.5 text-primary-400"/>Serves {dish.serves}
            </div>
            <span className="text-sm text-gray-400">{dish.calories}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-orange-100">
            {(['about','ingredients'] as const).map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab===tab?'text-primary-600 border-b-2 border-primary-500 bg-primary-50/60':'text-gray-500'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4">
            <AnimatePresence mode="wait">
              {activeTab==='about'
                ? <motion.p key="a" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="text-gray-600 text-sm leading-relaxed">{dish.longDesc}</motion.p>
                : <motion.div key="i" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="flex flex-wrap gap-2">
                    {dish.ingredients.map(ing=><span key={ing} className="bg-orange-50 text-orange-700 border border-orange-200 text-xs px-3 py-1.5 rounded-xl font-medium">{ing}</span>)}
                  </motion.div>
              }
            </AnimatePresence>
          </div>
        </div>

        {/* Qty */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center justify-between">
          <p className="font-semibold text-gray-700 text-sm">Quantity</p>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{scale:0.85}} onClick={()=>setQty(q=>Math.max(1,q-1))}
              className="w-9 h-9 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold hover:bg-primary-200 transition-colors">
              <Minus className="w-4 h-4"/>
            </motion.button>
            <span className="font-bold text-xl text-gray-900 w-6 text-center">{qty}</span>
            <motion.button whileTap={{scale:0.85}} onClick={()=>setQty(q=>q+1)}
              className="w-9 h-9 bg-primary-500 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors">
              <Plus className="w-4 h-4"/>
            </motion.button>
          </div>
        </div>

        {/* Add-ons */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Customize <span className="text-gray-400 font-normal text-sm">(optional)</span></h3>
          <div className="space-y-2">
            {dish.addOns.map(a=>{
              const on=selected.includes(a.name);
              return (
                <motion.button key={a.name} whileTap={{scale:0.97}} onClick={()=>toggleAddon(a.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all ${on?'border-primary-400 bg-primary-50':'border-gray-100 bg-gray-50/80 hover:border-gray-200'}`}>
                  <span className="text-xl">{a.emoji}</span>
                  <span className={`flex-1 text-sm font-medium ${on?'text-primary-700':'text-gray-700'}`}>{a.name}</span>
                  <span className={`text-sm font-bold ${on?'text-primary-600':'text-gray-400'}`}>+{formatPrice(a.price)}</span>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${on?'bg-primary-500 border-primary-500':'border-gray-300'}`}>
                    {on&&<span className="text-white text-xs font-bold">✓</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/96 backdrop-blur-sm border-t border-orange-100 px-4 py-4 z-20">
        <div className="max-w-2xl mx-auto">
          {(selected.length>0||qty>1)&&(
            <div className="flex justify-between text-sm text-gray-600 mb-2 px-1">
              <span>{dish.name} ×{qty}</span>
              <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
            </div>
          )}
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={handleAdd}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-orange">
            <ShoppingCart className="w-5 h-5"/>
            Add to Cart · {formatPrice(total)}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
