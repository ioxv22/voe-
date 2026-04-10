"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Eye, Heart, ShieldAlert, Lock, Save, Key, Crown, Check, X } from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stats, setStats] = useState({ users: 0, views: 0, likes: 0 });
  const [userList, setUserList] = useState<any[]>([]);

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

  const fetchAllData = async () => {
    const usersSnap = await getDocs(collection(db, "users"));
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUserList(users);
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
    fetchAllData(); // Refresh list
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
                <div className="text-gray-500 p-3 hover:text-white transition flex items-center gap-3 cursor-pointer"><Crown size={20} /> VIP Members</div>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-3xl font-black">System Overview</h1>
                <button onClick={() => setIsAuthenticated(false)} className="px-6 py-2 bg-red-600/10 text-red-600 border border-red-600/20 rounded-md hover:bg-red-600/20 transition text-xs font-bold">DISCONNECT</button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard icon={<Users />} label="Total Users" value={stats.users} />
                <StatCard icon={<Crown className="text-yellow-500" />} label="VIP Members" value={userList.filter(u => u.isPremium || u.isVIP).length} />
                <StatCard icon={<Eye />} label="Total Views" value={stats.views} />
            </div>

            {/* Users Table */}
            <div className="mt-12 rounded-xl border border-white/10 bg-[#0b0b0b] overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Manage Users</h3>
                    <p className="text-xs text-gray-500 font-mono">FIRESTORE_RECORDS: {userList.length}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="p-4">User Email</th>
                                <th className="p-4 text-center">VIP Status</th>
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
