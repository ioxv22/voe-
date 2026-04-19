"use client";

import { Crown, Zap, ShieldCheck, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function PremiumPromo() {
    const { isPremium } = useAuth();

    if (isPremium) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent p-8 rounded-[40px] border border-yellow-500/20 shadow-2xl"
        >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 bg-yellow-500/20 blur-[100px] rounded-full group-hover:bg-yellow-500/30 transition-all duration-700" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow-500 p-3 rounded-2xl text-black shadow-lg shadow-yellow-500/20">
                        <Crown size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">VOZ PREMIUM VIP</h3>
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Ultimate Protocol v2.0</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <FeatureItem icon={<Zap size={14} />} text="Zero Advertisements (Total Silence)" />
                    <FeatureItem icon={<Star size={14} />} text="4K Ultra HD Stream Nodes" />
                    <FeatureItem icon={<ShieldCheck size={14} />} text="Private Cinema Encrypted Rooms" />
                </div>

                <a 
                    href="https://t.me/VOZSTREAM" 
                    target="_blank"
                    className="block w-full text-center bg-yellow-500 py-4 rounded-3xl text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition transform active:scale-95 shadow-xl shadow-yellow-500/30"
                >
                    Upgrade Now - 15 AED / MONTH
                </a>
                
                <p className="mt-4 text-[10px] text-gray-500 text-center font-bold uppercase tracking-widest italic animate-pulse">
                    Limited Time Offer: Neural Subscriptions Open
                </p>
            </div>
        </motion.div>
    );
}

function FeatureItem({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
            <div className="text-yellow-500">{icon}</div>
            <span className="opacity-80 uppercase tracking-tight">{text}</span>
        </div>
    );
}
