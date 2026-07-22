"use client";

import { Play, Info, Star, Calendar, Globe } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  movie: any;
}

export default function Hero({ movie }: HeroProps) {
  if (!movie) return <div className="h-[90vh] w-full bg-[#0B0B0B] animate-pulse" />;

  const type = movie.media_type || (movie.title ? "movie" : "tv");
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);

  return (
    <div className="relative h-[92vh] w-full overflow-hidden bg-[#0B0B0B]" dir="rtl">
      {/* Backdrop Image */}
      <motion.div 
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src={getImageUrl(movie.backdrop_path, "original")}
          alt={movie.title || movie.name}
          fill
          priority
          className="object-cover protected-img"
        />
      </motion.div>

      {/* VistaFlix Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
      <div className="absolute inset-0 bg-black/20 backdrop-brightness-90" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 px-6 lg:px-16 z-10 text-right">
        <div className="max-w-3xl space-y-6">
          
          {/* Metadata Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            <span className="bg-[#E50914] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-md shadow-[#E50914]/30">
              VISTAFLIX ORIGINAL
            </span>
            <div className="flex items-center gap-1.5 bg-[#171717]/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-white border border-[#333333]">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span>{movie.vote_average?.toFixed(1)} IMDb</span>
            </div>
            {year && (
                <div className="flex items-center gap-1.5 bg-[#171717]/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-[#B3B3B3] border border-[#333333]">
                    <Calendar size={13} className="text-[#E50914]" />
                    <span>{year}</span>
                </div>
            )}
            <div className="flex items-center gap-1.5 bg-[#171717]/80 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-[#B3B3B3] border border-[#333333]">
                <Globe size={13} className="text-[#FF2D3D]" />
                <span>{movie.original_language?.toUpperCase() || 'HD'}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h1 className="text-4xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
              {movie.title || movie.name}
            </h1>
          </motion.div>

          {/* Overview */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-sm lg:text-lg text-[#B3B3B3] font-medium max-w-2xl leading-relaxed line-clamp-3"
          >
            {movie.overview}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link href={`/watch/${type}/${movie.id}`}>
              <button className="btn-primary py-3.5 px-8 rounded-2xl text-sm">
                <Play fill="white" size={18} /> <span>شاهد الآن</span>
              </button>
            </Link>
            
            <Link href={`/watch/${type}/${movie.id}`}>
              <button className="btn-secondary py-3.5 px-8 rounded-2xl text-sm">
                <Info size={18} className="text-[#B3B3B3]" /> <span>التفاصيل</span>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
