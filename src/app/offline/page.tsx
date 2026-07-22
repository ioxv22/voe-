"use client";

import React, { useEffect, useState } from "react";
import { HardDrive, Play, Trash2, WifiOff } from "lucide-react";
import { getOfflineMovies, removeOfflineMovie } from "@/utils/offlineStorage";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflinePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = async () => {
    const data = await getOfflineMovies();
    setMovies(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, type: string) => {
    await removeOfflineMovie(id, type);
    await loadOfflineData();
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white pt-32 pb-20 px-6 lg:px-20">
      

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <div className="h-16 w-16 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                <HardDrive className="text-blue-500" size={32} />
            </div>
            <div>
                <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter">Offline Library</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Saved content for offline browsing</p>
            </div>
        </div>

        {loading ? (
            <div className="h-64 flex items-center justify-center">
                <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        ) : movies.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-20 text-center flex flex-col items-center">
                <WifiOff size={64} className="text-gray-700 mb-6" />
                <h2 className="text-2xl font-black uppercase italic">Your library is empty</h2>
                <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto leading-relaxed">
                    Start adding movies and shows to your offline library to access them without internet. 
                    Note: Video files must be downloaded to your device via mirrors to play offline.
                </p>
                <Link href="/" className="mt-10 bg-white text-black px-10 py-4 rounded-full font-black uppercase text-xs hover:scale-105 transition active:scale-95">
                    Explore Content
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <AnimatePresence>
                    {movies.map((movie) => (
                        <motion.div 
                            key={`${movie.type}-${movie.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all"
                        >
                            <div className="aspect-[2/3] w-full overflow-hidden relative">
                                <img src={movie.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={movie.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        onClick={() => handleDelete(movie.id, movie.type)}
                                        className="h-10 w-10 bg-red-600/20 backdrop-blur-md text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-[10px] font-black uppercase tracking-tight line-clamp-1 italic">{movie.title}</h3>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-[8px] font-black text-blue-500 uppercase">{movie.type}</span>
                                    <Link 
                                        href={`/watch/${movie.type}/${movie.id}`}
                                        className="h-10 w-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition active:scale-90 shadow-xl"
                                    >
                                        <Play size={14} fill="currentColor" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
