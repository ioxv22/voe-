"use client";

import React, { Suspense, Component, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, onSnapshot, collection, serverTimestamp, addDoc } from "firebase/firestore";
import { useWatchlist } from "@/hooks/useWatchlist";
import { getStreamUrl, SERVER_MAP } from "@/lib/stream";
import { useAuth } from "@/context/AuthContext";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { db } from "@/lib/firebase";
import PremiumPromo from "@/components/PremiumPromo";

// Bulletproof Error Boundary
class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-12 text-center">
              <span className="text-6xl mb-6">⚠️</span>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">ENGINE_RECOVERED</h1>
              <button onClick={() => window.location.reload()} className="bg-red-600 px-12 py-4 rounded-full font-black uppercase">RELOAD_VOZ</button>
          </div>
      );
    }
    return this.props.children;
  }
}

function WatchContent({ params }: { params: any }) {
  const { user, isPremium } = useAuth();
  const { saveProgress } = useContinueWatching();
  const [data, setData] = useState<{item: any, similar: any} | null>(null);
  const [server, setServer] = useState("nebula");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [paramsData, setParamsData] = useState<any>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  const [playerKey, setPlayerKey] = useState(0); // To force reload
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();

  useEffect(() => {
    async function init() {
        try {
            const resolvedParams = await params;
            if (!resolvedParams) return;
            setParamsData(resolvedParams);

            const [item, similar] = await Promise.all([
              fetchTMDB(endpoints.details(resolvedParams.type, resolvedParams.id)),
              fetchTMDB(endpoints.similar(resolvedParams.type, resolvedParams.id)),
            ]).catch(() => [null, {results: []}]);

            if (item) {
                setData({ item, similar });
                // Remove the one-time fetch here, we'll use a dedicated useEffect for seasons
                
                // Background Stats
                try {
                    const sRef = doc(db, "system", "stats");
                    getDoc(sRef).then(s => setDoc(sRef, { totalViews: (s.data()?.totalViews || 0) + 1 }, { merge: true }).catch(() => {})).catch(() => {});
                } catch (e) {}
            }
        } catch (err) {}
    }
    init();
  }, [params]);

  // Dedicated useEffect to load episodes for the active season
  useEffect(() => {
    if (paramsData?.id && paramsData?.type === "tv") {
        fetchTMDB(`/tv/${paramsData.id}/season/${season}`)
            .then(d => setEpisodes(d.episodes || []))
            .catch(() => setEpisodes([]));
    }
  }, [season, paramsData]);

  useEffect(() => {
    if (user && paramsData?.id && paramsData?.type === 'tv') {
        const unsub = onSnapshot(collection(db, "users", user.uid, "history", String(paramsData.id), "watched_episodes"), 
            (snap) => setWatchedEpisodes(snap.docs.map(doc => doc.id)),
            () => {}
        );
        return () => unsub();
    }
  }, [user, paramsData]);

  if (!paramsData || !data || !data.item) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-black italic tracking-widest animate-pulse">
        <span className="text-red-600 text-5xl mb-4">●</span>
        VOZ_LOADER...
    </div>
  );

  const { item, similar } = data;
  const watchType = String(paramsData.type);
  const playerUrl = getStreamUrl(watchType, String(item.id), season, episode, server, false, String(item.original_language));

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Navbar />
      <div className="pt-28 px-4 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-10">
            <div className="relative group aspect-video w-full rounded-[40px] overflow-hidden bg-black border border-white/5 shadow-2xl">
                <iframe 
                    key={playerKey}
                    src={playerUrl} 
                    className="w-full h-full" 
                    allowFullScreen 
                    frameBorder="0" 
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
                
                {/* Custom Overlay for help */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => setPlayerKey(k => k + 1)}
                        className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-2 rounded-full border border-white/10"
                    >
                        🔄 RELOAD_IFRAME
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 bg-white/[0.02] p-10 rounded-[40px] border border-white/5">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter mb-4">{String(item.title || item.name)}</h1>
                <p className="text-gray-400 text-sm lg:text-lg italic line-clamp-3">{String(item.overview || "No description available.")}</p>
                <div className="flex gap-6 mt-8 font-black italic color-gray-500 text-sm">
                    <span className="text-primary-500">⭐ {Number(item.vote_average).toFixed(1)}</span>
                    <span>📅 {String(item.release_date || item.first_air_date).slice(0, 4)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => isInWatchlist(item.id) ? removeFromWatchlist(item.id) : addToWatchlist(item)} className="h-16 px-10 rounded-3xl bg-white/5 border border-white/10 font-black uppercase text-xs">
                    {isInWatchlist(item.id) ? "✓ LISTED" : "+ LIST"}
                </button>
                <button 
                    onClick={() => {
                        addDoc(collection(db, "rooms"), {
                            name: `${user?.displayName || "Guest"}'s Cinema`, hostId: user?.uid || "guest",
                            createdAt: serverTimestamp(), currentMovie: { id: item.id, type: watchType }
                        }).then(d => router.push(`/rooms/${d.id}`));
                    }}
                    className="h-16 px-10 rounded-3xl bg-red-600 font-black uppercase text-xs shadow-xl shadow-red-600/20"
                >
                    🎥 PARTY
                </button>
              </div>
            </div>
            
            {similar?.results?.length > 0 && <MovieRow title="More Like This" movies={similar.results} />}
          </div>

          <div className="space-y-10">
            <PremiumPromo />
            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6">PROTOCOLS_ENG</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(SERVER_MAP).map(srv => (
                    <button key={srv} onClick={() => setServer(srv)} className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === srv ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                        {srv}
                    </button>
                ))}
              </div>
            </div>

            {watchType === "tv" && (
                <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 space-y-8">
                    {/* Season Selector */}
                    <div>
                        <h3 className="text-xs font-black uppercase mb-4 text-primary-500">SELECT_SEASON</h3>
                        <div className="flex flex-wrap gap-2">
                            {item.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                                <button 
                                    key={s.id} 
                                    onClick={() => { setSeason(s.season_number); setEpisode(1); }}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition border ${season === s.season_number ? 'bg-primary-600 border-primary-500 text-black' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                                >
                                    S{s.season_number}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Episode List */}
                    <div>
                        <h3 className="text-xs font-black uppercase mb-4 text-primary-500">S{season}: EPISODES_LOG</h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {episodes.map(ep => (
                                <button key={ep.id} onClick={() => { setEpisode(ep.episode_number); }} className={`w-full p-4 rounded-2xl flex justify-between items-center text-left transition border ${episode === ep.episode_number ? 'bg-red-600/20 border-red-500/50 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                                    <span className="text-[10px] font-black uppercase truncate max-w-[140px]">E{ep.episode_number}: {ep.name}</span>
                                    {watchedEpisodes.includes(String(ep.id)) && "✓"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function WatchPage(props: any) {
  return (
    <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <WatchContent {...props} />
        </Suspense>
    </ErrorBoundary>
  );
}
