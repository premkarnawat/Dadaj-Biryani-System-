'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Package, ChevronDown, RefreshCw, FileText } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string,string> = {
  DELIVERED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-700',
  ON_THE_WAY:'bg-blue-100 text-blue-700',  PREPARING:'bg-orange-100 text-orange-700',
  PLACED:'bg-gray-100 text-gray-600',
};

const ORDERS = [
  { id:'DB20240001', items:[{name:'Chicken Dum Biryani',qty:2,price:299},{name:'Extra Raita',qty:1,price:30}], subtotal:628, gst:31, delivery:0, discount:0, total:659, status:'DELIVERED', date:'10 Jul 2024 10:35 AM', payment:'UPI' },
  { id:'DB20240002', items:[{name:'Mutton Dum Biryani',qty:1,price:399}], subtotal:399, gst:20, delivery:0, discount:100, total:319, status:'DELIVERED', date:'5 Jul 2024 7:20 PM',  payment:'Card' },
  { id:'DB20240003', items:[{name:'Hyderabadi Veg Biryani',qty:2,price:249},{name:'Gulab Jamun',qty:1,price:50}], subtotal:548, gst:27, delivery:0, discount:0, total:575, status:'CANCELLED', date:'28 Jun 2024 1:15 PM', payment:'COD' },
];

function Invoice({ order }: { order: typeof ORDERS[number] }) {
  const printInvoice = () => {
    const w = window.open('','_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Invoice ${order.id}</title>
      <style>body{font-family:sans-serif;padding:32px;max-width:480px;margin:auto}
      h1{color:#ea580c;font-size:22px}table{width:100%;border-collapse:collapse;margin:16px 0}
      td,th{border-bottom:1px solid #eee;padding:8px 4px;font-size:13px}
      .total{font-weight:bold;color:#ea580c;font-size:16px}
      .footer{text-align:center;color:#999;font-size:11px;margin-top:24px}</style></head>
      <body>
        <h1>🍛 DADAJ BIRYANI</h1>
        <p style="color:#999;font-size:12px">Invoice · ${order.id} · ${order.date}</p>
        <table><tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        ${order.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>₹${i.price*i.qty}</td></tr>`).join('')}
        <tr><td colspan="2">Subtotal</td><td>₹${order.subtotal}</td></tr>
        <tr><td colspan="2">GST (5%)</td><td>₹${order.gst}</td></tr>
        <tr><td colspan="2">Delivery</td><td>${order.delivery===0?'FREE':'₹'+order.delivery}</td></tr>
        ${order.discount>0?`<tr><td colspan="2">Discount</td><td>-₹${order.discount}</td></tr>`:''}
        <tr class="total"><td colspan="2">Total Paid</td><td>₹${order.total}</td></tr></table>
        <p>Payment: ${order.payment}</p>
        <div class="footer">DADAJ BIRYANI · Sadar Bazar, Satara 415001<br>Thank you for your order!</div>
      </body></html>`);
    w.document.close();
    w.print();
    toast.success('Invoice ready to print/save as PDF');
  };
  return (
    <button onClick={printInvoice} className="flex items-center gap-1.5 text-xs bg-orange-50 text-primary-600 border border-orange-200 px-3 py-1.5 rounded-xl font-semibold hover:bg-orange-100 transition-colors">
      <FileText className="w-3 h-3"/>Invoice
    </button>
  );
}

export default function OrderHistoryPage() {
  const [expanded, setExpanded] = useState<string|null>(null);

  return (
    <div className="min-h-screen bg-brand-cream pt-16 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="py-5 flex items-center gap-3">
          <Link href="/profile"><button className="w-9 h-9 bg-white rounded-xl border border-orange-100 flex items-center justify-center shadow-sm"><ArrowLeft className="w-4 h-4"/></button></Link>
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">Order History</h1>
            <p className="text-sm text-gray-400">{ORDERS.length} orders</p>
          </div>
        </div>

        <div className="space-y-3">
          {ORDERS.map((o,i)=>(
            <motion.div key={o.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.09}}
              className="bg-white rounded-2xl border border-orange-50 shadow-sm overflow-hidden">
              {/* Summary row */}
              <div className="p-4 flex items-start justify-between gap-3 cursor-pointer" onClick={()=>setExpanded(expanded===o.id?null:o.id)}>
                <div className="flex gap-3">
                  <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-primary-500"/>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{o.items[0].name}{o.items.length>1?` +${o.items.length-1} more`:''}</p>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">{o.id}</p>
                    <p className="text-xs text-gray-400">{o.date}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">{formatPrice(o.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status.replace('_',' ')}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 mt-1 ml-auto transition-transform ${expanded===o.id?'rotate-180':''}`}/>
                </div>
              </div>

              {/* Expanded bill */}
              <AnimatePresence>
                {expanded===o.id && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                    className="overflow-hidden border-t border-orange-50">
                    <div className="p-4 bg-orange-50/50 space-y-2">
                      {o.items.map(it=>(
                        <div key={it.name} className="flex justify-between text-sm text-gray-600">
                          <span>{it.name} ×{it.qty}</span><span>{formatPrice(it.price*it.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t border-orange-200 pt-2 space-y-1 text-sm">
                        <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span>{formatPrice(o.gst)}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{o.delivery===0?'FREE':formatPrice(o.delivery)}</span></div>
                        {o.discount>0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>-{formatPrice(o.discount)}</span></div>}
                        <div className="flex justify-between font-bold text-gray-900 text-base pt-1"><span>Total Paid</span><span className="text-primary-600">{formatPrice(o.total)}</span></div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-2 border-t border-orange-200">
                        <Invoice order={o}/>
                        {o.status==='DELIVERED' && (
                          <Link href="/dishes" className="flex items-center gap-1.5 text-xs bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                            <RefreshCw className="w-3 h-3"/>Reorder
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {ORDERS.length===0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <h3 className="font-display font-semibold text-xl text-gray-600 mb-2">No orders yet</h3>
            <Link href="/dishes"><button className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-orange mt-4">Order Now 🍛</button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
