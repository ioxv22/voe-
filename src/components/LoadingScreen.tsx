"use client";

import { motion } from "framer-motion";
import { MessageCircle, Ghost, Instagram, Music2, Share2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#020202] text-white relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      
      <div className="z-10 flex flex-col items-center gap-12 text-center px-6">
        {/* LOGO ANIMATION */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
        >
            <img 
                src="https://i.ibb.co/23Bkgcrx/image.png" 
                className="h-24 w-auto object-contain mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                alt="VOZ"
            />
            <div className="flex items-center gap-1 text-5xl font-black tracking-tighter">
                <span className="text-white">VOZ</span>
                <span className="text-primary-600">STREAM</span>
            </div>
            <p className="text-gray-500 mt-4 text-sm font-medium tracking-[0.2em] uppercase">Premium Entertainment</p>
        </motion.div>

        {/* LOADING INDICATOR */}
        <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
                <motion.div 
                    key={i}
                    animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-3 h-3 rounded-full bg-primary-600"
                />
            ))}
        </div>

        {/* SOCIAL LINKS (HAMAD'S BRANDING) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-6 w-full max-w-[320px]"
        >
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Connect with Hamad Al-Abdouli</p>
            
            <div className="grid grid-cols-1 gap-3">
                <a 
                    href="https://www.tiktok.com/@H7maddd" 
                    target="_blank" 
                    className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black rounded-lg border border-white/5">
                            <Music2 size={18} className="text-[#ff0050]" />
                        </div>
                        <span className="font-bold text-sm">TikTok @H7maddd</span>
                    </div>
                    <Share2 size={14} className="opacity-0 group-hover:opacity-100 transition" />
                </a>

                <a 
                    href="https://www.snapchat.com/add/hamadalabdolly" 
                    target="_blank" 
                    className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#FFFC00]/10 rounded-lg border border-[#FFFC00]/20 text-[#FFFC00]">
                            <Ghost size={18} />
                        </div>
                        <span className="font-bold text-sm">Snapchat hamadalabdolly</span>
                    </div>
                    <Share2 size={14} className="opacity-0 group-hover:opacity-100 transition" />
                </a>

                <a 
                    href="https://t.me/iivoz" 
                    target="_blank" 
                    className="flex items-center justify-between px-6 py-4 bg-primary-600/[0.05] border border-primary-600/20 rounded-2xl hover:bg-primary-600/[0.1] hover:border-primary-600/40 transition group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-600 text-white rounded-lg">
                            <MessageCircle size={18} />
                        </div>
                        <span className="font-bold text-sm text-primary-500">Telegram @iivoz</span>
                    </div>
                    <Share2 size={14} className="opacity-0 group-hover:opacity-100 transition" />
                </a>
            </div>
        </motion.div>
      </div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-10 text-[10px] text-gray-700 font-bold tracking-widest uppercase">
          © 2026 VOZ STREAM | BY HAMAD AL-ABDOULI
      </div>
    </div>
  );
}
