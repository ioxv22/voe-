"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trophy, Activity, Play, Calendar, Timer, Tv } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function MatchesPage() {
    const [matches, setMatches] = useState<any[]>([
        { id: "m1", title: "Atletico Madrid vs Barcelona", time: "23:00", url: "https://v3.v-it.org/hls/101.m3u8", team1: "Atlético", team2: "Barcelona" },
        { id: "m2", title: "Liverpool vs Paris Saint-Germain", time: "23:00", url: "https://v3.v-it.org/hls/102.m3u8", team1: "Liverpool", team2: "PSG" },
        { id: "m3", title: "Al Nassr vs Al Khaleej", time: "21:00", url: "https://v3.v-it.org/hls/103.m3u8", team1: "Al Nassr", team2: "Al Khaleej" },
        { id: "m4", title: "Al Ittihad vs Zed FC", time: "22:00", url: "https://v3.v-it.org/hls/104.m3u8", team1: "Al Ittihad", team2: "Zed FC" }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "matches"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            if (snap.docs.length > 0) {
                setMatches(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        });
        return () => unsub();
    }, []);

    return (
        <main className="min-h-screen bg-[#020202] text-white selection:bg-green-600">
            <Navbar />

            <div className="pt-32 px-4 lg:px-12 pb-20">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                        <div>
                            <div className="flex items-center gap-3 text-green-500 mb-4">
                                <Trophy size={32} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Sports Protocol</span>
                            </div>
                            <h1 className="text-6xl font-black italic uppercase tracking-tighter">Match Center</h1>
                            <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Real-time stats and broadcast nodes from YallaKora Sync</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Servers Active</span>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white/[0.02] rounded-[40px] animate-pulse" />)}
                        </div>
                    ) : matches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {matches.map((match, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={match.id}
                                    className="group relative bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[40px] p-10 hover:border-green-500/30 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Abstract background shape */}
                                    <div className="absolute -top-10 -right-10 h-40 w-40 bg-green-600/5 blur-[80px] rounded-full group-hover:bg-green-600/10 transition-all duration-700" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-600/30">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                                                <span className="text-[9px] font-black text-red-500 uppercase">Live Now</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Timer size={14} />
                                                <span className="text-[10px] font-bold uppercase">{match.time}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-8 mb-10">
                                            <div className="flex-1 text-center space-y-3">
                                                <div className="h-20 w-20 mx-auto bg-black rounded-3xl border border-white/5 flex items-center justify-center shadow-2xl">
                                                    <Tv size={32} className="text-gray-700" />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-tight">{match.team1 || match.title.split('vs')[0]}</p>
                                            </div>
                                            <div className="text-2xl font-black italic text-gray-700">VS</div>
                                            <div className="flex-1 text-center space-y-3">
                                                <div className="h-20 w-20 mx-auto bg-black rounded-3xl border border-white/5 flex items-center justify-center shadow-2xl">
                                                    <Tv size={32} className="text-gray-700" />
                                                </div>
                                                <p className="text-sm font-black uppercase tracking-tight">{match.team2 || match.title.split('vs')[1]}</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                localStorage.setItem('voz_live_tab', 'sports');
                                                localStorage.setItem('voz_target_match_url', match.url);
                                                window.location.href = `/live`;
                                            }}
                                            className="w-full bg-green-600 py-5 rounded-[24px] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-green-600/20 hover:bg-green-500 transition-all transform active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <Play size={16} fill="currentColor" /> Enter Broadcast Channel
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
                            <Calendar size={64} className="mx-auto text-gray-800 mb-6" />
                            <h2 className="text-2xl font-black uppercase italic text-gray-600">No Matches Scheduled</h2>
                            <p className="text-gray-700 text-xs font-bold mt-2 uppercase tracking-widest">Check back during kick-off times</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
