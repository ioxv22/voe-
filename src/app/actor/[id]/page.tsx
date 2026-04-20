"use client";

import { useState, useEffect, use } from "react";
import { fetchTMDB, getImageUrl } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import { User, Star, MapPin, Calendar, Film } from "lucide-react";
import { motion } from "framer-motion";

export default function ActorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [actor, setActor] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const actorData = await fetchTMDB(`/person/${id}`);
        const creditData = await fetchTMDB(`/person/${id}/movie_credits`);
        setActor(actorData);
        setCredits(creditData.cast.sort((a: any, b: any) => b.popularity - a.popularity).slice(0, 20));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[150px] rounded-full -mr-40 -mt-40" />
         
         <div className="relative z-10 mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-64 h-96 rounded-[40px] overflow-hidden border-4 border-white/5 shadow-2xl flex-shrink-0"
                >
                    <img src={getImageUrl(actor.profile_path)} className="w-full h-full object-cover" alt={actor.name} />
                </motion.div>

                <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                        <span className="bg-primary-600 px-4 py-1 rounded-full text-[10px] font-black uppercase italic">Voz Masterclass</span>
                        <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase text-gray-400">Popularity: {Number(actor.popularity).toFixed(1)}</span>
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">{actor.name}</h1>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                        <InfoItem icon={<MapPin size={16}/>} label="Born in" value={actor.place_of_birth || "Unknown"} />
                        <InfoItem icon={<Calendar size={16}/>} label="Birthday" value={actor.birthday || "Unknown"} />
                        <InfoItem icon={<Star size={16}/>} label="Best Known For" value={actor.known_for_department} />
                        <InfoItem icon={<Film size={16}/>} label="Movies" value={credits.length + "+ Hits"} />
                    </div>

                    <p className="text-gray-400 text-lg leading-relaxed italic max-w-4xl line-clamp-6">{actor.biography || "Biography is currently being encoded by Voz Intelli-Systems..."}</p>
                </div>
            </div>
         </div>
      </div>

      <div className="px-6 lg:px-12 py-12">
          <MovieRow title="Iconic Filmography" movies={credits} />
      </div>

      <Footer />
    </main>
  );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2 text-primary-500 mb-1">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
            </div>
            <p className="text-sm font-black truncate">{value}</p>
        </div>
    );
}
