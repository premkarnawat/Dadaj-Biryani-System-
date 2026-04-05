'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const THREADS = [
  { userId:'u1', name:'Rohit Sharma', avatar:'🧑', lastMsg:'Where is my order?', time:'2m', unread:2 },
  { userId:'u2', name:'Priya Patel',  avatar:'👩', lastMsg:'Can I cancel?',       time:'5m', unread:1 },
  { userId:'u3', name:'Amit Kumar',   avatar:'🧔', lastMsg:'Thank you!',           time:'12m',unread:0 },
];

const INIT_MSGS: Record<string,{from:'user'|'admin';text:string}[]> = {
  u1:[{from:'user',text:'Where is my order?'},{from:'admin',text:'Your order is on the way, ETA 10 minutes!'}],
  u2:[{from:'user',text:'Can I cancel?'},{from:'admin',text:'Sorry, your order is already being prepared. We cannot cancel at this stage.'}],
  u3:[{from:'admin',text:'Your order has been delivered!'},{from:'user',text:'Thank you!'}],
};

export default function AdminChatPage() {
  const [active,  setActive]  = useState('u1');
  const [msgs,    setMsgs]    = useState(INIT_MSGS);
  const [reply,   setReply]   = useState('');

  const send = () => {
    if (!reply.trim()) return;
    setMsgs(p=>({...p,[active]:[...(p[active]||[]),{from:'admin',text:reply.trim()}]}));
    setReply('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex">
      {/* Thread list */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Support Chat</h2>
          <p className="text-xs text-gray-400">{THREADS.reduce((s,t)=>s+t.unread,0)} unread</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {THREADS.map(t=>(
            <button key={t.userId} onClick={()=>setActive(t.userId)}
              className={`w-full flex items-center gap-3 p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${active===t.userId?'bg-orange-50':''}`}>
              <span className="text-2xl">{t.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-400 truncate">{t.lastMsg}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">{t.time}</p>
                {t.unread>0 && <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center mt-1 ml-auto font-bold">{t.unread}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <p className="font-bold text-gray-900">{THREADS.find(t=>t.userId===active)?.name}</p>
          <p className="text-xs text-gray-400">Admin Chat</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(msgs[active]||[]).map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              className={`flex ${m.from==='admin'?'justify-end':'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                m.from==='admin'?'bg-primary-500 text-white rounded-tr-sm':'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
          <input value={reply} onChange={e=>setReply(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="Type a reply..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400"/>
          <motion.button whileTap={{scale:0.93}} onClick={send}
            className="w-11 h-11 bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-orange">
            <Send className="w-4 h-4"/>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
