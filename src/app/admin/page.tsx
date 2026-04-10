"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Eye, Lock, Save, Key, Crown, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stats, setStats] = useState({ users: 0, views: 0, likes: 0 });
  const [userList, setUserList] = useState<any[]>([]);
  const [adCodes, setAdCodes] = useState({ header: "", footer: "", sidebar: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const configSnap = await getDoc(doc(db, "system", "config"));
    const storedPass = configSnap.exists() ? configSnap.data().adminPassword : "hamadk2010@@";
    
    if (passwordInput === storedPass) {
      setIsAuthenticated(true);
    } else {
      alert("Unauthorized Access Denied.");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) return alert("Password too short");
    await setDoc(doc(db, "system", "config"), { adminPassword: newPassword }, { merge: true });
    alert("System Master Password Updated.");
    setNewPassword("");
  };

  const handleUpdateAds = async () => {
    await setDoc(doc(db, "system", "ads"), adCodes, { merge: true });
    alert("Ad scripts updated globally.");
  };

  const fetchAllData = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserList(users);
    
    const adsSnap = await getDoc(doc(db, "system", "ads"));
    if (adsSnap.exists()) setAdCodes(adsSnap.data() as any);
    
    setStats({
      users: usersSnap.size,
      views: usersSnap.size * 18,
      likes: usersSnap.size * 7,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
        fetchAllData();
    }
  }, [isAuthenticated]);

  const toggleVIP = async (userId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "users", userId), { 
        isVIP: !currentStatus,
        isPremium: !currentStatus 
    });
    fetchAllData();
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8">
          <div className="flex justify-center mb-4">
             <div className="h-16 w-16 rounded-full bg-primary-600/10 flex items-center justify-center border border-primary-600/20">
                <Lock size={32} className="text-primary-600" />
             </div>
          </div>
          <h2 className="text-center text-xl font-bold text-white tracking-widest uppercase">Security Terminal</h2>
          <input
            type="password"
            placeholder="ACCESS KEY"
            className="w-full rounded-md border border-white/10 bg-white/5 p-4 text-white text-center outline-none focus:border-primary-600 transition"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button className="w-full rounded-md bg-primary-600 py-4 font-bold text-white transition hover:bg-primary-700">
            LOGIN
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 bg-[#0a0a0a] p-6 hidden lg:block">
            <h2 className="text-primary-600 font-black text-xl mb-12">VOZ_ADMIN</h2>
            <nav className="space-y-4">
                <div className="bg-primary-600/10 text-primary-600 p-3 rounded-lg flex items-center gap-3"><Users size={20} /> Dashboard</div>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-3xl font-black">Admin Protocol</h1>
                <button onClick={() => setIsAuthenticated(false)} className="px-6 py-2 bg-red-600/10 text-red-600 border border-red-600/20 rounded-md hover:bg-red-600/20 transition text-xs font-bold font-mono">DISCONNECT</button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard icon={<Users />} label="Total Users" value={stats.users} />
                <StatCard icon={<Crown className="text-yellow-500" />} label="VIP Members" value={userList.filter(u => u.isPremium || u.isVIP).length} />
                <StatCard icon={<Eye />} label="Total Views" value={stats.views} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Ad Manager */}
                <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-8">
                    <div className="flex items-center gap-3 mb-6 text-primary-600">
                        <LayoutDashboard size={24} />
                        <h3 className="text-xl font-bold text-white">Ad Monetization</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-gray-500 block mb-2 font-mono uppercase tracking-widest">Global Header Ads (Adsterra/Propeller)</label>
                            <textarea 
                                className="w-full bg-black/40 border border-white/5 rounded-md p-3 text-xs font-mono h-24 text-primary-600/80 focus:border-primary-600 outline-none transition"
                                value={adCodes.header}
                                onChange={(e) => setAdCodes({...adCodes, header: e.target.value})}
                                placeholder="Paste <script> here..."
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-2 font-mono uppercase tracking-widest">Sidebar Ad (Watch Page)</label>
                            <textarea 
                                className="w-full bg-black/40 border border-white/5 rounded-md p-3 text-xs font-mono h-24 text-primary-600/80 focus:border-primary-600 outline-none transition"
                                value={adCodes.sidebar}
                                onChange={(e) => setAdCodes({...adCodes, sidebar: e.target.value})}
                                placeholder="Paste banner HTML here..."
                            />
                        </div>
                        <button onClick={handleUpdateAds} className="w-full bg-primary-600 py-3 rounded-md font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2">
                            <Save size={18} /> DEPLOY AD SCRIPTS
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-8">
                    <div className="flex items-center gap-3 mb-6 text-primary-600">
                        <Key size={24} />
                        <h3 className="text-xl font-bold text-white">Terminal Config</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-gray-500 block mb-2 font-mono uppercase">Master Password</label>
                            <input 
                                type="text" 
                                placeholder="NEW MASTER KEY"
                                className="w-full bg-black/40 border border-white/5 rounded-md p-4 outline-none focus:border-primary-600 transition"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={handleUpdatePassword} className="w-full bg-white/5 border border-white/10 py-3 rounded-md font-bold hover:bg-white/10 transition">UPDATE KEY</button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="mt-12 rounded-xl border border-white/10 bg-[#0b0b0b] overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold">User Registry</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="p-4">User Email</th>
                                <th className="p-4 text-center">Premium Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {userList.map(u => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition">
                                    <td className="p-4 font-medium">{u.email}</td>
                                    <td className="p-4 text-center">
                                        {(u.isPremium || u.isVIP) ? (
                                            <span className="bg-yellow-600/20 text-yellow-600 px-3 py-1 rounded-full text-[10px] font-bold border border-yellow-600/20">VIP ACTIVE</span>
                                        ) : (
                                            <span className="text-gray-600 text-[10px] font-bold">Standard</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => toggleVIP(u.id, u.isPremium || u.isVIP)}
                                            className={`px-4 py-1.5 rounded-md text-[10px] font-black transition ${(u.isPremium || u.isVIP) ? 'bg-red-600/10 text-red-600 border border-red-600/20 hover:bg-red-600/20' : 'bg-green-600/10 text-green-600 border border-green-600/20 hover:bg-green-600/20'}`}
                                        >
                                            {(u.isPremium || u.isVIP) ? 'REVOKE VIP' : 'MAKE VIP'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-8 hover:border-primary-600/30 transition shadow-lg cursor-default">
      <div className="mb-4 text-primary-600">{icon}</div>
      <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{label}</p>
      <p className="text-5xl font-black mt-2">{value}</p>
    </div>
  );
}
