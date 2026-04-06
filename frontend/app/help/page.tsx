'use client';
export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Phone, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { timeAgo } from '@/lib/utils';

interface Msg { id:string; message:string; is_admin:boolean; created_at:string }

const BOT: Record<string,string> = {
  default: "Hi! I'm the DADAJ BIRYANI support bot 🍛. How can I help you? Ask about your order, delivery, or menu.",
  order:   "Share your Order ID and we'll check immediately. You can also track live on the Track Order page.",
  delivery:"Average delivery: 25–35 mins. Free delivery on orders above ₹500!",
  cancel:  "Orders can be cancelled within 2 minutes of placing. Call 1800-DADAJ for urgent help.",
  refund:  "Refunds process in 5–7 business days to your original payment method.",
  menu:    "Browse our full menu at /dishes. We have Chicken, Mutton, Prawn, Veg & Paneer Biryanis!",
};

function getBotReply(msg:string):string {
  const m = msg.toLowerCase();
  if (m.includes('order')||m.includes('status')) return BOT.order;
  if (m.includes('deliver')||m.includes('time')||m.includes('eta')) return BOT.delivery;
  if (m.includes('cancel')) return BOT.cancel;
  if (m.includes('refund')||m.includes('money')) return BOT.refund;
  if (m.includes('menu')||m.includes('biryani')||m.includes('dish')) return BOT.menu;
  return BOT.default;
}

const QUICK = ['Where is my order?','Delivery time?','How to cancel?','Refund policy','View menu'];

export default function HelpPage() {
  const { user } = useAuthStore();
  const [msgs,   setMsgs]   = useState<Msg[]>([{id:'0',message:BOT.default,is_admin:true,created_at:new Date().toISOString()}]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load history from Supabase if logged in
  useEffect(() => {
    if (!user) return;
    supabase.from('chat_messages').select('*').eq('user_id',user.id)
      .order('created_at',{ascending:true}).limit(50)
      .then(({data}) => { if (data && data.length>0) setMsgs(data); });
  }, [user]);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}); }, [msgs, typing]);

  const send = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || typing) return;
    const userMsg:Msg = {id:Date.now().toString(),message:input.trim(),is_admin:false,created_at:new Date().toISOString()};
    setMsgs(p=>[...p,userMsg]);
    setInput('');
    setTyping(true);

    // Save to Supabase
    if (user) supabase.from('chat_messages').insert({user_id:user.id,message:userMsg.message,is_admin:false}).then(()=>{});

    await new Promise(r=>setTimeout(r,1100));
    const reply:Msg = {id:(Date.now()+1).toString(),message:getBotReply(userMsg.message),is_admin:true,created_at:new Date().toISOString()};
    setMsgs(p=>[...p,reply]);
    setTyping(false);
    if (user) supabase.from('chat_messages').insert({user_id:user.id,message:reply.message,is_admin:true}).then(()=>{});
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 flex flex-col flex-1">

        {/* Header */}
        <div className="py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"><Bot className="w-5 h-5 text-primary-500"/></div>
            <div>
              <h1 className="font-display font-bold text-lg text-gray-900">Support</h1>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/><span className="text-xs text-gray-500">Online</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:1800DADAJ" className="w-9 h-9 bg-green-50 border border-green-200 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors"><Phone className="w-4 h-4"/></a>
            <a href="mailto:support@dadajbiryani.com" className="w-9 h-9 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors"><Mail className="w-4 h-4"/></a>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          <AnimatePresence>
            {msgs.map(msg => (
              <motion.div key={msg.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className={`flex ${msg.is_admin?'justify-start':'justify-end'}`}>
                {msg.is_admin && (
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-2 mt-auto flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary-500"/>
                  </div>
                )}
                <div className={`max-w-xs sm:max-w-sm`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.is_admin?'bg-white border border-orange-100 text-gray-700 rounded-tl-sm shadow-sm':'bg-primary-500 text-white rounded-tr-sm shadow-orange'}`}>
                    {msg.message}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${msg.is_admin?'ml-1':'text-right mr-1'}`}>{timeAgo(msg.created_at)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-primary-500"/></div>
              <div className="bg-white border border-orange-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  {[0,1,2].map(i=>(
                    <motion.div key={i} animate={{y:[-2,2,-2]}} transition={{duration:0.6,repeat:Infinity,delay:i*0.15}}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"/>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Quick replies */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK.map(q=>(
            <button key={q} onClick={()=>setInput(q)}
              className="flex-shrink-0 bg-white border border-orange-200 text-gray-600 text-xs px-3 py-1.5 rounded-xl hover:border-primary-400 hover:text-primary-600 transition-colors whitespace-nowrap">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={send} className="flex gap-2 mt-2">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..."
            className="flex-1 bg-white border border-orange-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"/>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.93}} type="submit" disabled={!input.trim()||typing}
            className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-orange disabled:opacity-50 flex-shrink-0">
            <Send className="w-4 h-4"/>
          </motion.button>
        </form>
      </div>
    </div>
  );
}
