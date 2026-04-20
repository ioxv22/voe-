"use client";

import React, { Suspense, Component, useState, useEffect, use } from "react";
import { Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, onSnapshot, collection, serverTimestamp, addDoc } from "firebase/firestore";
import { useWatchlist } from "@/hooks/useWatchlist";
import MovieReviews from "@/components/MovieReviews";
import { getStreamUrl, SERVER_MAP } from "@/lib/stream";
import { useAuth } from "@/context/AuthContext";

import { useContinueWatching } from "@/hooks/useContinueWatching";
import { db } from "@/lib/firebase";
import PremiumPromo from "@/components/PremiumPromo";
import DownloadModal from "@/components/DownloadModal";
import { useLanguage } from "@/context/LanguageContext";

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

function WatchContent({ type, id }: { type: string, id: string }) {
  const { user, isPremium } = useAuth();
  const { t } = useLanguage();
  const { saveProgress } = useContinueWatching();
  const searchParams = useSearchParams();
  const initialServer = searchParams.get("server") || "nebula";
  
  const [data, setData] = useState<{item: any, similar: any} | null>(null);
  const [server, setServer] = useState(initialServer);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  const [playerKey, setPlayerKey] = useState(0); // To force reload
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [hasClickedIntro, setHasClickedIntro] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showNextPrompt, setShowNextPrompt] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();

  // Auto-Next Logic for TV Shows
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNextPrompt && countdown > 0) {
        timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (showNextPrompt && countdown === 0) {
        handleNextEpisode();
    }
    return () => clearInterval(timer);
  }, [showNextPrompt, countdown]);

  const handleNextEpisode = () => {
      const nextEp = episodes.find(e => e.episode_number === episode + 1);
      if (nextEp) {
          setEpisode(nextEp.episode_number);
          setShowNextPrompt(false);
          setCountdown(10);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  useEffect(() => {
    async function init() {
        try {
            const [item, similar] = await Promise.all([
              fetchTMDB(endpoints.details(type, id)),
              fetchTMDB(endpoints.similar(type, id)),
            ]).catch(() => [null, {results: []}]);

            if (item) {
                setData({ item, similar });
                if (type === 'tv' && item.seasons?.length > 0) {
                    const firstSeason = item.seasons.find((s: any) => s.season_number > 0) || item.seasons[0];
                    setSeason(firstSeason.season_number);
                }
                if (type === 'movie') {
                    saveProgress(item, 'movie');
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
    init();
  }, [type, id]);

  useEffect(() => {
    if (type === 'tv' && season > 0) {
        fetchTMDB(`/tv/${id}/season/${season}`)
            .then(d => setEpisodes(d.episodes || []))
            .catch(() => setEpisodes([]));
    }
  }, [season, type, id]);

  useEffect(() => {
    if (user && id && type === 'tv') {
        const unsub = onSnapshot(collection(db, "users", user.uid, "history", String(id), "watched_episodes"), 
            (snap) => setWatchedEpisodes(snap.docs.map(doc => doc.id)),
            () => {}
        );
        return () => unsub();
    }
  }, [user, type, id]);


    useEffect(() => {
        if (data?.item) {
            const title = data.item.title || data.item.name;
            const year = (data.item.release_date || data.item.first_air_date || "").slice(0, 4);
            document.title = `${title} (${year}) HD Online - VOZ STREAM`;
        }
    }, [data]);

  const item = data?.item;
  const similar = data?.similar;

  if (!item) {
    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse font-mono">SYNCHRONIZING_VOZ_CORE...</p>
            </div>
        </div>
    );
  }

  const playerUrl = getStreamUrl(type, String(id), season, episode, server, false, String(item?.original_language || "ar"), isPremium);

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Navbar />
      <div className={`transition-all duration-700 ${isCinemaMode ? 'pt-0' : 'pt-28 px-4 lg:px-12'} pb-20`}>
        <div className={`grid grid-cols-1 ${isCinemaMode ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-12`}>
          <div className={`${isCinemaMode ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-10`}>
            <div className={`relative group transition-all duration-700 overflow-hidden bg-black border border-white/5 shadow-2xl ${isCinemaMode ? 'h-[85vh] w-full rounded-none' : 'aspect-video w-full rounded-[40px]'}`}>
                <iframe 
                    key={playerKey}
                    src={playerUrl} 
                    className="w-full h-full" 
                    allowFullScreen 
                    frameBorder="0" 
                    // Cinematic Protection: Block popups and malicious navigation while allowing core video functions
                    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock"
                />

                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsCinemaMode(!isCinemaMode)}
                            className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-6 py-3 rounded-full border border-white/10 flex items-center gap-2 hover:bg-primary-600 hover:border-primary-500 transition"
                        >
                            {isCinemaMode ? "Exit Cinema" : "Cinema Mode"}
                        </button>
                        <button 
                            onClick={() => setPlayerKey(k => k + 1)}
                            className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-6 py-3 rounded-full border border-white/10 hover:bg-white/20 transition"
                        >
                            🔄 RELOAD
                        </button>
                    </div>

                    {type === 'tv' && episode < episodes.length && (
                        <button 
                            onClick={() => setShowNextPrompt(true)}
                            className="bg-primary-600 text-white text-[10px] font-black uppercase px-6 py-3 rounded-full shadow-lg shadow-primary-900/40 hover:scale-105 transition"
                        >
                            Next Episode →
                        </button>
                    )}
                </div>

                {showNextPrompt && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-[60] flex flex-col items-center justify-center text-center p-12">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-2">Next Episode Starting In</p>
                        <h2 className="text-8xl font-black italic mb-8">{countdown}</h2>
                        <div className="flex gap-4">
                            <button onClick={handleNextEpisode} className="bg-primary-600 px-12 py-5 rounded-full font-black uppercase text-sm">Play Now</button>
                            <button onClick={() => setShowNextPrompt(false)} className="bg-white/10 px-12 py-5 rounded-full font-black uppercase text-sm border border-white/10">Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className={`flex flex-col lg:flex-row justify-between items-start gap-8 bg-white/[0.02] p-10 rounded-[40px] border border-white/5 ${isCinemaMode ? 'mx-4 lg:mx-12' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase italic shadow-lg">4K ULTRA HD</span>
                    <span className="bg-white/10 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">IMDb {Number(item.vote_average).toFixed(1)}</span>
                    <span className="bg-white/10 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{item.runtime || item.episode_run_time?.[0] || '120'} MIN</span>
                </div>
                <h1 className="text-4xl lg:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">{String(item.title || item.name)}</h1>
                <div className="flex flex-wrap gap-2 mb-8">
                    {item.genres?.map((g: any) => (
                        <span key={g.id} className="text-[10px] font-black uppercase text-gray-500 border border-white/10 px-4 py-2 rounded-full italic hover:text-white hover:border-white/30 transition">{g.name}</span>
                    ))}
                </div>
                <p className="text-gray-400 text-sm lg:text-lg italic line-clamp-3 leading-relaxed">{String(item.overview || "No description available.")}</p>
                <div className="flex gap-6 mt-8 font-black italic text-gray-500 text-sm">
                    <span className="text-primary-500">📅 {String(item.release_date || item.first_air_date).slice(0, 4)}</span>
                    <span>🌍 {item.production_countries?.[0]?.name || item.origin_country?.[0] || 'Global'}</span>
                    <span>🎞️ {item.status}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => isInWatchlist(item.id) ? removeFromWatchlist(item.id) : addToWatchlist(item)} className="h-20 px-12 rounded-3xl bg-white/5 border border-white/10 font-black uppercase text-xs hover:bg-white/10 transition">
                    {isInWatchlist(item.id) ? "✓ IN YOUR LIST" : "+ WATCHLIST"}
                </button>
                <button 
                    onClick={() => setIsDownloadOpen(true)}
                    className="h-20 px-12 rounded-3xl bg-white/5 border border-white/10 font-black uppercase text-xs flex items-center gap-2 hover:bg-white/10 transition group"
                >
                    <Download size={16} className="text-primary-500 group-hover:scale-125 transition" />
                    DOWNLOAD_HD
                </button>
                <button 
                    onClick={() => {
                        addDoc(collection(db, "rooms"), {
                            name: `${user?.displayName || "Guest"}'s Cinema`, hostId: user?.uid || "guest",
                            createdAt: serverTimestamp(), currentMovie: { id: item.id, type: type }
                        }).then(d => router.push(`/rooms/${d.id}`));
                    }}
                    className="h-20 px-12 rounded-3xl bg-red-600 font-black uppercase text-sm shadow-2xl shadow-red-600/30 hover:scale-105 transition"
                >
                    🎥 PARTY_MODE
                </button>
              </div>
            </div>
            

            {similar?.results?.length > 0 && <MovieRow title="More Like This" movies={similar.results} />}
            
            <div className="mt-20">
                <MovieReviews movieId={id} type={type} />
            </div>
          </div>

          <div className="space-y-10">
            <PremiumPromo />
            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-blue-600/10 to-purple-600/10 shadow-xl shadow-blue-600/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4 animate-pulse">⚡ SCHOOL_VPN_BYPASS</h3>
                <button 
                  onClick={() => setServer("school")} 
                  className={`w-full p-6 rounded-3xl text-[12px] font-black uppercase transition border shadow-lg ${server === "school" ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-blue-600/20'}`}
                >
                  🚀 Connect Tunnel (Alef)
                </button>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-red-600/10 to-green-600/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                {t("arabicServers")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => setServer("alooy")} 
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === "alooy" ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-green-600/20'}`}
                >
                    🚀 Alooy Server (علاوي)
                </button>
                <button 
                    onClick={() => setServer("nebula")} 
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === "nebula" ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-blue-600/20'}`}
                >
                    🪐 Nebula Server
                </button>
                <button 
                    onClick={() => setServer("akwam")} 
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === "akwam" ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                >
                    Akwam
                </button>
                <button 
                    onClick={() => setServer("fasel")} 
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === "fasel" ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                >
                    FaselHD
                </button>
              </div>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6">GLOBAL_SPEED_MIRRORS</h3>
              <div className="grid grid-cols-2 gap-3">
                {["auto", "vidsrc", "xyz", "vip", "net", "direct"].map(srv => (
                    <button key={srv} onClick={() => setServer(srv)} className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === srv ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}>
                        {srv}
                    </button>
                ))}
              </div>
            </div>

            {type === "tv" && (
                <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 space-y-8">
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
      <DownloadModal 
        isOpen={isDownloadOpen} 
        onClose={() => setIsDownloadOpen(false)} 
        type={type} 
        id={item.id} 
        season={season} 
        episode={episode} 
        title={item.title || item.name} 
      />
      <Footer />
    </main>
  );
}

export default function WatchPage({ params }: { params: Promise<{type: string, id: string}> }) {
  const resolvedParams = use(params);
  return (
    <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <WatchContent type={resolvedParams.type} id={resolvedParams.id} />
        </Suspense>
    </ErrorBoundary>
  );
}
