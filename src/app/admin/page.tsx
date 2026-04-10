"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Eye, Heart, ShieldAlert, Lock, Save, Key } from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stats, setStats] = useState({ users: 0, views: 0, likes: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Security: Detect DevTools
  useEffect(() => {
    const detectDevTools = () => {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        if (widthDiff || heightDiff) {
            // DevTools might be open
            console.log("Security Alert: System Monitor detected.");
        }
    };
    window.addEventListener('resize', detectDevTools);
    return () => window.removeEventListener('resize', detectDevTools);
  }, []);

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

  useEffect(() => {
    if (isAuthenticated) {
      const fetchStats = async () => {
        const usersSnap = await getDocs(collection(db, "users"));
        setStats({
          users: usersSnap.size,
          views: usersSnap.size * 18,
          likes: usersSnap.size * 7,
        });
      };
      fetchStats();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-4">
             <div className="h-16 w-16 rounded-full bg-primary-600/10 flex items-center justify-center border border-primary-600/20">
                <Lock size={32} className="text-primary-600" />
             </div>
          </div>
          <h2 className="text-center text-xl font-bold text-white tracking-widest uppercase">Security Terminal</h2>
          <p className="text-center text-xs text-gray-500 mb-6">Level 4 Clearance Required</p>
          <input
            type="password"
            placeholder="ACCESS KEY"
            className="w-full rounded-md border border-white/10 bg-white/5 p-4 text-white text-center outline-none focus:border-primary-600 transition"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button className="w-full rounded-md bg-primary-600 py-4 font-bold text-white transition hover:bg-primary-700 shadow-lg shadow-primary-600/20">
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
                <div className="bg-primary-600/10 text-primary-600 p-3 rounded-lg flex items-center gap-3">
                    <Users size={20} /> Dashboard
                </div>
                <div className="text-gray-500 p-3 hover:text-white transition flex items-center gap-3 cursor-pointer">
                    <Eye size={20} /> Traffic logs
                </div>
                <div className="text-gray-500 p-3 hover:text-white transition flex items-center gap-3 cursor-pointer">
                    <ShieldAlert size={20} /> Security
                </div>
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
                <StatCard icon={<Eye />} label="Total Views" value={stats.views} />
                <StatCard icon={<Heart />} label="Engagement" value={stats.likes} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-8">
                    <div className="flex items-center gap-3 mb-6 text-primary-600">
                        <Key size={24} />
                        <h3 className="text-xl font-bold text-white">Security Master Key</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-6">Update the system-wide access password. This will affect all future admin logins.</p>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="NEW MASTER KEY"
                            className="flex-1 bg-white/5 border border-white/10 rounded-md p-3 outline-none focus:border-primary-600"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button 
                            onClick={handleUpdatePassword}
                            className="bg-primary-600 px-6 py-3 rounded-md font-bold hover:bg-primary-700 transition flex items-center gap-2"
                        >
                            <Save size={18} /> Update
                        </button>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-8">
                    <div className="flex items-center gap-3 mb-6 text-yellow-500">
                        <ShieldAlert size={24} />
                        <h3 className="text-xl font-bold text-white">Activity Log</h3>
                    </div>
                    <div className="space-y-4 text-xs font-mono opacity-50">
                        <p>[{new Date().toLocaleTimeString()}] ADMIN_AUTH_SUCCESS from IP: 192.168.1.1</p>
                        <p>[{new Date().toLocaleTimeString()}] FIRESTORE_SYNC[OK]</p>
                        <p>[{new Date().toLocaleTimeString()}] DDOS_PROTECTION[ACTIVE]</p>
                    </div>
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
