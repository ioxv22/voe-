"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Terminal } from "lucide-react";
import { motion } from "framer-motion";

import { usePathname } from "next/navigation";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const { user, isAdmin: isAuthAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [isUrlBypass, setIsUrlBypass] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsUrlBypass(window.location.search.includes("admin=true"));
        }
    }, [pathname]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "system", "config"), (doc) => {
            if (doc.exists()) {
                setIsMaintenance(doc.data().maintenance || false);
            }
            setLoading(false);
        });

        // Launch Timer Logic (5:00 PM UAE Today)
        const checkLaunch = () => {
            // UAE is UTC+4. Let's calculate target UTC time.
            // Target: 2026-04-20 17:00:00 UAE
            // UTC: 2026-04-20 13:00:00 UTC
            const targetTime = new Date("2026-04-20T13:00:00Z").getTime();
            const now = new Date().getTime();
            
            if (now < targetTime) {
                setIsScheduled(true);
                const diff = targetTime - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${mins}m ${secs}s`);
            } else {
                setIsScheduled(false);
            }
        };

        const timer = setInterval(checkLaunch, 1000);
        checkLaunch();

        return () => {
            unsub();
            clearInterval(timer);
        };
    }, []);

    const isAdmin = isAuthAdmin || (user?.email && user.email.includes("admin")) || isUrlBypass;

    if (loading) return null;

    // SCENARIO: SITE IS LOCKED UNTIL 5 PM UAE
    if (isScheduled && !isAdmin && !pathname.startsWith('/admin')) {
        return (
            <div className="fixed inset-0 z-[99999] bg-[#020202] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full animate-pulse" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-2xl w-full"
                >
                    <div className="mb-12">
                        <h3 className="text-primary-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4">Official Platform Launch</h3>
                        <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">VOZ STREAM <br/><span className="text-gray-700">COMES ALIVE</span></h1>
                    </div>

                    <div className="mb-16">
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs mb-8 italic">Opening Doors Today at 5:00 PM UAE ( بتوقيت الإمارات )</p>
                        <div className="text-6xl lg:text-7xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(229,9,20,0.3)]">
                            {timeLeft}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-relaxed max-w-xs">
                            Server Syncing... Security Hardening... <br/>Preparing the Ultimate 4K Experience for VOZ VIPs.
                        </p>
                    </div>
                </motion.div>
                
                <div className="absolute bottom-10 left-10 text-[8px] font-black text-gray-800 uppercase tracking-widest">
                    V-SYS CORE v4.0 // ENCRYPTED_CHANNEL
                </div>
            </div>
        );
    }

    if (isMaintenance && !isAdmin && !pathname.startsWith('/admin')) {
        return (
            <div className="fixed inset-0 z-[99999] bg-[#020202] flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-24 w-24 bg-red-600/10 border border-red-600/20 rounded-[32px] flex items-center justify-center mx-auto mb-8"
                    >
                        <ShieldAlert size={48} className="text-red-600" />
                    </motion.div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">Under Maintenance</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed mb-12">
                        VOZ Stream is currently upgrading its core systems for a better experience. We will be back shortly.
                    </p>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 justify-center">
                        <Terminal size={18} className="text-primary" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">System Upgrade in Progress...</span>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
