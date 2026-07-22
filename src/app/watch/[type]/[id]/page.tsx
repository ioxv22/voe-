"use client";

import React, { Suspense, Component, useState, useEffect, use } from "react";
import { Download, ThumbsUp, ThumbsDown, Check, Plus, Share2, CheckCircle2, Play, Users, Send, Activity, Search, Settings, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { getSeriesSeasons, getSeasonEpisodes, getEpisodeDetails, getFullImageUrl as getDramaImageUrl } from "@/lib/drama-api";
import { fetchMovieDownload } from "@/lib/helm-api";
import SupportModal from "@/components/SupportModal";

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
  const initialServer = "nebula_classic"; // Set Nebula Classic as default as per user preference
  const isDrama = String(id).startsWith('drama_');
  
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
  const [isScanning, setIsScanning] = useState(true); // Start with scanning animation
  const [isPaused, setIsPaused] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [dramaEpisodeLinks, setDramaEpisodeLinks] = useState<any[]>([]);
  const [helmLink, setHelmLink] = useState<string | null>(null);
  const router = useRouter();

  // Auto-Start Nebula Classic logic
  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000); // Premium scan
    
    // Show support modal on every load for non-premium users to encourage payment
    if (!isPremium) {
        setIsSupportOpen(true);
    }

    return () => clearTimeout(timer);
  }, []);

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
            if (id.startsWith('drama_')) {
                const dramaId = id.replace('drama_', '');
                const seasons = await getSeriesSeasons(dramaId);
                // For drama, we'll fake the TMDB item structure
                if (seasons && seasons.length > 0) {
                    const title = searchParams.get('title') || "Arabic Series";
                    const item = {
                        id: id,
                        name: title,
                        title: title,
                        overview: "Premium Arabic Series source optimized for VOZ Engine.",
                        seasons: seasons.map((s: any) => ({
                            season_number: s.season_number,
                            id: s.id,
                            name: `Season ${s.season_number}`
                        })),
                        poster_path: null,
                        backdrop_path: null,
                        genres: [{ id: 1, name: "Arabic" }, { id: 2, name: "Drama" }],
                        vote_average: 8.5,
                        release_date: "2026",
                        isDrama: true
                    };
                    setData({ item, similar: { results: [] } });
                    setSeason(seasons[0].season_number);
                    saveProgress(item, 'tv');
                }
                return;
            }

            const [item, similar, credits] = await Promise.all([
              fetchTMDB(endpoints.details(type, id)),
              fetchTMDB(endpoints.similar(type, id)),
              fetchTMDB(`/${type}/${id}/credits`)
            ]);

                if (item) {
                    setData({ item, similar });
                    setCast(credits?.cast?.slice(0, 15) || []);
                    if (type === 'tv' && (item.seasons?.length || 0) > 0) {
                        const firstSeason = item.seasons.find((s: any) => s.season_number > 0) || item.seasons[0];
                        setSeason(firstSeason.season_number);
                    }
                    if (type === 'movie') {
                        saveProgress(item, 'movie');
                        // Check Helm API for movies
                        fetchMovieDownload(item.title || item.name).then(res => {
                            if (res?.download) setHelmLink(res.download);
                        });
                    }
                }
        } catch (err) {
            console.error(err);
        }
    }
    init();
  }, [type, id]);

  useEffect(() => {
    if (id.startsWith('drama_')) {
        const dramaId = id.replace('drama_', '');
        getSeriesSeasons(dramaId).then(seasons => {
            const currentS = seasons?.find((s: any) => s.season_number === season);
            if (currentS) {
                getSeasonEpisodes(currentS.id).then(eps => setEpisodes(eps || []));
            }
        });
        return;
    }
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
            document.title = `${title} (${year}) HD Online - VistaFlix`;
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
        if (event.data?.type === 'vidlink_paused') {
            setIsPaused(true);
        }
        if (event.data?.type === 'vidlink_played') {
            setIsPaused(false);
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Periodic Save (Every 15s or on Pause)
  useEffect(() => {
    if (savedTime > 0 && item) {
        const interval = setInterval(() => {
            saveProgress(item, type, season, episode, savedTime, duration);
        }, 15000);
        return () => clearInterval(interval);
    }
  }, [savedTime, item, type, season, episode, duration]);

  const [isDramaLoading, setIsDramaLoading] = useState(false);
  
  useEffect(() => {
      if (isDrama && episodes.length > 0) {
          const currentEp = episodes.find(e => e.episode_number === episode);
          if (currentEp) {
              setIsDramaLoading(true);
              getEpisodeDetails(currentEp.id).then(res => {
                  setDramaEpisodeLinks(res?.watch_links || []);
                  setIsDramaLoading(false);
              });
          }
      }
  }, [isDrama, id, episodes, episode]);

  const handleServerChange = (newServer: string) => {
      setIsScanning(true);
      setServer(newServer);
      setPlayerKey(k => k + 1);
      setTimeout(() => setIsScanning(false), 2500);
  };

  if (!item && !String(id).startsWith('drama_')) {
    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse font-mono">SYNCHRONIZING_VOZ_CORE...</p>
            </div>
        </div>
    );
  }


  // If drama, wait for item to be populated in init
  if (isDrama && !item) {
     return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse font-mono">DECODING_ARABIC_PROTOCOL...</p>
            </div>
        </div>
    );
  }


  const getDramaUrl = () => {
      if (dramaEpisodeLinks.length > 0) {
          return dramaEpisodeLinks[0].url; // Default to first link
      }
      return "";
  };

  const finalPlayerUrl = isDrama 
    ? getDramaUrl() 
    : (server === 'helm' && helmLink ? helmLink : getStreamUrl(type, String(id), season, episode, server, false, String(item?.original_language || "ar"), isPremium) + `&t=${Math.floor(savedTime)}`);

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* CINEMAOS DYNAMIC BACKDROP */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {(item?.backdrop_path || item?.poster_path) ? (
              <Image 
                src={getImageUrl(item.backdrop_path || item.poster_path, 'w780')}
                alt=""
                fill
                className="object-cover opacity-20 blur-[120px] transition-all duration-1000"
                priority
              />
          ) : (
              <div className="absolute inset-0 bg-primary/5 blur-[120px]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      </div>

      
      
      <div className={`relative z-10 transition-all duration-700 ${isCinemaMode ? 'pt-0' : 'pt-28 px-4 lg:px-12'} pb-20`}>
        <div className={`grid grid-cols-1 ${isCinemaMode ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-12`}>
          <div className={`${isCinemaMode ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-10`}>
            <div className={`relative group transition-all duration-700 overflow-hidden bg-black border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isCinemaMode ? 'h-[85vh] w-full rounded-none' : 'aspect-video w-full rounded-[2.5rem]'}`}>
                
                <AnimatePresence>
                    {isScanning && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[70] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center"
                        >
                            <div className="w-80 space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Initializing Node</p>
                                        <h3 className="text-xl font-black italic">NEBULA_PRIME_V4</h3>
                                    </div>
                                    <p className="text-xs font-mono text-primary animate-pulse">SYNCING_SUBTITLES...</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2.5, ease: "easeInOut" }}
                                            className="h-full bg-gradient-to-r from-primary-600 to-purple-600 shadow-[0_0_20px_rgba(20,184,166,0.6)]" 
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                                        <span>PIXEL_CORE_SYNC</span>
                                        <span>CLEANING_ADS_&_REDIRECTS...</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                    <iframe 
                        key={playerKey}
                        src={finalPlayerUrl} 
                        className="w-full h-full border-none" 
                        allowFullScreen 
                        allow="autoplay; encrypted-media; fullscreen *; picture-in-picture"
                        sandbox="allow-forms allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
                    />

                <div className="absolute top-10 left-10 right-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity z-50">
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

                <AnimatePresence>
                    {isPaused && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute inset-x-0 bottom-0 z-[65] p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"
                        >
                            <div className="max-w-3xl space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-20 w-14 rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
                                        <Image 
                                            src={getImageUrl(item?.poster_path, 'w185')} 
                                            alt="" 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-primary text-black px-2 py-0.5 rounded text-[8px] font-black uppercase">PAUSED</span>
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{item?.genres?.[0]?.name} • {String(item?.release_date || item?.first_air_date || "").slice(0, 4)}</span>
                                        </div>
                                        <h2 className="text-4xl font-black italic uppercase tracking-tighter italic metallic-text">{item?.title || item?.name}</h2>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm line-clamp-2 max-w-2xl italic leading-relaxed">{item?.overview}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>





            <div className={`flex flex-col lg:flex-row justify-between items-start gap-8 bg-white/[0.02] p-10 rounded-[40px] border border-white/5 ${isCinemaMode ? 'mx-4 lg:mx-12' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-primary text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase italic shadow-lg">4K ULTRA HD</span>
                    <span className="bg-white/10 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">IMDb {Number(item?.vote_average || 0).toFixed(1)}</span>
                    <span className="bg-white/10 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{item?.runtime || item?.episode_run_time?.[0] || '120'} MIN</span>
                </div>
                <h1 className="text-4xl lg:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none metallic-text">{String(item?.title || item?.name || "Loading...")}</h1>
                <div className="flex flex-wrap gap-2 mb-8">
                    {item?.genres?.map((g: any) => (
                        <span key={g.id} className="text-[10px] font-black uppercase text-gray-500 border border-white/10 px-4 py-2 rounded-full italic hover:text-white hover:border-white/30 transition">{g.name}</span>
                    ))}
                </div>
                <p className="text-gray-400 text-sm lg:text-lg italic line-clamp-3 leading-relaxed">{String(item?.overview || "No description available.")}</p>
                <div className="flex gap-6 mt-8 font-black italic text-gray-500 text-sm">
                    <span className="text-primary-500">📅 {String(item?.release_date || item?.first_air_date || "2026").slice(0, 4)}</span>
                    <span>🌍 {item?.production_countries?.[0]?.name || item?.origin_country?.[0] || 'Global'}</span>
                    <span>🎞️ {item?.status || 'Active'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <button 
                    onClick={() => item && toggleMyList(item)}
                    className={`h-20 px-10 rounded-3xl font-black uppercase text-xs transition-all transform active:scale-95 flex items-center gap-3 ${currentProfile?.myList?.some(m => m.id === item?.id) ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                >
                    {currentProfile?.myList?.some(m => m.id === item?.id) ? <CheckCircle2 size={20} className="text-green-600" /> : <Plus size={20} />}
                    {currentProfile?.myList?.some(m => m.id === item?.id) ? 'In My List' : 'Watchlist'}
                </button>

                <div className="flex items-center gap-1 p-2 bg-white/5 rounded-3xl border border-white/10 h-20">
                    <button 
                        onClick={() => item && toggleLike(item, true)}
                        className={`p-4 rounded-2xl transition-all ${currentProfile?.likes?.includes(item?.id) ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="I Like This"
                    >
                        <ThumbsUp size={20} fill={currentProfile?.likes?.includes(item?.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <button 
                        onClick={() => item && toggleLike(item, false)}
                        className={`p-4 rounded-2xl transition-all ${currentProfile?.dislikes?.includes(item?.id) ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        title="Not for me"
                    >
                        <ThumbsDown size={20} fill={currentProfile?.dislikes?.includes(item?.id) ? "currentColor" : "none"} />
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
                            if (!item) return;
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
                                <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 relative">
                                    <Image 
                                        src={getImageUrl(person.profile_path, 'w185')} 
                                        alt={person.name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition"
                                    />
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
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                    <Activity size={14} className="animate-pulse" /> PRIMARY_SOURCE_NODE
                </h3>
                <div className="space-y-4">
                    <button 
                      onClick={() => handleServerChange("nebula_classic")} 
                      className={`relative z-10 w-full p-6 rounded-3xl text-[12px] font-black uppercase transition border shadow-lg ${server === "nebula_classic" ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                      🚀 Nebula Classic (Favorite)
                    </button>

                    <button 
                      onClick={() => handleServerChange("nebula")} 
                      className={`relative z-10 w-full p-6 rounded-3xl text-[12px] font-black uppercase transition border shadow-lg ${server === "nebula" ? 'bg-white/10 text-white border-white/10' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                      🪐 Nebula Prime (Backup)
                    </button>
                    
                    <button 
                        onClick={() => handleServerChange("quantum")} 
                        className={`relative z-10 w-full p-6 rounded-3xl text-[12px] font-black uppercase transition border shadow-lg flex flex-col items-center justify-center gap-1 ${server === "quantum" ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20' : 'bg-white/5 border-white/5 text-purple-400 hover:text-white hover:bg-purple-600/10'}`}
                    >
                        <span className="flex items-center gap-2 font-black">⚛️ QUANTUM VIP</span>
                        <span className="text-[7px] opacity-80 font-bold">PREMIUM CINEMAOS SOURCE</span>
                    </button>

                    {helmLink && (
                        <button 
                            onClick={() => handleServerChange("helm")} 
                            className={`relative z-10 w-full p-6 rounded-3xl text-[12px] font-black uppercase transition border shadow-lg ${server === "helm" ? 'bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-600/20' : 'bg-white/5 border-white/5 text-orange-400 hover:text-white hover:bg-orange-600/10'}`}
                        >
                            🔥 Helm Source (Arabic)
                        </button>
                    )}

                    {id.startsWith('drama_') && dramaEpisodeLinks.map((link, idx) => (
                        <button 
                            key={idx}
                            onClick={() => {
                                setDramaEpisodeLinks([link]); // Set this link as the active one
                                setPlayerKey(k => k + 1);
                            }} 
                            className={`relative z-10 w-full p-4 rounded-3xl text-[10px] font-black uppercase transition border ${dramaEpisodeLinks[0]?.url === link.url ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/5 text-gray-400'}`}
                        >
                            Source {idx + 1} ({link.quality})
                        </button>
                    ))}
                </div>
            </div>

            {type === "tv" && (
                <div className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 space-y-8">
                    <div>
                        <h3 className="text-xs font-black uppercase mb-4 text-primary-500">SELECT_SEASON</h3>
                        <div className="flex flex-wrap gap-2">
                            {item?.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
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
        id={item?.id || id} 
        season={season} 
        episode={episode} 
        title={item?.title || item?.name || "Loading..."} 
        posterPath={item?.poster_path || ""}
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
                                if (!item) return;
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
                                if (!item) return;
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
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <Footer />
    </main>
  );
}

export default function WatchPage({ params }: { params: any }) {
  const [resolvedParams, setResolvedParams] = useState<{type: string, id: string} | null>(null);

  useEffect(() => {
    if (params instanceof Promise) {
        params.then(setResolvedParams);
    } else if (params) {
        setResolvedParams(params);
    }
  }, [params]);

  if (!resolvedParams) return <div className="min-h-screen bg-black" />;

  return (
    <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <WatchContent type={resolvedParams.type} id={resolvedParams.id} />
        </Suspense>
    </ErrorBoundary>
  );
}
