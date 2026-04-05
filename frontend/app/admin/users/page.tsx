'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserX, UserCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const INIT_USERS = [
  { id:'u1', name:'Rohit Sharma',  email:'rohit@gmail.com',  phone:'9876543210', orders:12, spent:4820, joined:'Jan 2024', blocked:false },
  { id:'u2', name:'Priya Patel',   email:'priya@gmail.com',  phone:'9876543211', orders:8,  spent:2990, joined:'Feb 2024', blocked:false },
  { id:'u3', name:'Amit Kumar',    email:'amit@gmail.com',   phone:'9876543212', orders:3,  spent:990,  joined:'Mar 2024', blocked:false },
  { id:'u4', name:'Sneha Joshi',   email:'sneha@gmail.com',  phone:'9876543213', orders:21, spent:8450, joined:'Dec 2023', blocked:false },
  { id:'u5', name:'Vikram Singh',  email:'vikram@gmail.com', phone:'9876543214', orders:5,  spent:1980, joined:'Apr 2024', blocked:true  },
];

export default function AdminUsersPage() {
  const [users,  setUsers]  = useState(INIT_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));
  const toggleBlock = (id:string) => {
    setUsers(p=>p.map(u=>u.id===id?{...u,blocked:!u.blocked}:u));
    const u = users.find(u=>u.id===id)!;
    toast.success(`User ${u.blocked?'unblocked':'blocked'}: ${u.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">Manage Users</h1>
          <p className="text-gray-400 text-sm">{users.length} total · {users.filter(u=>u.blocked).length} blocked</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-200 mb-6 max-w-sm shadow-sm">
          <Search className="w-4 h-4 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..." className="bg-transparent text-sm outline-none w-full"/>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['User','Contact','Orders','Spent','Joined','Status','Action'].map(h=>(
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u,i)=>(
                <motion.tr key={u.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-sm text-gray-800">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">{u.phone}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 font-semibold">{u.orders}</td>
                  <td className="px-4 py-4 text-sm text-primary-600 font-bold">₹{u.spent}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{u.joined}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${u.blocked?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>
                      {u.blocked?'Blocked':'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={()=>toggleBlock(u.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${u.blocked?'bg-green-50 text-green-600 hover:bg-green-100':'bg-red-50 text-red-500 hover:bg-red-100'}`}>
                      {u.blocked?<><UserCheck className="w-3.5 h-3.5"/>Unblock</>:<><UserX className="w-3.5 h-3.5"/>Block</>}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
