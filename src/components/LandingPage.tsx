"use client";

import { motion } from "framer-motion";
import { Send, Play, Shield, Sparkles, Crown } from "lucide-react";
import { useState } from "react";
import SupportModal from "@/components/SupportModal";
import Logo from "@/components/Logo";

export default function LandingPage({ onSignIn, onGuestSignIn }: { onSignIn: () => void, onGuestSignIn: () => void }) {
  const [showVIP, setShowVIP] = useState(false);
  
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0B0B] text-white overflow-hidden selection:bg-[#E50914]/30" dir="rtl">
      
      {/* Background Banner Backdrop */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img 
          src="https://i.ibb.co/TqWqYkK1/image.png" 
          alt="VistaFlix Banner" 
          className="w-full h-full object-cover protected-img blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/80 to-[#0B0B0B]/60" />
      </div>

      {/* Red Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#E50914]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl py-16">
        
        {/* Logo Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <Logo variant="icon" size="xl" />
          
          <h1 className="text-5xl md:text-7xl font-black font-['Montserrat'] tracking-tight">
            <span className="text-white">VISTA</span>
            <span className="text-[#E50914]">FLIX</span>
          </h1>
          
          <div className="space-y-1">
            <h2 className="text-xl md:text-3xl font-black text-white tracking-wide">
              عالمك... حيث تبدأ المتعة.
            </h2>
            <p className="text-xs md:text-sm font-bold text-[#B3B3B3] uppercase tracking-[0.25em]">
              YOUR WORLD. YOUR MOVIES.
            </p>
          </div>
        </motion.div>

        {/* Value Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8 w-full max-w-2xl"
        >
          {[
            { title: "أفلام حصرية", desc: "أحدث الإصدارات HD" },
            { title: "مسلسلات عربية", desc: "رمضان والخليج" },
            { title: "مباريات مباشر", desc: "بث مباشر 24/7" },
            { title: "بدون إعلانات", desc: "مشاهدة ناصعة" },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#171717]/80 backdrop-blur-md border border-[#333333] rounded-2xl p-3 text-center">
              <p className="text-xs font-bold text-[#E50914]">{item.title}</p>
              <p className="text-[10px] text-[#B3B3B3] font-medium mt-0.5">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto"
        >
          <button 
            onClick={onSignIn}
            className="btn-primary w-full py-4 rounded-2xl text-sm font-bold shadow-xl shadow-[#E50914]/30"
          >
            <Play size={18} fill="white" />
            <span>ابدأ المشاهدة الآن</span>
          </button>

          <button 
            onClick={onGuestSignIn}
            className="btn-secondary w-full py-3.5 rounded-2xl text-sm font-bold"
          >
            <span>دخول كزائر</span>
          </button>

          <a 
            href="https://t.me/VOZSTREAM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-bold text-[#B3B3B3] hover:text-white transition mt-2"
          >
            <Send size={15} className="text-[#229ED9]" />
            <span>انضم لقناة تلغرام الرسمية</span>
          </a>
        </motion.div>

        {/* UAE & Global Quality Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
            <p className="text-[11px] text-[#B3B3B3] font-bold tracking-widest uppercase">
              VISTAFLIX PREMIUM STREAMING EXPERIENCE
            </p>
        </motion.div>

        <SupportModal isOpen={showVIP} onClose={() => setShowVIP(false)} />
      </div>
    </div>
  );
}
