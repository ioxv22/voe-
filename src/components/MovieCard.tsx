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
        whileHover={{ scale: 1.05, zIndex: 30 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-[2/3] w-[110px] sm:w-[150px] md:w-[170px] lg:w-[200px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#121212] group shadow-xl"
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

        {/* Top 10 Badge */}
        {rank && rank <= 10 && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-primary-600 px-2 py-1 text-[10px] font-black text-white shadow-lg shadow-primary-900/40">
            <TrendingUp size={10} /> TOP {rank}
          </div>
        )}

        {/* Hover Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 shadow-lg">
                  <Play fill="currentColor" size={16} className={isRTL ? "rotate-180" : ""} />
              </div>
              <button 
                  onClick={handleFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition shadow-lg ${
                      isFavorited 
                      ? 'bg-red-600 border-red-600 text-white' 
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
          <p className="mt-3 text-sm font-black text-white line-clamp-1 italic uppercase tracking-tighter">{movie.title || movie.name}</p>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
              <span className="text-primary-500 italic">⭐ {movie.vote_average?.toFixed(1)}</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px]">{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
