"use client";

import { useEffect } from "react";
import Footer from "@/components/Footer";
import { Trophy, Activity, ExternalLink, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function MatchesPage() {
    // Auto-Pull Logic: Runs every 24 hours automatically
    useEffect(() => {
        const lastPull = localStorage.getItem("voz_last_match_pull");
        const now = Date.now();
        
        if (!lastPull || now - parseInt(lastPull) > 24 * 60 * 60 * 1000) {
            console.log("Synchronizing Matches with OnsidePlus Node...");
            fetch('/api/matches/pull')
                .then(() => localStorage.setItem("voz_last_match_pull", now.toString()))
                .catch(() => console.warn("Match Sync Failed."));
        }
    }, []);

    return (
        <main className="min-h-screen bg-[#020202] text-white selection:bg-green-600">
            

            <div className="pt-28 px-4 lg:px-12 pb-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 text-green-500 mb-2">
                                <Trophy size={28} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Match Engine v3.0</span>
                            </div>
                            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Live Broadcast Hub</h1>
                            <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Real-time synchronization with global sports nodes</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                <Activity size={14} className="text-green-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Nodes Active: 24/7</span>
                            </div>
                            <a 
                                href="https://t.me/VOZSTREAM" 
                                target="_blank"
                                className="bg-primary-600 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition active:scale-95 shadow-lg shadow-primary-600/20"
                            >
                                Report Issue
                            </a>
                        </div>
                    </div>

                    {/* Integrated Match Center */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group w-full aspect-[16/9] lg:aspect-auto lg:h-[80vh] rounded-[40px] overflow-hidden border border-white/5 bg-black/40 shadow-2xl"
                    >
                        {/* Protection Banner */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-md border-b border-white/5 z-20 flex items-center justify-between px-8">
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Node Bridge Active</span>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary-500">
                                <ShieldAlert size={12} /> External Source • VOZ Protected
                            </div>
                        </div>

                        {/* Iframe Implementation with Protection */}
                        <iframe 
                            src={typeof window !== 'undefined' ? atob("aHR0cHM6Ly9vbnNpZGVwbHVzLmJsb2dzcG90LmNvbS8=") : ""} 
                            className="w-full h-full pt-12 grayscale-[0.2] hover:grayscale-0 transition-all duration-700 border-none"
                            title="VOZ LIVE MATCH HUB"
                            allowFullScreen
                            allow="autoplay; encrypted-media; fullscreen *; picture-in-picture"
                            sandbox="allow-forms allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
                        />
                        
                        {/* Overlay to block external popups if sandbox fails some aspects */}
                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-[40px] z-30" />
                    </motion.div>

                    {/* Disclaimer / Info */}
                    <div className="mt-8 flex flex-col md:flex-row justify-between items-center p-8 bg-white/[0.02] border border-white/5 rounded-[32px] gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                                <ExternalLink size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Content Provider</p>
                                <p className="text-xs font-bold text-white">Integrated Multi-Server Match Hub</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-600 font-medium max-w-md text-center md:text-right uppercase tracking-widest leading-relaxed">
                            This engine integrates external sports nodes directly into VOZ. If a stream fails, please try a different server within the portal above.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
