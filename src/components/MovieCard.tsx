"use client";

import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/tmdb";
import { Play, Heart, HardDrive } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { isMovieOffline } from "@/utils/offlineStorage";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface MovieCardProps {
  movie: any;
  rank?: number;
}

export default function MovieCard({ movie, rank }: MovieCardProps) {
  const { currentProfile, toggleMyList } = useProfile();
  const type = movie.media_type || (movie.title ? "movie" : "tv");
  const posterPath = movie.poster_path || movie.backdrop_path;
  const imageUrl = posterPath ? getImageUrl(posterPath, "w342") : null;

  const isFavorited = currentProfile?.myList?.some(m => m.id === movie.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMyList(movie);
  };

  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    isMovieOffline(String(movie.id), type).then(setIsSaved);
  }, [movie.id, type]);

  return (
    <Link href={`/watch/${type}/${movie.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.96 }}
        className="relative aspect-[2/3] w-[140px] sm:w-[165px] md:w-[190px] lg:w-[210px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-[#111114] group border border-[#25252B] hover:border-[#E50924]/50 shadow-lg hover:shadow-xl hover:shadow-[#E50924]/15 transition-all duration-300"
      >
        {imageUrl ? (
            <Image
              src={imageUrl}
              alt={movie.title || movie.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105 protected-img"
              sizes="(max-width: 640px) 140px, (max-width: 768px) 165px, (max-width: 1024px) 190px, 210px"
              loading="lazy"
            />
        ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#111114] text-[#B6B6BD] text-xs font-bold text-center p-3">
                {movie.title || movie.name}
            </div>
        )}

        {/* Year Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-[#25252B] text-[9px] font-bold text-white">
            {movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || "2026"}
        </div>

        {/* Saved Indicator */}
        {isSaved && (
          <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-[#E50924] text-[9px] font-bold text-white flex items-center gap-1">
              <HardDrive size={10} /> محفوط
          </div>
        )}

        {/* Rank Overlay */}
        {rank && rank <= 10 && (
          <div className="absolute -left-2 bottom-3 z-20 flex items-center justify-center pointer-events-none">
            <span className="text-7xl font-black italic text-transparent select-none drop-shadow-[0_4px_10px_rgba(229,9,36,0.5)]" style={{ WebkitTextStroke: '2px #E50924' }}>
              {rank}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#050505] via-[#050505]/65 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
          <div className="flex gap-2 transform translate-y-3 transition-transform duration-300 group-hover:translate-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E50924] text-white transition hover:scale-110 shadow-lg shadow-[#E50924]/40">
                  <Play fill="currentColor" size={16} />
              </div>
              <button 
                  onClick={handleFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition backdrop-blur-md hover:scale-110 ${
                      isFavorited 
                      ? 'bg-[#E50924] border-[#E50924] text-white' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
              >
                  <Heart fill={isFavorited ? "currentColor" : "none"} size={16} />
              </button>
          </div>
          
          <div className="mt-3 transform translate-y-3 transition-all duration-300 delay-75 group-hover:translate-y-0 text-right">
              <p className="text-xs font-bold text-white line-clamp-1 font-['Tajawal']">
                  {movie.title || movie.name}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#B6B6BD] font-bold mt-1">
                  <span className="text-[#FFD84D]">⭐ {movie.vote_average?.toFixed(1) || "7.8"}</span>
                  <span className="bg-[#25252B] text-white px-1.5 py-0.2 rounded text-[8px] font-bold">4K</span>
              </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
