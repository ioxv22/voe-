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
      <div
        className="movie-card-hover relative aspect-[2/3] w-[140px] sm:w-[160px] md:w-[180px] lg:w-[220px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-[#0a0a0a] group shadow-2xl border border-white/5"
      >
        {imageUrl ? (
            <img
            src={imageUrl}
            alt={movie.title || movie.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110 protected-img"
            loading="lazy"
            />
        ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-700 text-[10px] font-bold uppercase text-center p-4">
                {movie.title || movie.name}
            </div>
        )}

        {/* Quality & Type Badges (Stig Style) */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end pointer-events-none">
            <div className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-primary-500 uppercase tracking-widest">
                {movie.media_type === "tv" || movie.first_air_date ? "Series" : "Movie"}
            </div>
            <div className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-green-500 uppercase tracking-widest">
                {(movie.vote_average || 0) > 7.5 ? "4K Ultra" : "Full HD"}
            </div>
        </div>

        {/* Rank Overlay (Integrated) */}
        {rank && rank <= 10 && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-black text-white shadow-lg">
            {rank}
          </div>
        )}

        {/* Persistent Bottom Bar */}
        {!rank && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 transition-transform duration-300 group-hover:translate-y-full">
                <p className="text-[10px] font-black text-white uppercase italic tracking-tighter line-clamp-1">{movie.title || movie.name}</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 italic">VOZ Premium Feed</p>
            </div>
        )}

        {/* Advanced Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-black/40 backdrop-blur-[2px] p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:backdrop-blur-[6px]">
          <div className="flex gap-2 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 shadow-lg">
                  <Play fill="currentColor" size={16} className={isRTL ? "rotate-180" : ""} />
              </div>
              <button 
                  onClick={handleFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition shadow-lg ${
                      isFavorited 
                      ? 'bg-red-600 border-red-600 text-white shadow-red-600/20' 
                      : 'bg-black/40 border-white/30 text-white hover:border-white'
                  }`}
              >
                  <Heart fill={isFavorited ? "currentColor" : "none"} size={16} />
              </button>
              <button 
                  onClick={handleShare}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 bg-black/40 text-white transition hover:border-white shadow-lg"
              >
                  <Share2 size={16} />
              </button>
          </div>
          
          <div className="mt-4 transform translate-y-4 transition-all duration-300 delay-75 group-hover:translate-y-0">
              <p className="text-sm font-black text-white italic uppercase tracking-tighter line-clamp-2 leading-tight">
                  {movie.title || movie.name}
              </p>
              <div className="flex items-center gap-3 text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-widest italic">
                  <span className="text-yellow-500">⭐ {movie.vote_average?.toFixed(1) || "7.5"}</span>
                  <span>{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "2026"}</span>
                  <span className="border border-white/20 px-1 rounded text-[7px]">CC</span>
              </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
