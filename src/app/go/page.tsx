"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Shield, Zap, Globe, ArrowRight, Monitor, Smartphone, Tv } from "lucide-react";
import Link from "next/link";

export default function TikTokLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-primary-500 overflow-hidden">
      {/* Background Kinetic Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]" />
      </div>

      {/* Floating Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[120px] rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-8"
          >
            <Zap size={12} className="fill-primary-500" /> System Protocols Active
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8"
          >
            The Future <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white/10">Streaming</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 font-medium text-lg md:text-xl leading-relaxed"
          >
            Access the ultimate digital library with zero restrictions. 
            Powered by high-speed server nodes for an unparalleled experience.
          </motion.p>
        </header>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-8 mb-32"
        >
          <Link href="/">
            <button className="group relative px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                    Enter the Database <ArrowRight size={20} />
                </span>
                <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </Link>
          
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <span className="flex items-center gap-2"><Shield size={14} className="text-green-500" /> No Log Policy</span>
            <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> Ultra-Low Latency</span>
            <span className="flex items-center gap-2"><Globe size={14} className="text-blue-500" /> Global Relays</span>
          </div>
        </motion.div>

        {/* Device Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/5 pt-20"
        >
            <DeviceCard 
                icon={<Monitor size={32} />} 
                title="Desktop Precision" 
                desc="Optimized for large 4K displays with dedicated acceleration."
            />
            <DeviceCard 
                icon={<Smartphone size={32} />} 
                title="Mobile Freedom" 
                desc="Stay connected on the move with smart data compression."
            />
            <DeviceCard 
                icon={<Tv size={32} />} 
                title="TV Integration" 
                desc="Seamless casting and smart-tv resolution upscaling."
            />
        </motion.div>

        <footer className="mt-32 text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-800">
          © 2026 VOZ DIGITAL ARCHITECTURE | ALL RIGHTS RESERVED
        </footer>
      </div>
    </main>
  );
}

function DeviceCard({ icon, title, desc }: any) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition group text-center md:text-left">
            <div className="mb-6 text-gray-600 group-hover:text-primary-500 transition-colors">{icon}</div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tight">{title}</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">{desc}</p>
        </div>
    );
}
