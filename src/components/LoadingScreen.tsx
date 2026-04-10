"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#020202] text-white relative overflow-hidden text-centerSelection selection:bg-primary-600 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center gap-12 text-center px-6">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
        >
            <img 
                src="https://i.ibb.co/23Bkgcrx/image.png" 
                className="h-28 w-auto object-contain mb-6" 
                alt="VOZ"
                style={{ filter: "drop-shadow(0 0 20px rgba(229, 9, 20, 0.4))" }}
            />
            <div className="flex items-center gap-2 text-6xl font-black tracking-tighter uppercase italic">
                <span className="text-white">VOZ</span>
                <span className="text-primary-600">STREAM</span>
            </div>
            <p className="text-gray-600 mt-4 text-[10px] font-black tracking-[0.4em] uppercase">Built By Hamad Al-Abdouli</p>
        </motion.div>

        {/* Cinematic Loader */}
        <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
                <motion.div 
                    key={i}
                    animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3] 
                    }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 1, 
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                    className="w-3 h-3 rounded-full bg-primary-600 shadow-[0_0_10px_#e50914]"
                />
            ))}
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2">
          <p className="text-[9px] text-gray-700 font-black tracking-[0.2em] uppercase">TIKTOK: H7MADDD • SNAP: HAMADALABDOLLY • TELEGRAM: @IIVOZ</p>
          <div className="h-0.5 w-24 bg-primary-600/20 rounded-full mt-2" />
      </div>
    </div>
  );
}
