"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Eye, Lock, Save, Key, Crown, LayoutDashboard, Terminal, BellPlus, Activity, ShieldAlert, Megaphone, Settings, Film } from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [stats, setStats] = useState({ users: 0, views: 0, likes: 0 });
  const [userList, setUserList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [requestList, setRequestList] = useState<any[]>([]);
  const [globalConfig, setGlobalConfig] = useState({ maintenance: false, alertBanner: "" });

  // Notification form
  const [notif, setNotif] = useState({ title: "", message: "", type: "movie" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const configSnap = await getDoc(doc(db, "system", "config"));
        const storedPass = configSnap.exists() ? configSnap.data().adminPassword : "hamadk2010@@";
        if (passwordInput === storedPass || passwordInput === "hamadk2010@@") {
          setIsAuthenticated(true);
          localStorage.setItem("voz_admin_auth", "true");
        } else {
          alert("Unauthorized Access Key.");
        }
    } catch (err) {
        if (passwordInput === "hamadk2010@@") {
            setIsAuthenticated(true);
            localStorage.setItem("voz_admin_auth", "true");
        }
        else alert("Connection error.");
    } finally {
        setIsLoading(false);
    }
  };

  const handlePostNotification = async () => {
      if (!notif.title || !notif.message) return alert("Fill all fields");
      try {
          await addDoc(collection(db, "notifications"), {
              ...notif,
              date: serverTimestamp()
          });
          alert("Notification Sent Successfully!");
          setNotif({ title: "", message: "", type: "movie" });
      } catch (err) {
          console.error(err);
          alert("فشل إرسال الإشعار. تأكد من قواعد فايربيس.");
      }
  };



  const fetchAllData = async () => {
    try {
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserList(users);

        const statsSnap = await getDoc(doc(db, "system", "stats"));
        const realViews = statsSnap.exists() ? (statsSnap.data().totalViews || 0) : 0;
        const totalVisits = statsSnap.exists() ? (statsSnap.data().totalVisits || 0) : 0;
        
        const requestsSnap = await getDocs(collection(db, "requests"));
        const requests = requestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequestList(requests);
        const requestsCount = requestsSnap.size;
        
        setStats({ users: usersSnap.size, views: totalVisits, likes: realViews });

        // Fetch Global Config
        const configSnap = await getDoc(doc(db, "system", "config"));
        if (configSnap.exists()) {
            setGlobalConfig({
                maintenance: configSnap.data().maintenance || false,
                alertBanner: configSnap.data().alertBanner || ""
            });
        }
    } catch (err: any) {
        console.error("Firebase Admin Error:", err);
        alert("فشل جلب البيانات. الرجاء التأكد من تحديث قواعد حماية فايربيس (Firestore Rules) إلى Test Mode لكي تعمل لوحة التحكم.");
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("voz_admin_auth") === "true";
    if (isAuth) {
        setIsAuthenticated(true);
    } else {
        setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
        fetchAllData();
        // Live listener for active rooms
        const qRooms = query(collection(db, "rooms"), orderBy("createdAt", "desc"), limit(10));
        const unsubRooms = onSnapshot(qRooms, (snapshot) => {
            setActiveRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubRooms();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("voz_admin_auth");
    setIsAuthenticated(false);
  };

  const updateGlobalConfig = async (key: string, value: any) => {
    try {
        await setDoc(doc(db, "system", "config"), { [key]: value }, { merge: true });
        setGlobalConfig(prev => ({ ...prev, [key]: value }));
        alert(`${key} updated successfully.`);
    } catch (e) {
        alert("Failed to update system config.");
    }
  };

  const toggleVIP = async (userId: string, currentStatus: boolean) => {
    try {
        await updateDoc(doc(db, "users", userId), { isVIP: !currentStatus, isPremium: !currentStatus });
        fetchAllData();
    } catch (e) {
        alert("فشل تغيير حالة المستخدم. الركاء التأكد من قواعد فايربيس.");
    }
  };

  const deleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this room?")) return;
    try {
        await deleteDoc(doc(db, "rooms", roomId)); 
        alert("Room deleted permanently.");
        fetchAllData();
    } catch (e) {
        console.error(e);
        alert("Action failed. Check Firebase permissions.");
    }
  };

  if (isAuthenticated === null) return <div className="min-h-screen bg-black" />;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202] px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10">
          <div className="flex justify-center"><div className="h-20 w-20 rounded-2xl bg-primary-600/10 flex items-center justify-center border border-primary-600/20"><Terminal size={40} className="text-primary-600 animate-pulse" /></div></div>
          <h2 className="text-center text-2xl font-black text-white tracking-widest uppercase">Admin Terminal</h2>
          <input type="password" placeholder="ACCESS_KEY" className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-white text-center outline-none focus:border-primary-600 transition" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          <button className="w-full rounded-xl bg-primary-600 py-4 font-black text-white transition hover:bg-primary-700">{isLoading ? "AUTHORIZING..." : "LOGIN"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-md p-8 hidden lg:block">
            <h2 className="text-white font-black text-xl mb-16 tracking-tighter">VOZ_PANEL</h2>
            <nav className="space-y-4">
                <div className="bg-primary-600/10 text-primary-500 p-4 rounded-xl flex items-center gap-4 font-bold border border-primary-600/20"><LayoutDashboard size={20} /> Dashboard</div>
            </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-black tracking-tight">System Core</h1>
                <button onClick={handleLogout} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-red-600/20 hover:text-red-500 transition text-[10px] font-black uppercase">Logout</button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <StatCard icon={<Users />} label="Lifetime Users" value={stats.users} />
                <StatCard icon={<Eye className="text-blue-500" />} label="Live Traffic" value={stats.views} />
                <StatCard icon={<Terminal className="text-green-500" />} label="Total Playbacks" value={stats.likes} />
                <StatCard icon={<Crown className="text-yellow-500" />} label="Active Rooms" value={activeRooms.length} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Global Controls */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10">
                    <div className="flex items-center gap-3 mb-8 text-primary-500">
                        <Settings size={24} />
                        <h3 className="text-2xl font-black text-white">Platform Settings</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                            <div>
                                <p className="font-bold text-sm">Maintenance Mode</p>
                                <p className="text-[10px] text-gray-500">Block all access except admins</p>
                            </div>
                            <button 
                                onClick={() => updateGlobalConfig('maintenance', !globalConfig.maintenance)}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition ${globalConfig.maintenance ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'}`}
                            >
                                {globalConfig.maintenance ? 'ACTIVE' : 'OFF'}
                            </button>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Global Alert Banner (Pushes to all users)</label>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-black/40 border border-white/5 rounded-xl p-4 text-sm"
                                    value={globalConfig.alertBanner}
                                    onChange={(e) => setGlobalConfig({...globalConfig, alertBanner: e.target.value})}
                                    placeholder="Server maintenance tonight at 12 PM..."
                                />
                                <button 
                                    onClick={() => updateGlobalConfig('alertBanner', globalConfig.alertBanner)}
                                    className="bg-primary-600 px-6 rounded-xl hover:bg-primary-500 transition"
                                >
                                    <Save size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Requests Viewer */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 text-primary-500">
                            <Film size={24} />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Content Requests</h3>
                        </div>
                        <button onClick={fetchAllData} className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black hover:bg-white/10 transition">REFRESH QUEUE</button>
                    </div>
                    <div className="overflow-x-auto h-[300px] custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-[0.3em]">
                                <tr><th className="p-4">Movie Name</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {requestList.map((r: any) => (
                                    <tr key={r.id}>
                                        <td className="p-4 font-bold text-white">{r.movieName}</td>
                                        <td className="p-4 text-yellow-500 uppercase text-[10px] font-black">{r.status || "PENDING"}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => deleteDoc(doc(db, "requests", r.id)).then(fetchAllData)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">Terminate</button>
                                        </td>
                                    </tr>
                                ))}
                                {requestList.length === 0 && <tr><td colSpan={3} className="p-10 text-center text-gray-600">No requests in queue.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notification Broadcaster */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10">
                    <div className="flex items-center gap-3 mb-8 text-primary-500">
                        <Megaphone size={24} />
                        <h3 className="text-2xl font-black text-white">Broadcast Update</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Update Title (e.g. New Movie Added)</label>
                            <input 
                                className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm"
                                value={notif.title}
                                onChange={(e) => setNotif({...notif, title: e.target.value})}
                                placeholder="Avatar: The Way of Water"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Content Highlight / Alert Message</label>
                            <textarea 
                                className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm h-24"
                                value={notif.message}
                                onChange={(e) => setNotif({...notif, message: e.target.value})}
                                placeholder="Enjoy the latest release now on Vox..."
                            />
                        </div>
                        <div className="flex gap-4">
                            {['movie', 'tv', 'system'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setNotif({...notif, type: t as any})}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase border transition ${notif.type === t ? 'bg-primary-600 border-primary-600 text-black' : 'border-white/10 text-gray-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <button onClick={handlePostNotification} className="w-full bg-primary-600 py-4 rounded-2xl font-black text-black hover:bg-primary-700 transition uppercase tracking-widest flex items-center justify-center gap-2">
                             <BellPlus size={18} /> Send Notification
                        </button>
                    </div>
                </div>


            </div>

            {/* Active Rooms Table */}
            <div className="mt-12 rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity className="text-green-500" size={24} />
                        <h3 className="text-2xl font-black">Live Inventory (Rooms)</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-[0.3em]">
                            <tr><th className="p-6">Room Name</th><th className="p-6">Host</th><th className="p-6">Content ID</th><th className="p-6 text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activeRooms.map(r => (
                                <tr key={r.id}>
                                    <td className="p-6 font-bold text-primary-500">{r.name}</td>
                                    <td className="p-6">{r.hostName}</td>
                                    <td className="p-6 text-gray-400">{r.currentMovie?.id} ({r.currentType})</td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => deleteRoom(r.id)} className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition">Terminate</button>
                                    </td>
                                </tr>
                            ))}
                            {activeRooms.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-600 font-bold uppercase tracking-widest italic">No active parties found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Users Table */}
            <div className="mt-12 rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-2xl font-black">User Registry</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-[0.3em]">
                            <tr><th className="p-6">User Email</th><th className="p-6 text-center">Status</th><th className="p-6 text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {userList.map(u => (
                                <tr key={u.id}>
                                    <td className="p-6 font-bold">{u.email}</td>
                                    <td className="p-6 text-center">{(u.isPremium || u.isVIP) ? <span className="text-yellow-500 font-black">VIP</span> : 'Standard'}</td>
                                    <td className="p-6 text-right"><button onClick={() => toggleVIP(u.id, u.isPremium || u.isVIP)} className={`px-4 py-2 rounded-lg text-[10px] font-black ${(u.isPremium || u.isVIP) ? 'text-red-500' : 'text-green-500'}`}>Toggle VIP</button></td>
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
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-10 group">
      <div className="mb-4 text-primary-600 bg-primary-600/10 w-fit p-4 rounded-2xl">{icon}</div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      <p className="text-5xl font-black mt-2 text-white">{value}</p>
    </div>
  );
}
