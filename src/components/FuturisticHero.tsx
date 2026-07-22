"use client";

import { motion } from "framer-motion";
import { Play, Plus, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface FuturisticHeroProps {
  item: any;
}

export default function FuturisticHero({ item }: FuturisticHeroProps) {
  const [isMuted, setIsMuted] = useState(true);

  if (!item) return null;

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} 
          className="h-full w-full object-cover opacity-60 scale-105"
          alt={item.title || item.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-24 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Premium</span>
            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">4K Ultra HD</span>
          </div>

          <h1 className="hero-title reveal-up">
            {item.title || item.name}
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl font-medium leading-relaxed italic line-clamp-3">
            {item.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6">
            <Link href={`/watch/${item.title ? 'movie' : 'tv'}/${item.id}`}>
                <button className="group relative flex items-center gap-3 bg-white text-black px-12 py-5 rounded-xl font-black uppercase text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    <Play fill="currentColor" size={20} />
                    <span>Play Now</span>
                </button>
            </Link>
            
            <button className="p-5 rounded-xl bg-white/10 border border-white/10 text-white transition hover:bg-white/20 hover:scale-110 active:scale-95 backdrop-blur-xl">
                <Plus size={20} />
            </button>

            <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-5 rounded-xl bg-white/10 border border-white/10 text-white transition hover:bg-white/20 hover:scale-110 active:scale-95 backdrop-blur-xl"
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row Indicators (Minimal) */}
      <div className="absolute bottom-12 right-24 hidden md:flex items-center gap-4 z-20">
          <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Directed By</span>
              <span className="text-sm font-bold text-white italic">Hamad Al-Abdouli</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10 mx-4" />
          <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Release Year</span>
              <span className="text-sm font-bold text-white italic">{String(item.release_date || item.first_air_date).slice(0, 4)}</span>
          </div>
      </div>
    </section>
  );
}
