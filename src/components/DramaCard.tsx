"use client";

import { motion } from "framer-motion";
import { Play, Heart } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { getFullImageUrl } from "@/lib/drama-api";
import Link from "next/link";
import Image from "next/image";

interface DramaCardProps {
  series: any;
}

export default function DramaCard({ series }: DramaCardProps) {
  const { currentProfile, toggleMyList } = useProfile();
  
  const imageUrl = getFullImageUrl(series.poster);
  const seriesId = series.id;
  const internalId = `drama_${seriesId}`;

  const isFavorited = currentProfile?.myList?.some(m => m.id === internalId);

  const handleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const adaptedSeries = {
          id: internalId,
          title: series.title_ar,
          name: series.title_ar,
          poster_path: series.poster,
          backdrop_path: series.banner,
          media_type: "tv",
          vote_average: parseFloat(series.rating || "0"),
          release_date: series.release_year,
          isDrama: true
      };
      toggleMyList(adaptedSeries);
  };

  return (
    <Link href={`/watch/tv/${internalId}?title=${encodeURIComponent(series.title_ar)}`}>
      <motion.div
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.96 }}
        className="relative aspect-[2/3] w-[140px] sm:w-[165px] md:w-[190px] lg:w-[210px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[16px] bg-[#171717] group border border-[#333333] hover:border-[#E50914]/50 shadow-lg hover:shadow-xl hover:shadow-[#E50914]/15 transition-all duration-300"
      >
        {imageUrl ? (
            <Image
              src={imageUrl}
              alt={series.title_ar}
              fill
              className="object-cover transition duration-500 group-hover:scale-105 protected-img"
              sizes="(max-width: 640px) 140px, (max-width: 768px) 165px, (max-width: 1024px) 190px, 210px"
              loading="lazy"
            />
        ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#171717] text-[#B3B3B3] text-xs font-bold text-center p-3">
                {series.title_ar}
            </div>
        )}

        {/* Year Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-[#333333] text-[9px] font-bold text-white">
            {series.release_year || "2026"}
        </div>

        {/* Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
            <div className="px-2 py-0.5 rounded-md bg-[#E50914]/20 border border-[#E50914]/40 text-[8px] font-bold text-[#E50914]">
                مسلسلات حصرية
            </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
          <div className="flex gap-2 transform translate-y-3 transition-transform duration-300 group-hover:translate-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E50914] text-white transition hover:scale-110 shadow-lg shadow-[#E50914]/40">
                  <Play fill="currentColor" size={16} />
              </div>
              <button 
                  onClick={handleFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition backdrop-blur-md hover:scale-110 ${
                      isFavorited 
                      ? 'bg-[#E50914] border-[#E50914] text-white' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
              >
                  <Heart fill={isFavorited ? "currentColor" : "none"} size={16} />
              </button>
          </div>
          
          <div className="mt-3 transform translate-y-3 transition-all duration-300 delay-75 group-hover:translate-y-0 text-right">
              <p className="text-xs font-bold text-white line-clamp-1">
                  {series.title_ar}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#B3B3B3] font-bold mt-1">
                  <span className="text-yellow-400">⭐ {series.rating || "8.5"}</span>
                  <span className="bg-[#333333] text-white px-1.5 py-0.2 rounded text-[8px] font-bold">HD</span>
              </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
