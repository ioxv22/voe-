import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import { fetchTMDB, endpoints } from "@/lib/tmdb";

export default async function Home() {
  const [trending, trendingMovies, trendingSeries, anime] = await Promise.all([
    fetchTMDB(endpoints.trending),
    fetchTMDB(endpoints.movies),
    fetchTMDB(endpoints.series),
    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"),
  ]);

  const featured = trending.results[Math.floor(Math.random() * 5)];

  return (
    <main className="min-h-screen bg-[#020202] pb-20">
      <Navbar />
      
      <Hero movie={featured} />

      <div className="-mt-16 relative z-30 lg:-mt-24">
        <MovieRow title="Trending Now" movies={trending.results} />
        <MovieRow title="Popular Movies" movies={trendingMovies.results} />
        <MovieRow title="TV Shows Worth Binging" movies={trendingSeries.results} />
        <MovieRow title="Anime Collection" movies={anime.results} />
        
        {/* Placeholder for "Continue Watching" */}
        <div className="mt-8 px-4 lg:px-12">
            <div className="rounded-xl bg-gradient-to-r from-primary-600/20 to-transparent p-8 border border-white/5">
                <h3 className="text-xl font-bold text-white mb-2">Ready for your next adventure?</h3>
                <p className="text-gray-400 max-w-md">Continue watching where you left off or explore our personalized recommendations based on your tastes.</p>
                <button className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition">Explore More</button>
            </div>
        </div>
      </div>
    </main>
  );
}
