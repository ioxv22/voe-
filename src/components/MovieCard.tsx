"use client";

import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/tmdb";
import { Play, Plus } from "lucide-react";

import Link from "next/link";

interface MovieCardProps {
  movie: any;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const type = movie.media_type || (movie.title ? "movie" : "tv");
  const posterPath = movie.poster_path || movie.backdrop_path;
  const imageUrl = posterPath ? getImageUrl(posterPath) : null;
  
  return (
    <Link href={`/watch/${type}/${movie.id}`}>
      <motion.div
        whileHover={{ scale: 1.15, zIndex: 30 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative aspect-[2/3] w-[140px] flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-[#121212] lg:w-[200px]"
      >
        {imageUrl ? (
            <img
            src={imageUrl}
            alt={movie.title || movie.name}
            className="h-full w-full object-cover"
            loading="lazy"
            />
        ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-700 text-[10px] font-bold uppercase text-center p-4">
                {movie.title || movie.name}
            </div>
        )}

        {/* Hover Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 hover:opacity-100">
          <div className="flex gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition hover:bg-gray-200">
                  <Play fill="black" size={14} />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-white transition hover:border-white">
                  <Plus size={14} />
              </div>
          </div>
          <p className="mt-2 text-xs font-bold text-white line-clamp-1">{movie.title || movie.name}</p>
          <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold">
              <span>{Math.round(movie.vote_average * 10)}% Match</span>
              <span className="text-gray-400 border border-gray-600 px-1">{movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
