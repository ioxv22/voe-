"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trophy, Activity, ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default function MatchSchedule() {
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, "matches"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setMatches(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, []);

    if (matches.length === 0) return null;

    return (
        <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-green-600 p-3 rounded-2xl text-white shadow-lg shadow-green-600/20">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Live Matches</h2>
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Neural Live Broadcast Schedule</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map(match => (
                    <div 
                        key={match.id}
                        className="group relative overflow-hidden bg-white/[0.02] border border-white/5 rounded-[32px] p-6 hover:bg-white/5 transition duration-500"
                    >
                        {/* Live Indicator */}
                        <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-600/10 px-3 py-1 rounded-full border border-red-600/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                            <span className="text-[10px] font-black text-red-500 uppercase">Live</span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <p className="text-lg font-black italic uppercase tracking-tight truncate max-w-[200px]">{match.title}</p>
                            </div>

                            <div className="flex items-center justify-between text-gray-500 font-bold uppercase text-[10px]">
                                <span className="flex items-center gap-2"><Activity size={12} className="text-green-500" /> Start: {match.time}</span>
                                <span>Premium HLS Node</span>
                            </div>

                            <button 
                                onClick={() => {
                                    localStorage.setItem('voz_live_tab', 'sports');
                                    // We'll store the URL momentarily to auto-select in Live Page
                                    localStorage.setItem('voz_target_match_url', match.url);
                                    window.location.href = `/live`;
                                }}
                                className="w-full bg-white/5 border border-white/10 group-hover:bg-green-600 group-hover:text-black group-hover:border-green-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Play size={14} fill="currentColor" /> Watch Live Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
