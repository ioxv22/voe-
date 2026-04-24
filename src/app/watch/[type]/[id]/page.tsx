"use client";

import React, { Suspense, Component, useState, useEffect, use } from "react";
import { Download, ThumbsUp, ThumbsDown, Check, Plus, Share2, CheckCircle2, Play, Users, Send, Activity, Search, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, onSnapshot, collection, serverTimestamp, addDoc } from "firebase/firestore";
import MovieReviews from "@/components/MovieReviews";
import { getStreamUrl, SERVER_MAP, decodeObs } from "@/lib/stream";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { db } from "@/lib/firebase";
import PremiumPromo from "@/components/PremiumPromo";
import DownloadModal from "@/components/DownloadModal";
import { useLanguage } from "@/context/LanguageContext";
import AdBanner from "@/components/AdBanner";

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
  const { currentProfile, toggleMyList, toggleLike } = useProfile();
  const { t } = useLanguage();
  const { saveProgress } = useContinueWatching();
  const searchParams = useSearchParams();
  const initialServer = searchParams.get("server") || "nebula";
  
  const [data, setData] = useState<{item: any, similar: any} | null>(null);
  const [cast, setCast] = useState<any[]>([]);
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
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
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
            const [item, similar, credits] = await Promise.all([
              fetchTMDB(endpoints.details(type, id)),
              fetchTMDB(endpoints.similar(type, id)),
              fetchTMDB(`/${type}/${id}/credits`)
            ]);

            if (item) {
                setData({ item, similar });
                setCast(credits.cast?.slice(0, 15) || []);
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

  const [savedTime, setSavedTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load Saved Progress from Firestore
  useEffect(() => {
    if (user && id) {
        const docRef = doc(db, "users", user.uid, "history", String(id));
        getDoc(docRef).then(snap => {
            if (snap.exists() && snap.data().progress) {
                setSavedTime(snap.data().progress);
            }
        });
    }
  }, [user, id]);

  // Handle Messages from Iframe (VidLink / Nebula)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        // VidLink / Nebula Protocol
        if (event.data?.type === 'vidlink_timeupdate') {
            const { currentTime, duration } = event.data;
            setSavedTime(currentTime);
            setDuration(duration);
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Periodic Save (Every 15s or on Pause)
  useEffect(() => {
    if (savedTime > 0) {
        const interval = setInterval(() => {
            saveProgress(item, type, season, episode, savedTime, duration);
        }, 15000);
        return () => clearInterval(interval);
    }
  }, [savedTime, item, type, season, episode, duration]);

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

  const playerUrl = getStreamUrl(type, String(id), season, episode, server, false, String(item?.original_language || "ar"), isPremium) + `&t=${Math.floor(savedTime)}`;

  return (
    <main className="min-h-screen bg-[#020404] bg-mesh text-white">
      <Navbar />
      <div className={`transition-all duration-700 ${isCinemaMode ? 'pt-0' : 'pt-28 px-4 lg:px-12'} pb-20`}>
        <div className={`grid grid-cols-1 ${isCinemaMode ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-12`}>
          <div className={`${isCinemaMode ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-10`}>
            <div className={`relative group transition-all duration-700 overflow-hidden bg-black border border-white/5 shadow-2xl ${isCinemaMode ? 'h-[85vh] w-full rounded-none' : 'aspect-video w-full rounded-[40px]'}`}>
                <iframe 
                    key={playerKey}
                    src={playerUrl} 
                    className="w-full h-full scale-[1.01]" 
                    allowFullScreen 
                    frameBorder="0" 
                    sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock"
                />

                {/* PREMIUM OVERLAY (CINEMAOS STYLE) */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {/* Top Branding */}
                    <div className="absolute top-8 left-10 flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/20 backdrop-blur-md rounded-xl border border-primary/20 flex items-center justify-center">
                            <Play className="text-primary fill-primary" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Now Playing</p>
                            <h2 className="text-sm font-bold uppercase tracking-tighter italic">{String(item.title || item.name)}</h2>
                        </div>
                    </div>

                    {/* Center Controls */}
                    <div className="absolute inset-0 flex items-center justify-center gap-16 pointer-events-auto">
                        <button onClick={() => setPlayerKey(k => k + 1)} className="p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition active:scale-90">
                            <motion.div whileHover={{ rotate: -90 }}><Play className="rotate-180" size={32} /></motion.div>
                        </button>
                        <div className="relative">
                            <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(20,184,166,0.5)]">
                                <Play className="fill-black text-black ml-1" size={32} />
                            </div>
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-ping" />
                        </div>
                        <button onClick={() => setPlayerKey(k => k + 1)} className="p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:bg-white/10 transition active:scale-90">
                            <motion.div whileHover={{ rotate: 90 }}><Play size={32} /></motion.div>
                        </button>
                    </div>

                    {/* Bottom Info & Progress */}
                    <div className="absolute bottom-0 left-0 right-0 p-10 pointer-events-auto">
                        <div className="flex items-end justify-between mb-8">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{String(item.title || item.name)}</h3>
                                <p className="text-xs text-gray-400 font-medium opacity-60">VOZ STREAM | @IIVOZ</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Built by Hamad Al-Abdouli</p>
                                <p className="text-xs font-mono text-primary">0:00 / 0:00</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-8 group/progress cursor-pointer">
                            <div className="absolute inset-y-0 left-0 bg-primary w-[35%] shadow-[0_0_15px_rgba(20,184,166,0.8)]" />
                            <div className="absolute top-1/2 left-[35%] -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-xl scale-0 group-hover/progress:scale-100 transition-transform" />
                        </div>

                        {/* Control Bar */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-6">
                                    <Play className="fill-white text-white cursor-pointer hover:text-primary transition" size={24} />
                                    <div className="flex items-center gap-3 group/vol">
                                        <div className="h-1.5 w-24 bg-white/10 rounded-full relative overflow-hidden">
                                            <div className="absolute inset-y-0 left-0 bg-white w-2/3" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 opacity-60 hover:opacity-100 transition">
                                <Activity size={20} className="cursor-pointer hover:text-primary transition" />
                                <Send size={20} className="cursor-pointer hover:text-primary transition" />
                                <Search size={20} className="cursor-pointer hover:text-primary transition" />
                                <Settings size={20} className="cursor-pointer hover:text-primary transition" />
                                <Users size={20} className="cursor-pointer hover:text-primary transition" />
                                <Plus size={20} className="cursor-pointer hover:text-primary transition" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legacy Quick Actions */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity z-[60] pointer-events-none">
                    <div className="flex gap-4 pointer-events-auto">
                        <button 
                            onClick={() => setIsCinemaMode(!isCinemaMode)}
                            className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-6 py-3 rounded-full border border-white/10 flex items-center gap-2 hover:bg-primary hover:text-black transition"
                        >
                            {isCinemaMode ? "Exit Cinema" : "Cinema Mode"}
                        </button>
                    </div>
                </div>
            </div>

            <AdBanner format="horizontal" />

            <div className={`flex flex-col lg:flex-row justify-between items-start gap-8 bg-white/[0.02] p-10 rounded-[40px] border border-white/5 ${isCinemaMode ? 'mx-4 lg:mx-12' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-primary text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase italic shadow-lg">4K ULTRA HD</span>
                    <span className="bg-white/10 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">IMDb {Number(item.vote_average).toFixed(1)}</span>
                    <span className="bg-white/10 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{item.runtime || item.episode_run_time?.[0] || '120'} MIN</span>
                </div>
                <h1 className="text-4xl lg:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none metallic-text">{String(item.title || item.name)}</h1>
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

              <div className="flex flex-wrap gap-4 items-center">
                <button 
                    onClick={() => toggleMyList(item)}
                    className={`h-20 px-10 rounded-3xl font-black uppercase text-xs transition-all transform active:scale-95 flex items-center gap-3 ${currentProfile?.myList?.some(m => m.id === item.id) ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                >
                    {currentProfile?.myList?.some(m => m.id === item.id) ? <CheckCircle2 size={20} className="text-green-600" /> : <Plus size={20} />}
                    {currentProfile?.myList?.some(m => m.id === item.id) ? 'In My List' : 'Watchlist'}
                </button>

                <div className="flex items-center gap-1 p-2 bg-white/5 rounded-3xl border border-white/10 h-20">
                    <button 
                        onClick={() => toggleLike(item, true)}
                        className={`p-4 rounded-2xl transition-all ${currentProfile?.likes?.includes(item.id) ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="I Like This"
                    >
                        <ThumbsUp size={20} fill={currentProfile?.likes?.includes(item.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <button 
                        onClick={() => toggleLike(item, false)}
                        className={`p-4 rounded-2xl transition-all ${currentProfile?.dislikes?.includes(item.id) ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="Not for me"
                    >
                        <ThumbsDown size={20} fill={currentProfile?.dislikes?.includes(item.id) ? "currentColor" : "none"} />
                    </button>
                </div>

                <div className="flex gap-2 h-20">
                    <button 
                        onClick={() => setIsDownloadOpen(true)}
                        className="w-16 h-full flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition group"
                    >
                        <Download size={20} className="text-gray-400 group-hover:text-primary-500 transition" />
                    </button>
                    <button 
                        onClick={() => setIsShareOpen(true)}
                        className="w-16 h-full flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition group"
                    >
                        <Share2 size={20} className="text-gray-400 group-hover:text-blue-500 transition" />
                    </button>
                    <button 
                        onClick={() => {
                            addDoc(collection(db, "rooms"), {
                                name: `${user?.displayName || "Guest"}'s Cinema`, hostId: user?.uid || "guest",
                                createdAt: serverTimestamp(), currentMovie: { id: item.id, type: type }
                            }).then(d => router.push(`/rooms/${d.id}`));
                        }}
                        className="h-full px-8 rounded-3xl bg-red-600 font-black uppercase text-xs flex items-center gap-2 hover:scale-105 transition shadow-xl shadow-red-600/20"
                    >
                        <Users size={18} /> PARTY
                    </button>
                </div>
              </div>
            </div>
            

            {cast?.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                        <Users size={14} /> Starring Masterclass
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {cast.map(person => (
                            <Link 
                                key={person.id} 
                                href={`/actor/${person.id}`}
                                className="group flex items-center gap-3 bg-white/5 border border-white/10 pr-6 p-1 rounded-full hover:bg-white/10 transition active:scale-95"
                            >
                                <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10">
                                    <img src={getImageUrl(person.profile_path)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition" alt={person.name} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">{person.name}</span>
                                    <span className="text-[8px] text-gray-500 font-bold uppercase">{person.character?.split(' (')[0].slice(0, 15)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {similar?.results?.length > 0 && <MovieRow title="More Like This" movies={similar.results} />}
            
            <div className="mt-20">
                <MovieReviews movieId={id} type={type} />
            </div>
          </div>

          <div className="space-y-10">
            <PremiumPromo />
            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-4 animate-pulse">⚡ ENGINE_TUNNEL</h3>
                <button 
                  onClick={() => setServer("vidlink")} 
                  className={`w-full p-6 rounded-3xl text-[12px] font-black uppercase transition border shadow-lg ${server === "vidlink" ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-blue-600/20'}`}
                >
                  🚀 Use VidLink Proxy
                </button>
            </div>

            <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 bg-gradient-to-br from-red-600/10 to-green-600/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                SERVER_PROTOCOL
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => setServer("pixel")} 
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === "pixel" ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-primary/10'}`}
                >
                    🚀 Pixel Server
                </button>
                <button 
                    onClick={() => setServer("alooy")} 
                    className={`p-4 rounded-2xl text-[10px] font-black uppercase transition border ${server === "alooy" ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-green-600/20'}`}
                >
                    🚀 Alooy Server
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
      <AnimatePresence>
        {isShareOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
            >
                <div className="max-w-md w-full bg-[#0b0b0b] border border-white/10 rounded-[40px] p-10 text-center relative shadow-2xl">
                    <button onClick={() => setIsShareOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">✕</button>
                    
                    <div className="mb-8">
                        <div className="h-20 w-20 bg-primary-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Share2 className="text-primary-600" size={40} />
                        </div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Share this {type === 'movie' ? 'Movie' : 'Series'}</h2>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">Help VOZ grow and earn 50 reward points!</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={async () => {
                                const url = window.location.href;
                                const text = `Watching "${item.title || item.name}" in 4K on VOZ! 🍿🎬`;
                                if (navigator.share) {
                                    await navigator.share({ title: "VOZ STREAM", text, url });
                                } else {
                                    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
                                }
                            }}
                            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-gray-200 transition"
                        >
                            <Send size={18} /> Send to Friends
                        </button>
                        <button 
                            onClick={() => {
                                const url = window.location.href;
                                const text = `Watching "${item.title || item.name}" in 4K on VOZ! 🍿🎬`;
                                window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
                            }}
                            className="w-full bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] py-5 rounded-2xl font-black uppercase text-xs hover:bg-[#229ED9]/20 transition"
                        >
                            Direct Telegram Share
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
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
