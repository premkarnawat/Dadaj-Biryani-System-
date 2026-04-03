'use client';
export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { timeAgo } from '@/lib/utils';

interface Message {
  id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

const BOT_RESPONSES: Record<string, string> = {
  default: "Hi! I'm the DADAJ BIRYANI support bot 🍛. How can I help you today? You can ask about your order, delivery time, or menu.",
  order: "For order issues, please share your Order ID. Our team typically resolves queries within 30 minutes. You can also track your order in real-time on the Track Order page.",
  delivery: "Our average delivery time is 25–35 minutes. In case of delays, our delivery partner will contact you. Free delivery is available on orders above ₹500!",
  cancel: "To cancel an order, it must be done within 2 minutes of placing. Please call our helpline at 1800-DADAJ for immediate assistance.",
  refund: "Refunds are processed within 5–7 business days to your original payment method. For cash orders, we offer store credits.",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('order') || lower.includes('status')) return BOT_RESPONSES.order;
  if (lower.includes('deliver') || lower.includes('time') || lower.includes('eta')) return BOT_RESPONSES.delivery;
  if (lower.includes('cancel')) return BOT_RESPONSES.cancel;
  if (lower.includes('refund') || lower.includes('money')) return BOT_RESPONSES.refund;
  return BOT_RESPONSES.default;
}

export default function HelpPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', message: BOT_RESPONSES.default, is_admin: true, created_at: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message: input.trim(),
      is_admin: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(false);
    setBotTyping(true);

    // Simulate bot response delay
    await new Promise((res) => setTimeout(res, 1200));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      message: getBotResponse(userMessage.message),
      is_admin: true,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setBotTyping(false);

    // Save to Supabase if logged in
    if (user) {
      try {
        await supabase.from('chat_messages').insert([
          { user_id: user.id, message: userMessage.message, is_admin: false },
          { user_id: user.id, message: botResponse.message, is_admin: true },
        ]);
      } catch { /* silent */ }
    }
  };

  const QUICK_REPLIES = ['Where is my order?', 'Delivery time?', 'How to cancel?', 'Refund policy'];

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 flex flex-col flex-1">
        {/* Header */}
        <div className="py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-gray-900">Support Chat</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Online · Usually replies instantly</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
              >
                {msg.is_admin && (
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center mr-2 mt-auto flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary-500" />
                  </div>
                )}
                <div className={`max-w-xs sm:max-w-sm ${msg.is_admin ? '' : 'ml-auto'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.is_admin
                      ? 'bg-white border border-orange-100 text-gray-700 rounded-tl-sm shadow-sm'
                      : 'bg-primary-500 text-white rounded-tr-sm shadow-orange'
                  }`}>
                    {msg.message}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${msg.is_admin ? 'ml-1' : 'text-right mr-1'}`}>
                    {timeAgo(msg.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {botTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary-500" />
              </div>
              <div className="bg-white border border-orange-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => setInput(reply)}
              className="flex-shrink-0 bg-white border border-orange-200 text-gray-600 text-xs px-3 py-1.5 rounded-xl hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white border border-orange-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || botTyping}
            className="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-orange disabled:opacity-50 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
