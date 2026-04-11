"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Users, Lock, Plus, MessageSquare, Play, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return signInWithGoogle();
    if (!newRoom.name) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "rooms"), {
        ...newRoom,
        hostId: user.uid,
        hostName: user.displayName,
        createdAt: serverTimestamp(),
        activeUsers: 1,
        currentMovie: { id: "1049471" }, // Default movie
        currentType: "movie"
      });
      router.push(`/rooms/${docRef.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Navbar />

      <div className="pt-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase mb-4">Watch Party 🍿</h1>
                <p className="text-gray-500 font-medium">Create a private room, invite friends, and watch together in real-time.</p>
            </div>
            <button 
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center justify-center gap-3 bg-primary-600 px-8 py-4 rounded-2xl font-black uppercase text-sm hover:bg-primary-500 transition shadow-2xl shadow-primary-600/20"
            >
                <Plus size={20} /> Create New Room
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {rooms.map((room) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={room.id}
                        className="group relative rounded-[32px] border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.05] transition-all overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            {room.password ? <Lock size={16} className="text-yellow-600" /> : <div className="h-2 w-2 rounded-full bg-green-500" />}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-600 border border-primary-600/20">
                                <Users size={28} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl uppercase tracking-tight truncate max-w-[150px]">{room.name}</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Host: {room.hostName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mb-8 text-xs font-bold text-gray-400">
                            <div className="flex items-center gap-2"><MessageSquare size={14} /> Global Chat</div>
                            <div className="flex items-center gap-2"><Play size={14} /> Full Sync</div>
                        </div>

                        <Link href={`/rooms/${room.id}`}>
                            <button className="w-full py-4 rounded-xl border border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest hover:bg-primary-600 hover:text-white transition">
                                Join Party
                            </button>
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>

      {/* CREATE ROOM MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg rounded-[40px] border border-white/10 bg-black p-10 shadow-2xl">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 text-center text-primary-600">Start a Party</h2>
                    <form onSubmit={handleCreateRoom} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest px-2">Room Name</label>
                            <input 
                                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-primary-600 transition"
                                placeholder="Hamad's Cinema..."
                                value={newRoom.name}
                                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest px-2">Privacy Password (Optional)</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                <input 
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 pl-12 outline-none focus:border-yellow-600 transition"
                                    placeholder="Enter pin..."
                                    type="password"
                                    value={newRoom.password}
                                    onChange={(e) => setNewRoom({...newRoom, password: e.target.value})}
                                />
                            </div>
                        </div>
                        <button disabled={loading} className="w-full bg-primary-600 py-5 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-primary-500 transition shadow-xl">
                            {loading ? "CREATING..." : "GENERATE PARTY ROOM"}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </main>
  );
}
