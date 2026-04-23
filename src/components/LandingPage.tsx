"use client";

import { motion } from "framer-motion";
import { Send, Play } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AdBanner from "@/components/AdBanner";

export default function LandingPage({ onSignIn, onGuestSignIn }: { onSignIn: () => void, onGuestSignIn: () => void }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#020202] text-white overflow-hidden font-sans selection:bg-teal-500/30">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative mb-6">
             {/* 3D Ring Effect (CSS) */}
             <div className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full border-[8px] border-teal-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(20,184,166,0.2)]">
                <div className="absolute inset-0 rounded-full border-t-4 border-teal-400 animate-[spin_3s_linear_infinite]" />
                <img 
                    src="https://i.ibb.co/wrCgwgzt/Chat-GPT-Image-Apr-22-2026-09-29-48-PM.png" 
                    alt="VOZ" 
                    className="w-20 md:w-32 h-auto object-contain brightness-125 contrast-125 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" 
                />
             </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter bg-gradient-to-b from-white via-teal-200 to-teal-500 bg-clip-text text-transparent uppercase drop-shadow-2xl">
            VOZSTREAM
          </h1>
        </motion.div>

        {/* Subtitles */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4 mb-12"
        >
          <div className="flex items-center justify-center gap-4 text-sm md:text-lg font-bold tracking-[0.2em] text-white/80">
            <span>VOZ STREAM</span>
            <span className="w-1 h-1 bg-teal-500 rounded-full" />
            <span className="font-arabic">فوز ستريم</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs md:text-sm font-medium tracking-[0.3em] text-teal-400/80 uppercase">
            <span>FREE STREAMING</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="font-arabic">بث مجاني</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs md:text-sm font-medium tracking-[0.3em] text-white/40 uppercase">
            <span>ADS FREE</span>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <span className="font-arabic">بدون اعلانات</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm mx-auto"
        >
          <button 
            onClick={onSignIn}
            className="w-full group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-teal-50 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <Play size={16} fill="currentColor" />
            Start Watching
          </button>
          
          <a 
            href="https://t.me/VOZSTREAM"
            target="_blank"
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all active:scale-95"
          >
            <Send size={16} />
            Telegram
          </a>
        </motion.div>

        {/* UAE Flag / Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
            <div className="flex items-center gap-1.5 h-6 opacity-80">
                <div className="w-1.5 h-full bg-[#FF0000]" />
                <div className="flex flex-col h-full w-4">
                    <div className="h-1/3 bg-[#00732F]" />
                    <div className="h-1/3 bg-[#FFFFFF]" />
                    <div className="h-1/3 bg-[#000000]" />
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                Premium Protocol
            </p>
        </motion.div>

        <div className="mt-12 scale-75 opacity-50 hover:opacity-100 transition-opacity">
            <AdBanner format="horizontal" />
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
      `}</style>
    </div>
  );
}
