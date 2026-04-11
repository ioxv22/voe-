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
    const { user } = useAuth();
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
        return () => unsub();
    }, []);

    // Allow admins to bypass maintenance (assuming admin check logic here)
    // For now, let's keep it simple: if maintenance is on, everyone sees the screen unless they are a specific admin UID if we had one.
    // Hamad's UID can be added here.
    const isAdmin = user?.email === "hamad@example.com" || user?.email?.includes("admin");

    if (loading) return null;

    if (isMaintenance && !isAdmin && !pathname.startsWith('/admin') && !isUrlBypass) {
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
