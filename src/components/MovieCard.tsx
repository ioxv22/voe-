"use client";

import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/tmdb";
import { Play, Heart, Share2, TrendingUp } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface MovieCardProps {
  movie: any;
  rank?: number;
}

export default function MovieCard({ movie, rank }: MovieCardProps) {
  const { currentProfile, toggleMyList } = useProfile();
  const { isRTL } = useLanguage();
  const type = movie.media_type || (movie.title ? "movie" : "tv");
  const posterPath = movie.poster_path || movie.backdrop_path;
  const imageUrl = posterPath ? getImageUrl(posterPath) : null;

  const isFavorited = currentProfile?.myList?.some(m => m.id === movie.id);

  const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMyList(movie);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/watch/${type}/${movie.id}`;
    const text = `Watch ${movie.title || movie.name} on VOZ Stream! 🚀`;
    
    if (navigator.share) {
      navigator.share({ title: movie.title || movie.name, text, url });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    }
  };
  
  return (
    <Link href={`/watch/${type}/${movie.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="movie-card-hover relative aspect-[2/3] w-[140px] sm:w-[160px] md:w-[180px] lg:w-[220px] flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] group shadow-2xl border border-white/5 transition-all duration-500"
      >
        {imageUrl ? (
            <img
            src={imageUrl}
            alt={movie.title || movie.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110 protected-img"
            loading="lazy"
            />
        ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-700 text-[10px] font-bold uppercase text-center p-4">
                {movie.title || movie.name}
            </div>
        )}

        {/* GLOSS REFLECTION EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Quality & Type Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end pointer-events-none">
            <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[7px] font-black text-primary uppercase tracking-[0.2em]">
                {movie.media_type === "tv" || movie.first_air_date ? "Series" : "Movie"}
            </div>
            <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[7px] font-black text-green-500 uppercase tracking-[0.2em]">
                {(movie.vote_average || 0) > 7.5 ? "4K Ultra" : "Full HD"}
            </div>
        </div>

        {/* Rank Overlay (Top 10 Style) */}
        {rank && rank <= 10 && (
          <div className="absolute -left-2 bottom-4 z-20 flex items-center justify-center">
            <span className="text-8xl font-black italic text-transparent stroke-white/20 select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>
              {rank}
            </span>
          </div>
        )}

        {/* Advanced Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-5 opacity-0 transition-all duration-500 group-hover:opacity-100 backdrop-blur-[4px]">
          <div className="flex gap-2 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-black transition hover:scale-110 shadow-[0_0_20px_rgba(20,184,166,0.4)]">
                  <Play fill="currentColor" size={18} className={isRTL ? "rotate-180" : ""} />
              </div>
              <button 
                  onClick={handleFavorite}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition backdrop-blur-md hover:scale-110 ${
                      isFavorited 
                      ? 'bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                  <Heart fill={isFavorited ? "currentColor" : "none"} size={18} />
              </button>
          </div>
          
          <div className="mt-5 transform translate-y-4 transition-all duration-500 delay-100 group-hover:translate-y-0">
              <p className="text-sm font-black text-white italic uppercase tracking-tight line-clamp-1">
                  {movie.title || movie.name}
              </p>
              <div className="flex items-center gap-3 text-[8px] text-gray-400 font-black mt-2 uppercase tracking-widest italic">
                  <span className="text-primary">⭐ {movie.vote_average?.toFixed(1) || "7.5"}</span>
                  <span>{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "2026"}</span>
                  <span className="border border-white/20 px-1 rounded-[2px] text-[6px]">HDR</span>
              </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
