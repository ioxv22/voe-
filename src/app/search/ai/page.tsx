"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { fetchTMDB, filterSafeContent } from "@/lib/tmdb";
import { Sparkles, Search, Terminal, BrainCircuit, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setAnalyzing(true);

    try {
        // AI Simulation: Map description to TMDB Search
        // In a real app, you'd call Gemini or OpenAI here.
        // For this demo, we'll extract keywords and search TMDB.
        
        const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);
        const searchPromises = keywords.slice(0, 3).map(kw => fetchTMDB(`/search/multi`, `query=${kw}`));
        const responses = await Promise.all(searchPromises);
        
        const allResults = responses.flatMap(r => r.results);
        // Deduplicate and filter
        const uniqueResults = Array.from(new Set(allResults.map(r => r.id)))
            .map(id => allResults.find(r => r.id === id))
            .filter(r => r.media_type !== 'person');
            
        setResults(filterSafeContent(uniqueResults).slice(0, 20));
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
        setAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-primary-600">
      <Navbar />

      <div className="pt-32 px-4 lg:px-12 max-w-7xl mx-auto pb-20">
        <div className="text-center space-y-6 mb-16">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-600/10 text-primary-500 border border-primary-600/20 mb-4"
            >
                <BrainCircuit size={40} className="animate-pulse" />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter">VOZ NEURAL SEARCH</h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">AI-Powered Content Analysis Protocol v4.0</p>
        </div>

        <div className="max-w-3xl mx-auto">
            <form onSubmit={handleAISearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-red-600 rounded-[32px] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative flex items-center bg-[#0b0b0b] rounded-[32px] border border-white/10 p-2 shadow-2xl">
                    <input 
                        className="flex-1 bg-transparent px-8 py-5 text-lg outline-none placeholder:text-gray-700 font-medium"
                        placeholder="Describe the movie (e.g. 'Space movie with a sad ending', 'Arabic action series')..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button 
                        disabled={loading}
                        className="bg-primary-600 text-white p-5 rounded-[26px] hover:bg-primary-500 transition shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Terminal className="animate-spin" size={24} /> : <Sparkles size={24} />}
                        <span className="font-black uppercase text-xs tracking-widest hidden lg:block">Analyze</span>
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {analyzing && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl text-center"
                    >
                        <div className="flex items-center justify-center gap-4 text-xs font-black text-primary-500 uppercase tracking-[0.3em]">
                            <Terminal size={14} className="animate-pulse" />
                            Analyzing semantics... Identifying patterns... Querying Core Database...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {results.length > 0 && (
            <div className="mt-20">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Sparkles className="text-primary-600" /> Neural Matches Found
                    </h3>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{results.length} results identified</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {results.map((item, idx) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <MovieCard movie={item} />
                        </motion.div>
                    ))}
                </div>
            </div>
        )}

        {results.length === 0 && !loading && query && (
             <div className="mt-20 text-center opacity-20">
                <Info size={40} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">No neural matches detected. Try a different description.</p>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
