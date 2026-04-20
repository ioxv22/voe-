"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { fetchTMDB, endpoints, filterSafeContent } from "@/lib/tmdb";
import { useEffect, useState, Suspense } from "react";
import { Search, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";

function BrowseContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");
  const [movies, setMovies] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Explore Library");

  useEffect(() => {
    async function load() {
        setLoading(true);
        const typeParam = searchParams.get("type"); // movie or tv
        let endpoint = typeParam === "tv" ? endpoints.tv : endpoints.movies;
        let params = "sort_by=popularity.desc";
        
        if (genreParam === "khaleeji") {
            endpoint = "/discover/tv";
            params = "with_original_language=ar&with_origin_country=AE|SA|KW|QA|BH|OM&sort_by=popularity.desc";
            setTitle("Khaleeji Originals | خليجي");
        } else if (genreParam === "family") {
            endpoint = "/discover/movie";
            params = "with_genres=10751&sort_by=popularity.desc";
            setTitle("Family Selection | عائلي");
        } else if (genreParam === "watchlist") {
            setTitle("Your Arsenal | قائمتي");
            // Here we'd ideally get from profile, for now show discovery as fallback or empty
            setMovies([]); 
            setLoading(false);
            return;
        } else if (typeParam === "movie") {
            endpoint = "/discover/movie";
            setTitle("Cinema Productions | أفلام");
        } else if (typeParam === "tv") {
            endpoint = "/discover/tv";
            setTitle("Premium TV Shows | مسلسلات");
        } else {
            setTitle("Explore Library");
        }

        const data = await fetchTMDB(endpoint, params);
        setMovies(filterSafeContent(data.results || []));
        setLoading(false);
    }
    load();
  }, [genreParam, searchParams]);

  const searchMovies = async (q: string) => {
    setQuery(q);
    if (q.length > 2) {
        setLoading(true);
        const data = await fetchTMDB(`/search/multi?query=${q}`);
        setMovies(filterSafeContent(data.results || []));
        setLoading(false);
    } else if (q.length === 0) {
        const data = await fetchTMDB(endpoints.movies);
        setMovies(filterSafeContent(data.results || []));
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter italic">{title}</h1>
                    <p className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em]">VOZ Database Access | {movies.length} Results Found</p>
                </div>
                
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for movies, series, anime..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-primary-600 focus:bg-white/10 transition"
                        value={query}
                        onChange={(e) => searchMovies(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                        <div key={i} className="aspect-[2/3] w-full rounded-[2rem] bg-white/5 animate-pulse border border-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {movies.map(m => (
                        <MovieCard key={m.id} movie={m} />
                    ))}
                    {movies.length === 0 && <p className="col-span-full text-center text-gray-500 py-20 font-bold uppercase tracking-widest text-sm">No results found in DXB Database.</p>}
                </div>
            )}
        </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-[#020202]">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <BrowseContent />
      </Suspense>
      <Footer />
    </main>
  );
}
