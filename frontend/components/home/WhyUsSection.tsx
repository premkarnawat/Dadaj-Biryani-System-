'use client';

import { motion } from 'framer-motion';
import { Clock, Shield, Star, Truck } from 'lucide-react';

const FEATURES = [
  { icon: Clock, title: '30 Min Delivery', desc: 'Hot & fresh to your door, guaranteed.', color: 'bg-orange-100 text-orange-600' },
  { icon: Star, title: 'Premium Quality', desc: 'Only the finest Basmati & spices.', color: 'bg-amber-100 text-amber-600' },
  { icon: Shield, title: 'Safe & Hygienic', desc: 'FSSAI certified kitchen standards.', color: 'bg-green-100 text-green-600' },
  { icon: Truck, title: 'Live Tracking', desc: 'Track your order in real-time.', color: 'bg-blue-100 text-blue-600' },
];

export default function WhyUsSection() {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">Why DADAJ BIRYANI?</h2>
        <p className="text-gray-400 mt-2">A royal experience in every bite</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 text-center shadow-sm border border-orange-50"
          >
            <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-gray-800 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
