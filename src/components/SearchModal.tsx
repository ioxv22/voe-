"use client";

import { useState, useEffect } from "react";
import { Search, X, Play } from "lucide-react";
import { fetchTMDB, endpoints, getImageUrl, filterSafeContent } from "@/lib/tmdb";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect?: (item: any) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchTMDB(endpoints.search, `query=${encodeURIComponent(query)}`);
        setResults(filterSafeContent(data.results).filter((i: any) => i.poster_path).slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
              <Search className="text-gray-400" size={24} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search movies, TV shows, anime..." 
                className="flex-1 bg-transparent text-xl text-white outline-none placeholder:text-gray-600"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={onClose}>
                <X className="text-gray-400 hover:text-white" size={24} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {!loading && !query && (
                <div className="space-y-6">
                    <Link href="/search/ai" onClick={onClose}>
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-purple-800 p-8 border border-white/10 shadow-2xl hover:scale-[1.02] transition-all">
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white shadow-2xl border border-white/20">
                                        <Search size={28} className="animate-pulse" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-black italic uppercase tracking-tighter text-2xl leading-none underline decoration-primary-500/50 underline-offset-4 mb-2">Neural AI Discovery</h4>
                                        <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">"Something scary but funny..."</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/10 rounded-full border border-white/10">Launch AI</div>
                            </div>
                        </div>
                    </Link>

                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 px-2">Trending Universes</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Action', 'Horror', 'Anime', 'Arabic'].map(cat => (
                                <Link key={cat} href={`/browse/genre/${cat.toLowerCase()}`} onClick={onClose} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition text-left">
                                    <span className="text-xs font-black uppercase tracking-widest italic">{cat} Protocol</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
              )}

              {loading && (
                <div className="py-32 flex flex-col items-center gap-6">
                    <div className="h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-500 animate-pulse">Scanning_Multiverse...</p>
                </div>
              )}
              
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  {results.map((item) => {
                    const type = item.media_type || (item.title ? "movie" : "tv");
                    const content = (
                      <div className="group flex items-center gap-6 rounded-3xl p-3 transition hover:bg-white/[0.05] border border-transparent hover:border-white/5 text-left w-full group">
                        <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-2xl">
                             <img 
                                src={getImageUrl(item.backdrop_path || item.poster_path)} 
                                alt="" 
                                className="h-full w-full object-cover group-hover:scale-110 transition duration-500" 
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <Play fill="white" size={24} />
                            </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black italic uppercase tracking-tighter text-lg leading-tight mb-1">{item.title || item.name}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                             <span className="text-primary-500 italic">⭐ {item.vote_average?.toFixed(1)}</span>
                             <span className="text-gray-500">{item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)}</span>
                             <span className="bg-white/10 px-2 py-0.5 rounded text-[8px]">{type}</span>
                          </div>
                        </div>
                      </div>
                    );

                    return (
                        <Link 
                          key={item.id} 
                          href={`/watch/${type}/${item.id}`} 
                          onClick={onClose}
                        >
                          {content}
                        </Link>
                    );
                  })}
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="py-20 text-center text-gray-500">No results found for "{query}"</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
