"use client";

import { useState, useEffect } from "react";
import { Users, Activity } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LiveCounter() {
    const [count, setCount] = useState(12840);
    const [totalVisits, setTotalVisits] = useState(0);
    const [isIncreasing, setIsIncreasing] = useState(true);

    useEffect(() => {
        // Fetch Real Stats from Firestore
        const unsub = onSnapshot(doc(db, "system", "stats"), (snap) => {
            if (snap.exists()) {
                setTotalVisits(snap.data().totalVisits || 0);
            }
        });

        // Fake "Live Users" Animation
        const interval = setInterval(() => {
            setCount(prev => {
                const change = Math.floor(Math.random() * 3) + 1; // Increase by 1-3
                const shouldDrop = Math.random() > 0.8; // 20% chance to drop slightly
                
                if (shouldDrop && prev > 10000) {
                    setIsIncreasing(false);
                    return prev - 1;
                }
                
                setIsIncreasing(true);
                return prev + change;
            });
        }, 3000); // Update every 3 seconds

        return () => {
            unsub();
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                            Live Active Nodes
                        </p>
                        <h4 className="text-4xl font-black italic tracking-tighter tabular-nums">
                            {count.toLocaleString()}
                        </h4>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isIncreasing ? 'bg-green-600/10 text-green-500' : 'bg-yellow-600/10 text-yellow-500'}`}>
                        <Activity size={24} className={isIncreasing ? 'animate-pulse' : ''} />
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        Real-Time Traffic
                    </div>
                    <div className="text-[10px] font-bold text-white/40">
                        {isIncreasing ? "+2.4% Surge" : "Stabilizing"}
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            Lifetime Global Users
                        </p>
                        <h4 className="text-3xl font-black italic tracking-tighter text-white/90">
                            {(totalVisits + 45000).toLocaleString()}
                        </h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Users size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
}
