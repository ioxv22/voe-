"use client";

import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { Star, Clock, Calendar, Play, Plus, Check } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useEffect, useState } from "react";
import { getStreamUrl, SERVER_MAP } from "@/lib/stream";

export default function WatchPage({ params }: { params: any }) {
  const [data, setData] = useState<{item: any, similar: any} | null>(null);
  const [server, setServer] = useState("nebula");
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    async function init() {
        const resolvedParams = await params;
        const [resolvedItem, resolvedSimilar] = await Promise.all([
          fetchTMDB(endpoints.details(resolvedParams.type, resolvedParams.id)),
          fetchTMDB(endpoints.similar(resolvedParams.type, resolvedParams.id)),
        ]);
        setData({ item: resolvedItem, similar: resolvedSimilar });
    }
    init();
  }, [params]);

  if (!data) return <div className="min-h-screen bg-black" />;
  const { item, similar } = data;
  const type = item.title ? "movie" : "tv";

  const toggleWatchlist = () => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const playerUrl = getStreamUrl(type, item.id, 1, 1, server);

  return (
    <main className="min-h-screen bg-[#020202]">
      <Navbar />

      <div className="pt-24 lg:pt-28 px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
            <iframe
              src={playerUrl}
              className="h-full w-full"
              allowFullScreen
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            />
          </div>

          {/* Server Selectors */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {Object.keys(SERVER_MAP).map((srv) => (
                <button
                    key={srv}
                    onClick={() => setServer(srv)}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition ${server === srv ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                    {srv.toUpperCase()}
                </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-white lg:text-5xl">
                    {item.title || item.name}
                </h1>
                <button 
                    onClick={toggleWatchlist}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                >
                    {isInWatchlist(item.id) ? <Check /> : <Plus />}
                </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={16} fill="currentColor" /> {item.vote_average.toFixed(1)}
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={16} /> {item.runtime || item.episode_run_time?.[0] || "--"} min
                </div>
                <div className="flex items-center gap-1">
                    <Calendar size={16} /> {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)}
                </div>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-3xl">
                {item.overview}
            </p>
          </div>
        </div>

        <div className="space-y-8">
            <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
                <h3 className="text-lg font-bold text-white mb-4">You might also like</h3>
                <div className="grid grid-cols-2 gap-4">
                    {similar.results.slice(0, 6).map((s: any) => (
                        <div key={s.id} className="group relative aspect-video overflow-hidden rounded-md cursor-pointer">
                            <img 
                                src={getImageUrl(s.backdrop_path)} 
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <Play size={24} fill="white" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-12">
        <MovieRow title="More like this" movies={similar.results} />
      </div>
    </main>
  );
}
