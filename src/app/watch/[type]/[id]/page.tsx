"use client";

import React, { Suspense, Component, useState, useEffect, use } from "react";
import { Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
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
  const [data, setData] = useState<{item: any, similar: any} | null>(null);
  const [server, setServer] = useState("nebula");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  const [playerKey, setPlayerKey] = useState(0); // To force reload
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [hasClickedIntro, setHasClickedIntro] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const router = useRouter();

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

  if (!data || !data.item) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-black italic tracking-widest animate-pulse">
        <span className="text-red-600 text-5xl mb-4">●</span>
        VOZ_LOADER...
    </div>
  );

    useEffect(() => {
        if (data?.item) {
            const title = data.item.title || data.item.name;
            const year = (data.item.release_date || data.item.first_air_date || "").slice(0, 4);
            document.title = `${title} (${year}) HD Online - VOZ STREAM`;
        }
    }, [data]);

  const item = data?.item;
  const similar = data?.similar;
  const playerUrl = getStreamUrl(type, String(item.id), season, episode, server, false, String(item.original_language), isPremium);

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
                    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-modals allow-pointer-lock allow-top-navigation allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
                />

                {(!isPremium && !hasClickedIntro) && (
                    <div 
                        onClick={() => {
                            setHasClickedIntro(true);
                            // Smart Redirect for Monetag logic
                        }}
                        className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer group/play"
                    >
                        <div className="h-24 w-24 rounded-full bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-600/40 transform group-hover/play:scale-110 transition duration-500">
                             <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-black border-b-[15px] border-b-transparent ml-2" />
                        </div>
                        <div className="absolute bottom-10 text-white font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Engage Secure Player</div>
                    </div>
                )}
                
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
                    onClick={() => setIsDownloadOpen(true)}
                    className="h-16 px-10 rounded-3xl bg-white/5 border border-white/10 font-black uppercase text-xs flex items-center gap-2 hover:bg-white/10 transition group"
                >
                    <Download size={16} className="text-primary-500 group-hover:scale-125 transition" />
                    DOWNLOAD
                </button>
                <button 
                    onClick={() => {
                        addDoc(collection(db, "rooms"), {
                            name: `${user?.displayName || "Guest"}'s Cinema`, hostId: user?.uid || "guest",
                            createdAt: serverTimestamp(), currentMovie: { id: item.id, type: type }
                        }).then(d => router.push(`/rooms/${d.id}`));
                    }}
                    className="h-16 px-10 rounded-3xl bg-red-600 font-black uppercase text-xs shadow-xl shadow-red-600/20"
                >
                    🎥 PARTY
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
