'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ChefHat, Bike, Home, Package } from 'lucide-react';
import { getOrderStatusLabel } from '@/lib/utils';

const STATUS_STEPS = [
  { key: 'PLACED',    label: 'Order Placed',    icon: CheckCircle, desc: 'Your order has been received' },
  { key: 'ACCEPTED',  label: 'Accepted',        icon: CheckCircle, desc: 'Restaurant confirmed your order' },
  { key: 'PREPARING', label: 'Preparing',       icon: ChefHat,     desc: 'Chef is cooking your biryani' },
  { key: 'PICKED',    label: 'Picked Up',       icon: Package,     desc: 'Delivery partner picked your order' },
  { key: 'ON_THE_WAY',label: 'On The Way',      icon: Bike,        desc: 'Your order is on the way' },
  { key: 'DELIVERED', label: 'Delivered',       icon: Home,        desc: 'Order delivered successfully!' },
];

// Demo: auto-advance through statuses
const DEMO_PROGRESSION = ['PLACED', 'ACCEPTED', 'PREPARING', 'PICKED', 'ON_THE_WAY', 'DELIVERED'];

export default function TrackingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState(28);

  useEffect(() => {
    if (currentStep >= DEMO_PROGRESSION.length - 1) return;
    const timer = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, DEMO_PROGRESSION.length - 1));
      setEta((e) => Math.max(0, e - 5));
    }, 5000);
    return () => clearInterval(timer);
  }, [currentStep]);

  const currentStatus = DEMO_PROGRESSION[currentStep];
  const isDelivered = currentStatus === 'DELIVERED';

  return (
    <div className="min-h-screen bg-brand-cream pt-20 pb-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-6">Track Order</h1>

        {/* Status Card */}
        <motion.div
          key={currentStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 mb-6 shadow-card ${isDelivered ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`}
        >
          <div className="text-white">
            <p className="text-sm opacity-80 mb-1">Current Status</p>
            <h2 className="font-display font-bold text-2xl mb-1">{getOrderStatusLabel(currentStatus)}</h2>
            {!isDelivered && (
              <div className="flex items-center gap-1.5 mt-2">
                <Clock className="w-4 h-4 opacity-80" />
                <span className="text-sm opacity-90">ETA: ~{eta} minutes</span>
              </div>
            )}
            {isDelivered && <p className="text-sm opacity-90 mt-1">Enjoy your royal biryani! 👑</p>}
          </div>
        </motion.div>

        {/* Delivery Agent */}
        {(currentStep >= 3) && !isDelivered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm mb-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">
              🧑
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Ravi Kumar</p>
              <p className="text-sm text-gray-500">Your delivery partner</p>
            </div>
            <a href="tel:+919876543210" className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Call
            </a>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-5">Order Progress</h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
            <motion.div
              className="absolute left-5 top-5 w-0.5 bg-primary-500 origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: currentStep / (STATUS_STEPS.length - 1) }}
              transition={{ duration: 0.5 }}
              style={{ height: `${((STATUS_STEPS.length - 1) / STATUS_STEPS.length) * 100}%` }}
            />

            <div className="space-y-6">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= currentStep;
                const isCurrent = i === currentStep;
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: isCompleted ? 1 : 0.4 }}
                    className="flex items-start gap-4 relative"
                  >
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        isCompleted
                          ? isCurrent ? 'bg-primary-500 shadow-orange' : 'bg-green-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isCompleted ? (isCurrent ? 'text-white' : 'text-green-600') : 'text-gray-400'}`} />
                    </motion.div>
                    <div className="pt-1">
                      <p className={`font-semibold text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 mt-4">
          <p className="text-xs text-gray-400 font-mono text-center">
            Order ID: DB{Date.now().toString().slice(-8)} · Placed at {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
