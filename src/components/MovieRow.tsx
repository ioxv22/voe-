"use client";

import { useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieRowProps {
  title: string;
  movies: any[];
  isHighlighted?: boolean;
}

export default function MovieRow({ title, movies, isHighlighted }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
      setShowLeft(scrollTo > 0);
    }
  };

  // SAFETY CHECK: Ensure movies is always an array to prevent crashes
  const safeMovies = Array.isArray(movies) ? movies : [];

  if (safeMovies.length === 0) return null;

  return (
    <div className={`group relative space-y-4 py-8 lg:space-y-6 lg:py-10 ${isHighlighted ? 'bg-primary-600/5' : ''}`}>
      <div className="flex items-center gap-4 px-4 lg:px-12">
        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter lg:text-3xl transition-all hover:text-primary-600">
            {title}
        </h2>
        <div className="h-0.5 flex-1 bg-gradient-to-r from-primary-600/50 to-transparent" />
      </div>

      <div className="relative group/arrows">
        <button
          onClick={() => scroll("left")}
          className="absolute top-0 bottom-0 left-0 z-40 hidden h-full w-14 items-center justify-center bg-black/60 text-white backdrop-blur-md transition-all opacity-0 group-hover/arrows:opacity-100 lg:flex hover:bg-black/90"
        >
          <ChevronLeft size={40} className="transition-transform active:scale-90" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll px-4 hide-scrollbar lg:gap-6 lg:px-12 py-4"
        >
          {safeMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute top-0 bottom-0 right-0 z-40 hidden h-full w-14 items-center justify-center bg-black/60 text-white backdrop-blur-md transition-all opacity-0 group-hover/arrows:opacity-100 lg:flex hover:bg-black/90"
        >
          <ChevronRight size={40} className="transition-transform active:scale-90" />
        </button>
      </div>
    </div>
  );
}
