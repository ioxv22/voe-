"use client";

import { useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieRowProps {
  title: string;
  movies: any[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
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

  return (
    <div className="group relative space-y-2 py-4 lg:space-y-4 lg:py-6">
      <h2 className="px-4 text-lg font-bold text-white transition-colors hover:text-primary-600 lg:px-12 lg:text-2xl">
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute top-0 bottom-0 left-0 z-40 hidden h-full w-12 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100 lg:flex"
        >
          <ChevronLeft size={40} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-scroll px-4 hide-scrollbar lg:gap-4 lg:px-12"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute top-0 bottom-0 right-0 z-40 hidden h-full w-12 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100 lg:flex"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
}
