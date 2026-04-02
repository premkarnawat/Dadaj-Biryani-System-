'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Leaf, Flame, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const DISHES: Record<string, {
  id: string; name: string; description: string; longDesc: string;
  price: number; image_url: string; rating: number; rating_count: number;
  is_veg: boolean; is_bestseller: boolean;
  addOns: { name: string; price: number }[];
  tags: string[];
}> = {
  'chicken-dum': {
    id: 'chicken-dum', name: 'Chicken Dum Biryani',
    description: 'Slow-cooked tender chicken in aromatic basmati.',
    longDesc: 'Our signature Chicken Dum Biryani is prepared using the ancient dum-pukht technique — slow-cooking layers of marinated chicken and long-grain basmati rice in a sealed handi for 4 hours. Each grain absorbs the essence of whole spices, saffron, and caramelized onions, resulting in a dish that is deeply flavorful yet balanced. Served with raita and salan.',
    price: 299, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop',
    rating: 4.9, rating_count: 1240, is_veg: false, is_bestseller: true,
    addOns: [{ name: 'Extra Raita', price: 30 }, { name: 'Salan', price: 40 }, { name: 'Boiled Egg', price: 20 }, { name: 'Extra Portion', price: 150 }],
    tags: ['Spicy', 'Dum-cooked', 'Saffron'],
  },
  'mutton-dum': {
    id: 'mutton-dum', name: 'Mutton Dum Biryani',
    description: 'Tender mutton in the royal dum style.',
    longDesc: 'Our Mutton Dum Biryani uses slow-braised, bone-in mutton pieces from local farms. The meat is marinated overnight in yogurt and spices before being layered with aged Basmati rice and cooked dum style for 5 hours. Rich, hearty, and deeply satisfying.',
    price: 399, image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop',
    rating: 4.8, rating_count: 980, is_veg: false, is_bestseller: true,
    addOns: [{ name: 'Extra Raita', price: 30 }, { name: 'Salan', price: 40 }, { name: 'Extra Portion', price: 200 }],
    tags: ['Rich', 'Dum-cooked', 'Slow-braised'],
  },
  'veg-hyd': {
    id: 'veg-hyd', name: 'Hyderabadi Veg Biryani',
    description: 'Vegetables and paneer in saffron-infused rice.',
    longDesc: 'A vegetarian masterpiece — seasonal vegetables, fresh paneer, and cashews slow-cooked in a saffron-infused rice with classic Hyderabadi spices. Rich yet light on the palate.',
    price: 249, image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=800&h=600&fit=crop',
    rating: 4.7, rating_count: 650, is_veg: true, is_bestseller: true,
    addOns: [{ name: 'Extra Raita', price: 30 }, { name: 'Papad', price: 15 }, { name: 'Gulab Jamun', price: 50 }],
    tags: ['Saffron', 'Paneer', 'Light'],
  },
};

export default function DishDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);

  const dish = DISHES[id];

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🍛</p>
          <h2 className="font-display text-2xl text-gray-700">Dish not found</h2>
        </div>
      </div>
    );
  }

  const toggleAddOn = (addon: { name: string; price: number }) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const addOnTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
  const itemTotal = (dish.price + addOnTotal) * quantity;

  const handleAddToCart = () => {
    addItem({ id: dish.id, name: dish.name, price: dish.price + addOnTotal, image_url: dish.image_url, selectedAddOns });
    toast.success(`${dish.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-28">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-card border border-orange-100"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Hero Image */}
      <motion.div
        layoutId={`dish-image-${dish.id}`}
        className="relative h-72 sm:h-96 w-full"
      >
        <Image src={dish.image_url} alt={dish.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          {dish.tags.map((tag) => (
            <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Title & Meta */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-5 h-5 rounded flex items-center justify-center ${dish.is_veg ? 'bg-green-500' : 'bg-red-500'}`}>
                  {dish.is_veg ? <Leaf className="w-3 h-3 text-white" /> : <Flame className="w-3 h-3 text-white" />}
                </span>
                {dish.is_bestseller && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">🏆 Bestseller</span>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl text-gray-900">{dish.name}</h1>
            </div>
            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex-shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{dish.rating}</span>
              <span className="text-xs text-gray-400">({dish.rating_count})</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">{dish.longDesc}</p>
        </div>

        {/* Add-ons */}
        <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Customize Your Order</h3>
          <div className="space-y-2">
            {dish.addOns.map((addon) => {
              const selected = !!selectedAddOns.find((a) => a.name === addon.name);
              return (
                <motion.button
                  key={addon.name}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleAddOn(addon)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                    selected ? 'bg-primary-50 border-primary-400 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${selected ? 'bg-primary-500 border-primary-500' : 'border-gray-400'}`}>
                      {selected && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span>{addon.name}</span>
                  </div>
                  <span className="font-semibold">+{formatPrice(addon.price)}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="fixed bottom-20 left-0 right-0 md:relative md:bottom-auto px-4 md:px-0">
          <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-lg flex items-center justify-between gap-4">
            {/* Qty */}
            <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-orange-100 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-lg w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-orange"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart · {formatPrice(itemTotal)}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
