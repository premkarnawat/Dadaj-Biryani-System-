'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center max-w-sm">
        <motion.div animate={{y:[-8,8,-8]}} transition={{duration:3,repeat:Infinity,ease:'easeInOut'}} className="text-8xl mb-6">🍛</motion.div>
        <h1 className="font-display font-bold text-6xl text-primary-500 mb-2">404</h1>
        <h2 className="font-display font-bold text-2xl text-gray-800 mb-3">Biryani Not Found</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Looks like this page is still being cooked.<br/>Let&apos;s get you back to the menu.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/"><motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}} className="bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold shadow-orange">Back to Home</motion.button></Link>
          <Link href="/dishes"><motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}} className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold border border-orange-200">View Menu</motion.button></Link>
        </div>
      </motion.div>
    </div>
  );
}
