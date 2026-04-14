"use client";

import React, { Suspense, Component } from "react";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Clock, Calendar, Play, Plus, Check, ChevronDown, ShieldCheck, Radio, Users, Download, Lock, AlertTriangle } from "lucide-react";
import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useEffect, useState } from "react";
import { getStreamUrl, SERVER_MAP } from "@/lib/stream";
import { useAuth } from "@/context/AuthContext";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { db } from "@/lib/firebase";

// Error Boundary for the whole page
class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("WatchPage Crash Intercepted:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-12 text-center">
            <AlertTriangle className="text-red-600 mb-6" size={64} />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Site Engine Recovered</h1>
            <p className="max-w-md text-gray-500 font-bold uppercase text-xs tracking-widest leading-relaxed mb-8">We successfully intercepted a crash and restored the engine. Please refresh to continue.</p>
            <button onClick={() => window.location.reload()} className="bg-red-600 px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-red-700 transition">Reload VOZ</button>
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
  const [activeSeasonTab, setActiveSeasonTab] = useState(1);
  const [paramsData, setParamsData] = useState<any>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();

  useEffect(() => {
    // AdBlock & Navigation Protection Logic
    try {
        const originalOpen = window.open;
        window.open = () => null;
        const handleBeforeUnload = (e: any) => { e.preventDefault(); e.returnValue = ""; };
        window.addEventListener('beforeunload', handleBeforeUnload);

        async function init() {
            try {
                const resolvedParams = await params;
                if (!resolvedParams) return;
                setParamsData(resolvedParams);

                const itemData = await fetchTMDB(endpoints.details(resolvedParams.type, resolvedParams.id)).catch(() => null);
                const similarData = await fetchTMDB(endpoints.similar(resolvedParams.type, resolvedParams.id)).catch(() => ({ results: [] }));

                if (itemData) {
                    setData({ item: itemData, similar: similarData });
                    if (resolvedParams.type === "tv") loadEpisodes(resolvedParams.id, 1);
                    
                    // Stats (Silent)
                    try {
                        const sRef = doc(db, "system", "stats");
                        getDoc(sRef).then(s => {
                            if (s.exists()) setDoc(sRef, { totalViews: (s.data()?.totalViews || 0) + 1 }, { merge: true }).catch(() => {});
                        }).catch(() => {});
                    } catch (e) {}
                }
            } catch (err) { console.warn("Init Internal Error", err); }
        }
        init();

        return () => { 
            window.open = originalOpen; 
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    } catch (e) {}
  }, [params]);

  useEffect(() => {
    if (user && paramsData?.id && paramsData?.type === 'tv') {
        try {
            const unsub = onSnapshot(collection(db, "users", user.uid, "history", String(paramsData.id), "watched_episodes"), 
                (snap) => setWatchedEpisodes(snap.docs.map(doc => doc.id)),
                () => {} 
            );
            return () => unsub();
        } catch (e) {}
    }
  }, [user, paramsData]);

  const loadEpisodes = async (tvId: string, sNum: number) => {
    try {
        const seasonData = await fetchTMDB(`/tv/${tvId}/season/${sNum}`);
        setEpisodes(seasonData.episodes || []);
        setActiveSeasonTab(sNum);
    } catch (err) {}
  };

  if (!paramsData || !data) return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-black italic tracking-widest animate-pulse">
    <Radio size={48} className="text-red-600 mb-6" />
    VOZ STREAM | LOAD_ENGINE...
  </div>;

  const { item, similar } = data;
  const watchType = paramsData.type;
  const playerUrl = getStreamUrl(watchType, item.id, season, episode, server, false, item.original_language);

  // Persistence Logic
  useEffect(() => {
    if (item && saveProgress) {
        try { saveProgress(item, watchType, season, episode); } catch (e) {}
    }
  }, [item, season, episode]);

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-red-600">
      <Navbar />

      <div className="pt-28 px-4 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-10">
            <div className="relative aspect-video w-full rounded-[40px] overflow-hidden bg-black border border-white/5 shadow-2xl shadow-primary-600/5">
                <iframe 
                    src={playerUrl}
                    className="w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                />
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 bg-white/[0.02] p-10 rounded-[40px] border border-white/5 backdrop-blur-3xl">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Live Protocol</span>
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase mb-4 leading-none">{item.title || item.name}</h1>
                <p className="text-gray-400 text-sm lg:text-lg font-medium leading-relaxed italic line-clamp-3">{item.overview}</p>
              </div>

              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <button 
                  onClick={() => isInWatchlist(item.id) ? removeFromWatchlist(item.id) : addToWatchlist(item)}
                  className={`flex-1 lg:flex-none h-16 px-10 rounded-3xl font-black uppercase tracking-widest text-xs transition flex items-center justify-center gap-3 ${isInWatchlist(item.id) ? 'bg-white text-black' : 'bg-white/5 border border-white/10'}`}
                >
                  {isInWatchlist(item.id) ? <Check size={18} /> : <Plus size={18} />}
                  My List
                </button>
                <button 
                    onClick={() => {
                        addDoc(collection(db, "rooms"), {
                            name: `${user?.displayName || "Guest"}'s Cinema`,
                            hostId: user?.uid || "guest",
                            createdAt: serverTimestamp(),
                            currentMovie: { id: item.id, type: watchType }
                        }).then(d => router.push(`/rooms/${d.id}`));
                    }}
                    className="flex-1 lg:flex-none h-16 px-10 rounded-3xl bg-primary-600 text-white font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition flex items-center justify-center gap-3"
                >
                  <Users size={18} /> Party
                </button>
              </div>
            </div>

            {similar?.results?.length > 0 && (
              <MovieRow title="More Like This" movies={similar.results} />
            )}
          </div>

          <div className="space-y-10">
            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
              <h3 className="text-sm font-black italic uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
                <ShieldCheck size={16} /> Protocols
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(SERVER_MAP).map(srv => (
                    <button
                        key={srv}
                        onClick={() => setServer(srv)}
                        className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition border ${server === srv ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                    >
                        {srv}
                    </button>
                ))}
              </div>
            </div>

            {watchType === "tv" && item.seasons && (
                <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
                    <h3 className="text-sm font-black italic uppercase tracking-widest text-primary-500 mb-6 flex items-center justify-between">
                        Episodes
                        <div className="flex gap-2">
                            {item.seasons.slice(0, 5).map((s: any) => (
                                <button key={s.id} onClick={() => loadEpisodes(item.id, s.season_number)} className={`px-2 py-1 rounded text-[8px] ${activeSeasonTab === s.season_number ? 'bg-red-600' : 'bg-white/5'}`}>S{s.season_number}</button>
                            ))}
                        </div>
                    </h3>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {episodes.map(ep => (
                            <button
                                key={ep.id}
                                onClick={() => { setSeason(ep.season_number); setEpisode(ep.episode_number); }}
                                className={`w-full p-4 rounded-2xl flex justify-between items-center text-left transition border ${episode === ep.episode_number ? 'bg-primary-600/20 border-primary-500/50 text-white' : 'bg-white/5 border-white/5 text-gray-400'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[140px]">E{ep.episode_number}: {ep.name}</span>
                                {watchedEpisodes.includes(String(ep.id)) && <Check size={12} className="text-primary-500" />}
                            </button>
                        ))}
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
        <Suspense fallback={null}>
            <WatchContent {...props} />
        </Suspense>
    </ErrorBoundary>
  );
}
