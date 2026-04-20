"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { fetchTMDB, filterSafeContent } from "@/lib/tmdb";
import { MovieRowSkeleton } from "@/components/Skeletons";

const GENRE_MAP: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  scifi: 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

export default function GenrePage({ params }: { params: Promise<{ genre: string }> }) {
  const resolvedParams = use(params);
  const genreName = resolvedParams.genre.toLowerCase();
  const genreId = GENRE_MAP[genreName];
  
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      if (!genreId) return;
      setLoading(true);
      try {
        const data = await fetchTMDB("/discover/movie", `with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
        setMovies(prev => page === 1 ? filterSafeContent(data.results) : [...prev, ...filterSafeContent(data.results)]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [genreId, page]);

  if (!genreId) return <div>Genre not found</div>;

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      <div className="pt-32 px-4 lg:px-12 pb-20">
        <header className="mb-12">
            <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white">{genreName}</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">{movies.length} Masterpieces Found</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {loading && Array(12).fill(0).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full skeleton-shimmer rounded-2xl" />
          ))}
        </div>

        {!loading && movies.length > 0 && (
            <div className="mt-20 flex justify-center">
                <button 
                    onClick={() => setPage(p => p + 1)}
                    className="bg-white/5 border border-white/10 px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all transform hover:scale-105 active:scale-95"
                >
                    Load More Horizon
                </button>
            </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
