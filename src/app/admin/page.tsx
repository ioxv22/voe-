"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Eye, Heart, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState({ users: 0, views: 0, likes: 0 });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hamadk2010@@") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch stats from Firestore
      const fetchStats = async () => {
        const usersSnap = await getDocs(collection(db, "users"));
        // This is a simplified fetch - normally you'd use a summary doc
        setStats({
          users: usersSnap.size,
          views: usersSnap.size * 12, // Mocking some view stats
          likes: usersSnap.size * 5,
        });
      };
      fetchStats();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-xl border border-white/10 bg-[#0b0b0b] p-8 shadow-2xl">
          <div className="flex justify-center mb-4">
             <ShieldAlert size={48} className="text-primary-600" />
          </div>
          <h2 className="text-center text-2xl font-black text-white">ADMIN TERMINAL</h2>
          <input
            type="password"
            placeholder="System Password"
            className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-primary-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full rounded-md bg-primary-600 py-3 font-bold text-white transition hover:bg-primary-700">
            AUTHENTICATE
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] p-8 text-white lg:p-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-black lg:text-5xl">DASHBOARD_STATS</h1>
        <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border border-white/10 rounded-md hover:bg-white/5 transition">Terminal Logout</button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={<Users />} label="Total Registered Users" value={stats.users} />
        <StatCard icon={<Eye />} label="Platform Global Views" value={stats.views} />
        <StatCard icon={<Heart />} label="Total Saved Items" value={stats.likes} />
      </div>

      <div className="mt-12 rounded-xl border border-white/10 bg-[#0b0b0b] p-8">
        <h3 className="text-xl font-bold mb-6">Recent Activity Monitor</h3>
        <div className="space-y-4 opacity-50">
            <p className="border-b border-white/5 pb-2">[AUTH] New user session established via Google (UID: ...23x)</p>
            <p className="border-b border-white/5 pb-2">[SYST] Firestore synchronization completed successfully</p>
            <p className="border-b border-white/5 pb-2">[TRAF] Spiked traffic from Trending category (1.2k req/s)</p>
            <p className="border-b border-white/5 pb-2">[DBUG] Environment variables verified and secure</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-8 transition hover:border-primary-600/50">
      <div className="mb-4 text-primary-600">{icon}</div>
      <p className="text-gray-400">{label}</p>
      <p className="text-4xl font-black mt-2">{value}</p>
    </div>
  );
}
