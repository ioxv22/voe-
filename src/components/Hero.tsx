"use client";

import { Play, Info, Activity } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import Link from "next/link";

interface HeroProps {
  movie: any;
}

export default function Hero({ movie }: HeroProps) {
  const { t, isRTL } = useLanguage();
  if (!movie) return <div className="h-[80vh] w-full bg-black animate-pulse" />;

  const type = movie.media_type || (movie.title ? "movie" : "tv");

  return (
    <div className="relative h-[95vh] w-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background Image */}
      <img
        src={getImageUrl(movie.backdrop_path, "original")}
        alt={movie.title || movie.name}
        className="absolute h-full w-full object-cover transition-opacity duration-1000 protected-img"
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent",
        isRTL && "bg-gradient-to-l"
      )} />

      {/* Content */}
      <div className={cn(
        "absolute bottom-[25%] space-y-4 lg:space-y-6",
        isRTL ? "right-4 lg:right-12 text-right" : "left-4 lg:left-12 text-left"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className={cn(
            "max-w-[80%] text-4xl font-black text-white drop-shadow-2xl lg:text-7xl",
            isRTL && "font-arabic"
          )}>
            {movie.title || movie.name}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={cn(
            "max-w-xl text-xs text-gray-300 drop-shadow-md lg:text-lg line-clamp-2 lg:line-clamp-3 md:text-sm",
            isRTL && "font-arabic mr-0 ml-auto"
          )}
        >
          {movie.overview}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={cn(
            "flex items-center gap-3 lg:gap-4 pt-4",
            isRTL ? "justify-end" : "justify-start"
          )}
        >
          <Link href={`/watch/${type}/${movie.id}?server=school`}>
            <button className="flex items-center gap-2 rounded-md bg-white px-4 py-1.5 lg:px-8 lg:py-3 font-bold text-black transition hover:bg-white/80 lg:text-xl text-sm">
              <Play fill="black" size={18} className={cn("lg:w-6 lg:h-6", isRTL && "rotate-180")} /> {t("play")}
            </button>
          </Link>
          <Link href={`/watch/${type}/${movie.id}?server=school`}>
            <button className="flex items-center gap-2 rounded-md bg-blue-600/90 px-4 py-1.5 lg:px-8 lg:py-3 font-bold text-white backdrop-blur-md transition hover:bg-blue-600 lg:text-xl text-sm border border-blue-400/30">
              <Activity size={18} className="lg:w-6 lg:h-6" /> School Bypass
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Floating Rating Tag */}
      <div className={cn(
        "absolute bottom-[15%] border-y border-white/20 bg-black/40 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm",
        isRTL ? "left-0 rounded-r-md border-r" : "right-0 rounded-l-md border-l"
      )}>
        ⭐ {movie.vote_average?.toFixed(1)} IMDB
      </div>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
