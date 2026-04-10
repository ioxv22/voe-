"use client";

import { Play, Info } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { motion } from "framer-motion";

import Link from "next/link";

interface HeroProps {
  movie: any;
}

export default function Hero({ movie }: HeroProps) {
  if (!movie) return <div className="h-[80vh] w-full bg-black animate-pulse" />;

  const type = movie.media_type || (movie.title ? "movie" : "tv");

  return (
    <div className="relative h-[95vh] w-full overflow-hidden">
      {/* Background Image */}
      <img
        src={getImageUrl(movie.backdrop_path, "original")}
        alt={movie.title || movie.name}
        className="absolute h-full w-full object-cover transition-opacity duration-1000 protected-img"
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[25%] left-4 space-y-4 lg:left-12 lg:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="max-w-[80%] text-4xl font-black text-white drop-shadow-2xl lg:text-7xl">
            {movie.title || movie.name}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl text-sm text-gray-200 drop-shadow-md lg:text-lg line-clamp-3"
        >
          {movie.overview}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-3 lg:gap-4 pt-4"
        >
          <Link href={`/watch/${type}/${movie.id}`}>
            <button className="flex items-center gap-2 rounded-md bg-white px-6 py-2 font-bold text-black transition hover:bg-white/80 lg:px-8 lg:py-3 lg:text-xl">
              <Play fill="black" size={24} /> Play
            </button>
          </Link>
          <Link href={`/watch/${type}/${movie.id}`}>
            <button className="flex items-center gap-2 rounded-md bg-white/25 px-6 py-2 font-bold text-white backdrop-blur-md transition hover:bg-white/30 lg:px-8 lg:py-3 lg:text-xl">
              <Info size={24} /> More Info
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Floating Rating Tag */}
      <div className="absolute right-0 bottom-[15%] rounded-l-md border-y border-l border-white/20 bg-black/40 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
        ⭐ {movie.vote_average?.toFixed(1)} IMDB
      </div>
    </div>
  );
}
