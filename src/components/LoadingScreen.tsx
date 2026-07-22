"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0B0B] text-white overflow-hidden select-none">
      {/* Background Poster Collage Effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/0 via-black/60 to-[#0B0B0B]">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 scale-110 blur-[1px] opacity-40">
          {[
            "https://image.tmdb.org/t/p/w500/1E5baW272Cm2erAq2RXZvMoJ2x2.jpg",
            "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGvjZ7aPfyw.jpg",
            "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94OiFWdq1E.jpg",
            "https://image.tmdb.org/t/p/w500/v9L1aC6fH3zU1d9iF9fWb4w8cZz.jpg",
            "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trTXMGlLhXES.jpg",
          ].map((url, idx) => (
            <div key={idx} className="aspect-[2/3] rounded-xl overflow-hidden bg-[#171717]">
              <img src={url} alt="" className="w-full h-full object-cover protected-img" />
            </div>
          ))}
        </div>
      </div>

      {/* Red Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E50914]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* VistaFlix Main Brand Logo */}
          <div className="relative mb-6">
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 20px rgba(229,9,20,0.5))",
                  "drop-shadow(0 0 35px rgba(255,45,61,0.8))",
                  "drop-shadow(0 0 20px rgba(229,9,20,0.5))",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <img
                src="https://i.ibb.co/bjsvpftX/image.png"
                alt="VistaFlix"
                className="h-28 md:h-36 w-auto object-contain protected-img"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-1.5"
          >
            <h1 className="text-3xl md:text-5xl font-black tracking-tight font-['Montserrat']">
              <span className="text-white">VISTA</span>
              <span className="text-[#E50914]">FLIX</span>
            </h1>
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-[#B3B3B3] uppercase">
              YOUR WORLD. YOUR MOVIES.
            </p>
            <p className="text-xs text-[#E50914] font-semibold tracking-widest mt-1">
              عالمك... حيث تبدأ المتعة.
            </p>
          </motion.div>
        </motion.div>

        {/* Animated Red Ring Loader (Matching Mobile Splash Screen Asset) */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-full h-full rounded-full border-3 border-[#E50914]/20 border-t-[#E50914] border-r-[#FF2D3D]"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#B3B3B3] animate-pulse">
            LOADING...
          </span>
        </div>
      </div>
    </div>
  );
}
