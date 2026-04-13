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
              {loading && <div className="py-20 text-center text-gray-400">Searching the metaverse...</div>}
              
              {!loading && results.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {results.map((item) => {
                    const content = (
                      <div className="flex items-center gap-4 rounded-md p-2 transition hover:bg-white/5 text-left w-full">
                        <img 
                          src={getImageUrl(item.poster_path)} 
                          alt="" 
                          className="h-20 w-14 rounded-md object-cover" 
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{item.title || item.name}</h4>
                          <p className="text-xs text-gray-500">
                             {item.media_type?.toUpperCase()} • {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)} • ⭐ {item.vote_average?.toFixed(1)}
                          </p>
                        </div>
                        <Play size={20} className="text-gray-600" />
                      </div>
                    );

                    if (onSelect) {
                        return (
                            <button key={item.id} onClick={() => { onSelect(item); onClose(); }} className="w-full">
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link 
                          key={item.id} 
                          href={`/watch/${item.media_type || (item.title ? "movie" : "tv")}/${item.id}`} 
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
