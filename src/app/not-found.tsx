"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 selection:bg-primary selection:text-white">
      {/* Cinematic Glitch Effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <h1 className="text-[120px] md:text-[220px] font-black italic tracking-tighter text-white/5 uppercase select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter text-white">LOST_IN_THE_VOID</h2>
            <p className="text-primary-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-sm">This content has been removed or restricted.</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-col items-center gap-8"
      >
        <p className="text-gray-500 max-w-md text-xs md:text-sm font-medium leading-relaxed uppercase italic">
            The signal you are looking for has been intercepted. Return to the main hub to continue your streaming protocol.
        </p>
        
        <Link href="/">
           <button className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary-600/30 transition-all hover:scale-105 active:scale-95">
             EJECT TO HOME
           </button>
        </Link>
      </motion.div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent opacity-20" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent opacity-20" />
    </div>
  );
}
