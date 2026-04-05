'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Leaf, Flame, SlidersHorizontal } from 'lucide-react';
import DishCard from '@/components/dishes/DishCard';
import DishModal from '@/components/dishes/DishModal';

const ALL_DISHES = [
  { id:'chicken-dum',    name:'Chicken Dum Biryani',    description:'Slow-cooked tender chicken layered with fragrant basmati rice and royal spices. Served with raita.',     price:299, image_url:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop', rating:4.9, rating_count:1240, is_veg:false, is_bestseller:true,  category:'non-veg', prepTime:'30–35 min' },
  { id:'mutton-dum',     name:'Mutton Dum Biryani',     description:'Tender mutton pieces in aromatic dum-cooked basmati. Overnight marinated, slow-braised for 5 hours.',    price:399, image_url:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop', rating:4.8, rating_count:980,  is_veg:false, is_bestseller:true,  category:'non-veg', prepTime:'35–40 min' },
  { id:'veg-hyd',        name:'Hyderabadi Veg Biryani', description:'Saffron-infused basmati with fresh paneer and seasonal vegetables. Rich Mughlai spice base.',            price:249, image_url:'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=600&h=400&fit=crop', rating:4.7, rating_count:650,  is_veg:true,  is_bestseller:true,  category:'veg',     prepTime:'25–30 min' },
  { id:'prawn-biryani',  name:'Prawn Biryani',          description:'Tiger prawns marinated in coastal spices, layered with long-grain basmati.',                             price:449, image_url:'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop', rating:4.8, rating_count:530,  is_veg:false, is_bestseller:false, category:'non-veg', prepTime:'30–35 min' },
  { id:'paneer-biryani', name:'Paneer Biryani',         description:'Creamy cottage cheese in Mughlai spices, layered with aromatic aged basmati.',                           price:269, image_url:'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&h=400&fit=crop', rating:4.6, rating_count:440,  is_veg:true,  is_bestseller:false, category:'veg',     prepTime:'25–30 min' },
  { id:'egg-biryani',    name:'Egg Biryani',            description:'Golden boiled eggs cooked with whole spices and fragrant basmati. Light yet deeply satisfying.',         price:199, image_url:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', rating:4.5, rating_count:380,  is_veg:false, is_bestseller:false, category:'non-veg', prepTime:'20–25 min' },
  { id:'mushroom-biryani',name:'Mushroom Biryani',      description:'Fresh button mushrooms in aromatic basmati — light yet flavorful. Perfect weekday meal.',               price:229, image_url:'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=600&h=400&fit=crop', rating:4.5, rating_count:290,  is_veg:true,  is_bestseller:false, category:'veg',     prepTime:'25–30 min' },
  { id:'fish-biryani',   name:'Fish Biryani',           description:'Coastal-style biryani with marinated fish fillets, curry leaves and tangy spices.',                     price:379, image_url:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', rating:4.6, rating_count:320,  is_veg:false, is_bestseller:false, category:'non-veg', prepTime:'30–35 min' },
  { id:'combo-family',   name:'Royal Family Combo',     description:'Chicken Dum + Mutton Dum + 2 Raitas + 1 Salan. Feeds 4 people. Best value deal.',                      price:899, image_url:'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop', rating:4.9, rating_count:210,  is_veg:false, is_bestseller:true,  category:'combo',   prepTime:'40–45 min' },
];

const CATS = ['All','Non-Veg','Veg','Combos'];

type Dish = typeof ALL_DISHES[number];

export default function DishesPage() {
  const [search,       setSearch]       = useState('');
  const [cat,          setCat]          = useState('All');
  const [vegOnly,      setVegOnly]      = useState(false);
  const [sort,         setSort]         = useState<'popular'|'price-asc'|'price-desc'>('popular');
  const [selectedDish, setSelectedDish] = useState<Dish|null>(null);

  const filtered = ALL_DISHES
    .filter(d => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (cat === 'Non-Veg' && d.category !== 'non-veg') return false;
      if (cat === 'Veg'     && d.category !== 'veg')     return false;
      if (cat === 'Combos'  && d.category !== 'combo')   return false;
      if (vegOnly && !d.is_veg) return false;
      return true;
    })
    .sort((a,b) => sort==='price-asc' ? a.price-b.price : sort==='price-desc' ? b.price-a.price : b.rating_count-a.rating_count);

  return (
    <div className="min-h-screen bg-brand-cream pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-4">
          <h1 className="font-display font-bold text-3xl text-gray-900">Our Menu</h1>
          <p className="text-gray-400 mt-1">{filtered.length} dishes · tap to see details</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-orange-100 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search biryanis..."
              className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"/>
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value as typeof sort)}
            className="bg-white border border-orange-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none shadow-sm">
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <button onClick={()=>setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${vegOnly?'bg-green-500 text-white border-green-500':'bg-white text-gray-600 border-orange-100 hover:border-green-400'}`}>
            <Leaf className="w-4 h-4"/>Veg Only
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          {CATS.map(c=>(
            <motion.button key={c} whileTap={{scale:0.95}} onClick={()=>setCat(c)}
              className={`flex-shrink-0 px-5 py-2 rounded-2xl text-sm font-semibold transition-all ${cat===c?'bg-primary-500 text-white shadow-orange':'bg-white text-gray-600 border border-orange-100 hover:border-primary-300'}`}>
              {c}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20">
              <p className="text-5xl mb-4">🍛</p>
              <h3 className="font-display font-semibold text-xl text-gray-600">No dishes found</h3>
              <p className="text-gray-400 mt-1">Try a different filter</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((dish,i) => (
                <motion.div key={dish.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                  <DishCard {...dish} onClick={()=>setSelectedDish(dish)}/>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedDish && <DishModal dish={selectedDish} onClose={()=>setSelectedDish(null)}/>}
      </AnimatePresence>
    </div>
  );
}
