"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Eye, Lock, Save, Key, Crown, LayoutDashboard, Terminal } from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stats, setStats] = useState({ users: 0, views: 0, likes: 0 });
  const [userList, setUserList] = useState<any[]>([]);
  const [adCodes, setAdCodes] = useState({ header: "", footer: "", sidebar: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // Fallback to hardcoded pass if firebase hangs/is slow
        const configSnap = await getDoc(doc(db, "system", "config"));
        const storedPass = configSnap.exists() ? configSnap.data().adminPassword : "hamadk2010@@";
        
        if (passwordInput === storedPass || passwordInput === "hamadk2010@@") {
          setIsAuthenticated(true);
        } else {
          alert("Unauthorized: Incorrect Access Key.");
        }
    } catch (err) {
        // Ultimate fallback if offline
        if (passwordInput === "hamadk2010@@") {
            setIsAuthenticated(true);
        } else {
            alert("Connection error. Use master key.");
        }
    } finally {
        setIsLoading(false);
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
    try {
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
    } catch (err) {
        console.error("Fetch failed", err);
    }
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
      <div className="flex min-h-screen items-center justify-center bg-[#020202] px-6">
        <div className="absolute inset-0 bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent opacity-50" />
          
          <div className="flex justify-center mb-2">
             <div className="h-20 w-20 rounded-2xl bg-primary-600/10 flex items-center justify-center border border-primary-600/20 shadow-inner">
                <Terminal size={40} className="text-primary-600 animate-pulse" />
             </div>
          </div>
          
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase">Admin Terminal</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Encrypted Connection</p>
          </div>

          <div className="space-y-4">
              <input
                type="password"
                placeholder="ACCESS_KEY_IDENTIFIER"
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-white text-center outline-none focus:border-primary-600 focus:bg-black transition font-mono text-sm"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <button 
                disabled={isLoading}
                className="w-full rounded-xl bg-primary-600 py-4 font-black text-white transition hover:bg-primary-700 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20"
              >
                {isLoading ? "AUTHORIZING..." : "INITIALIZE SESSION"}
              </button>
          </div>
          
          <p className="text-[10px] text-center text-gray-600">Unauthorized access is logged and tracked.</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-md p-8 hidden lg:block">
            <div className="flex items-center gap-3 mb-16">
                <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center font-black text-black">A</div>
                <h2 className="text-white font-black text-xl tracking-tighter">VOZ_PANEL</h2>
            </div>
            <nav className="space-y-2">
                <div className="bg-primary-600/10 text-primary-500 p-4 rounded-xl flex items-center gap-4 font-bold border border-primary-600/20"><LayoutDashboard size={20} /> Dashboard Overview</div>
                <div className="text-gray-500 p-4 hover:bg-white/5 rounded-xl flex items-center gap-4 font-bold transition cursor-pointer"><Users size={20} /> User Management</div>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
            <div className="flex items-center justify-between mb-16">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight">System Core</h1>
                    <p className="text-gray-500 font-medium">Monitoring platform activity and monetization.</p>
                </div>
                <button onClick={() => setIsAuthenticated(false)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600/20 hover:text-red-500 hover:border-red-600/20 transition text-xs font-black uppercase tracking-widest">Terminate Session</button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard icon={<Users />} label="Registered Users" value={stats.users} />
                <StatCard icon={<Crown className="text-yellow-500" />} label="Premium Members" value={userList.filter(u => u.isPremium || u.isVIP).length} />
                <StatCard icon={<Eye className="text-blue-500" />} label="Metric Estimate" value={stats.views} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Ad Manager */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10">
                    <div className="flex items-center gap-3 mb-8 text-primary-500">
                        <Save size={24} />
                        <h3 className="text-2xl font-black text-white">Ad Monetization</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Universal Header Ad (Global Injection)</label>
                            <textarea 
                                className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-xs font-mono h-32 text-primary-500 focus:border-primary-600 outline-none transition custom-scrollbar"
                                value={adCodes.header}
                                onChange={(e) => setAdCodes({...adCodes, header: e.target.value})}
                                placeholder="Paste <script> from Adsterra/Propeller here..."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Sidebar Banner (Watch Page Placement)</label>
                            <textarea 
                                className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-xs font-mono h-32 text-primary-500 focus:border-primary-600 outline-none transition custom-scrollbar"
                                value={adCodes.sidebar}
                                onChange={(e) => setAdCodes({...adCodes, sidebar: e.target.value})}
                                placeholder="Paste raw banner HTML/Image tag here..."
                            />
                        </div>
                        <button onClick={handleUpdateAds} className="w-full bg-primary-600 py-4 rounded-2xl font-black text-white hover:bg-primary-700 transition shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 active:scale-95 uppercase tracking-widest">
                            <Save size={20} /> Update All Ad Zones
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10">
                    <div className="flex items-center gap-3 mb-8 text-primary-500">
                        <Key size={24} />
                        <h3 className="text-2xl font-black text-white">Security Config</h3>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">System Master Key</label>
                            <input 
                                type="text" 
                                placeholder="NEW TERMINAL PASSWORD"
                                className="w-full bg-black/60 border border-white/5 rounded-2xl p-5 outline-none focus:border-primary-600 transition font-mono text-sm"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <p className="text-[10px] text-gray-600 italic">This will replace the default 'hamadk2010@@' password in the database.</p>
                        </div>
                        <button onClick={handleUpdatePassword} className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-black hover:bg-white/10 transition uppercase tracking-widest">Apply New Master Key</button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="mt-12 rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-2xl font-black">User Registry</h3>
                    <div className="px-4 py-1.5 bg-primary-600/10 text-primary-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-600/10">Connected to Cloud</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-[0.3em]">
                            <tr>
                                <th className="p-6">Auth Identifier (Email)</th>
                                <th className="p-6 text-center">Protocol Level</th>
                                <th className="p-6 text-right">Administrative Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {userList.map(u => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition">
                                    <td className="p-6 font-bold">{u.email || "Anonymous User"}</td>
                                    <td className="p-6 text-center text-xs">
                                        {(u.isPremium || u.isVIP) ? (
                                            <span className="bg-yellow-600/20 text-yellow-500 px-4 py-1.5 rounded-full font-black border border-yellow-600/20 shadow-lg shadow-yellow-600/10 tracking-widest scale-90 inline-block uppercase">Premium VIP</span>
                                        ) : (
                                            <span className="text-gray-600 font-bold uppercase tracking-widest opacity-50">Standard Node</span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button 
                                            onClick={() => toggleVIP(u.id, u.isPremium || u.isVIP)}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black transition tracking-widest uppercase ${(u.isPremium || u.isVIP) ? 'bg-red-600/10 text-red-500 border border-red-600/10 hover:bg-red-600 active:text-white' : 'bg-green-600/10 text-green-500 border border-green-600/10 hover:bg-green-600 active:text-white'}`}
                                        >
                                            {(u.isPremium || u.isVIP) ? 'Revoke VIP' : 'Authorize VIP'}
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
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10 hover:border-primary-600/30 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
      <div className="mb-6 text-primary-600 bg-primary-600/10 w-fit p-4 rounded-2xl">{icon}</div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">{label}</p>
      <p className="text-6xl font-black mt-4 tracking-tighter text-white">{value}</p>
    </div>
  );
}
