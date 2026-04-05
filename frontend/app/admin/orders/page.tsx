'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

const ALL_STATUS = ['ALL','PLACED','ACCEPTED','PREPARING','PICKED','ON_THE_WAY','DELIVERED','CANCELLED'];

const NEXT: Record<string,string> = {
  PLACED:'ACCEPTED', ACCEPTED:'PREPARING', PREPARING:'PICKED', PICKED:'ON_THE_WAY', ON_THE_WAY:'DELIVERED',
};

const SC: Record<string,string> = {
  PLACED:'bg-blue-100 text-blue-700 border-blue-200',
  ACCEPTED:'bg-yellow-100 text-yellow-700 border-yellow-200',
  PREPARING:'bg-orange-100 text-orange-700 border-orange-200',
  PICKED:'bg-purple-100 text-purple-700 border-purple-200',
  ON_THE_WAY:'bg-indigo-100 text-indigo-700 border-indigo-200',
  DELIVERED:'bg-green-100 text-green-700 border-green-200',
  CANCELLED:'bg-red-100 text-red-700 border-red-200',
};

const INIT_ORDERS = [
  { id:'DB20240001', customer:'Rohit Sharma',  phone:'9876543210', address:'Sadar Bazar, Satara', items:['Chicken Dum ×2','Extra Raita'], total:628, status:'PREPARING', time:'10:32 AM', payment:'UPI' },
  { id:'DB20240002', customer:'Priya Patel',   phone:'9876543211', address:'Shahupuri, Satara',   items:['Mutton Dum ×1'],               total:399, status:'PLACED',    time:'10:28 AM', payment:'COD' },
  { id:'DB20240003', customer:'Amit Kumar',    phone:'9876543212', address:'Powai Naka, Satara',  items:['Veg Biryani ×2','Gulab Jamun'],total:548, status:'ON_THE_WAY',time:'10:15 AM', payment:'Card'},
  { id:'DB20240004', customer:'Sneha Joshi',   phone:'9876543213', address:'Sangamnagar, Satara', items:['Prawn Biryani ×1','Salan'],    total:489, status:'DELIVERED',  time:'9:50 AM',  payment:'UPI' },
  { id:'DB20240005', customer:'Vikram Singh',  phone:'9876543214', address:'Guruwar Peth, Satara',items:['Hyderabadi Dum ×2'],           total:598, status:'ACCEPTED',   time:'10:05 AM', payment:'UPI' },
];

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState(INIT_ORDERS);
  const [filter,  setFilter]  = useState('ALL');
  const [search,  setSearch]  = useState('');
  const [expanded,setExpanded]= useState<string|null>(null);

  const filtered = orders.filter(o=>{
    if (filter!=='ALL' && o.status!==filter) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
    return true;
  });

  const updateStatus = (id:string, s:string) => {
    setOrders(p=>p.map(o=>o.id===id?{...o,status:s}:o));
    toast.success(`Order ${id.slice(-4)} → ${s.replace('_',' ')}`);
  };

  const exportCSV = () => {
    const rows = ['ID,Customer,Phone,Total,Status,Payment,Time',
      ...orders.map(o=>`${o.id},${o.customer},${o.phone},${o.total},${o.status},${o.payment},${o.time}`)
    ].join('\n');
    const a=document.createElement('a');
    a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(rows);
    a.download='orders.csv'; a.click();
    toast.success('CSV exported!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Manage Orders</h1>
            <p className="text-gray-400 text-sm">{filtered.length} orders</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">
            <Download className="w-4 h-4"/>Export CSV
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200 flex-1">
            <Search className="w-4 h-4 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customer or order ID..." className="bg-transparent text-sm outline-none w-full"/>
          </div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none">
            {ALL_STATUS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.map((o,i)=>(
            <motion.div key={o.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                onClick={()=>setExpanded(expanded===o.id?null:o.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900">{o.customer}</p>
                    <span className="text-xs font-mono text-gray-400">{o.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${SC[o.status]}`}>{o.status.replace('_',' ')}</span>
                    <span className="text-xs text-gray-400">{o.payment}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{o.items.join(' · ')}</p>
                  <p className="text-xs text-gray-400">📍 {o.address} · {o.time} · 📞 {o.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-lg text-gray-900">{formatPrice(o.total)}</p>
                  <div className="flex gap-1.5">
                    {NEXT[o.status] && (
                      <button onClick={e=>{e.stopPropagation();updateStatus(o.id,NEXT[o.status]);}}
                        className="bg-primary-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-primary-600">
                        → {NEXT[o.status].replace('_',' ')}
                      </button>
                    )}
                    {o.status!=='DELIVERED' && o.status!=='CANCELLED' && (
                      <button onClick={e=>{e.stopPropagation();updateStatus(o.id,'CANCELLED');}}
                        className="bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-100">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded===o.id && (
                <motion.div initial={{height:0}} animate={{height:'auto'}} className="border-t border-gray-50 px-4 py-3 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Order Items</p>
                  {o.items.map(it=><p key={it} className="text-sm text-gray-600">· {it}</p>)}
                  <p className="text-sm text-gray-500 mt-2">Total: <strong>{formatPrice(o.total)}</strong> · Payment: {o.payment}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
