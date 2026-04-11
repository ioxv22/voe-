"use client";

import Navbar from "@/components/Navbar";
import MovieRow from "@/components/MovieRow";
import { fetchTMDB, endpoints, getImageUrl } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import { Star, Clock, Calendar, Play, Plus, Check, ChevronDown, ShieldCheck, Radio, Users } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useEffect, useState } from "react";
import { getStreamUrl, SERVER_MAP } from "@/lib/stream";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function WatchPage({ params }: { params: any }) {
  const { user, isPremium } = useAuth();
  const [data, setData] = useState<{item: any, similar: any} | null>(null);
  const [server, setServer] = useState("nebula");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [activeSeasonTab, setActiveSeasonTab] = useState(1);
  const [key, setKey] = useState(0); 
  const [sidebarAd, setSidebarAd] = useState("");
  const [adFreeMode, setAdFreeMode] = useState(true); // Default to Ad-Free for everyone
  
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    async function init() {
        const resolvedParams = await params;
        const [resolvedItem, resolvedSimilar] = await Promise.all([
          fetchTMDB(endpoints.details(resolvedParams.type, resolvedParams.id)),
          fetchTMDB(endpoints.similar(resolvedParams.type, resolvedParams.id)),
        ]);
        setData({ item: resolvedItem, similar: resolvedSimilar });
        
        // Real-Time View Tracking Logic
        try {
            const statsRef = doc(db, "system", "stats");
            const statsSnap = await getDoc(statsRef);
            const currentViews = statsSnap.exists() ? (statsSnap.data().totalViews || 0) : 0;
            await setDoc(statsRef, { totalViews: currentViews + 1 }, { merge: true });
        } catch (e) { console.error("Stats Error:", e); }

        if (resolvedParams.type === "tv") {
            loadEpisodes(resolvedParams.id, 1);
        }

        const adsSnap = await getDoc(doc(db, "system", "ads"));
        if (adsSnap.exists()) setSidebarAd(adsSnap.data().sidebar || "");
    }
    init();
  }, [params]);

  const loadEpisodes = async (tvId: string, sNum: number) => {
    try {
        const seasonData = await fetchTMDB(`/tv/${tvId}/season/${sNum}`);
        setEpisodes(seasonData.episodes || []);
        setActiveSeasonTab(sNum);
    } catch (err) {
        console.error("Failed to load episodes", err);
    }
  };

  if (!data) return <div className="min-h-screen bg-black" />;
  const { item, similar } = data;
  const type = item.title ? "movie" : "tv";

  const toggleWatchlist = () => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const router = useRouter();

  const handleStartParty = async () => {
    if (!user) return alert("Please Sign In to start a party.");
    try {
      const docRef = await addDoc(collection(db, "rooms"), {
        name: `${user.displayName}'s Cinema`,
        hostId: user.uid,
        hostName: user.displayName,
        createdAt: serverTimestamp(),
        currentMovie: { id: item.id },
        currentType: type
      });
      router.push(`/rooms/${docRef.id}`);
    } catch (e) {
      alert("Failed to create party room.");
    }
  };

  const playerUrl = getStreamUrl(type, item.id, season, episode, server);

  return (
    <main className="min-h-screen bg-[#020202]">
      <Navbar />

      <div className="pt-24 lg:pt-28 px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl group">
            <iframe
              key={`${playerUrl}-${key}-${adFreeMode}`}
              src={playerUrl}
              className="h-full w-full"
              allowFullScreen
              // Ad-Free Mode strictly blocks all popups and navigation away from frame
              sandbox={adFreeMode 
                ? "allow-scripts allow-same-origin allow-forms allow-presentation" 
                : "allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-modals allow-top-navigation"
              }
            />
            
            {/* Ad-Block Controls */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
                <button 
                    onClick={() => setAdFreeMode(!adFreeMode)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border transition ${adFreeMode ? 'bg-green-600/20 text-green-500 border-green-600/30' : 'bg-red-600/20 text-red-500 border-red-600/30'}`}
                >
                    <ShieldCheck size={12} /> {adFreeMode ? "AD-BLOCK ON" : "AD-BLOCK OFF (Compatible)"}
                </button>
            </div>

            {/* Video Watermark Overlay (Rights) */}
            <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden select-none">
                <div className="absolute top-8 left-8 opacity-20 text-[10px] font-black text-white uppercase tracking-[0.5em] italic">
                    VOZ STREAM | OFFICIAL RIGHTS
                </div>
                <div className="absolute bottom-24 right-8 opacity-10 text-[40px] font-black text-white uppercase tracking-tighter italic select-none">
                    VOZ STREAM
                </div>
            </div>

            {!isPremium && (
                <div className="absolute top-4 right-4 z-40">
                    <a 
                        href="https://t.me/iivoz" 
                        target="_blank"
                        className="bg-primary-600/90 backdrop-blur-md text-[10px] font-black text-white px-3 py-1.5 rounded-full border border-white/20 hover:bg-primary-500 transition shadow-lg"
                    >
                        VIP STATUS 👑
                    </a>
                </div>
            )}
          </div>

          <div className="p-4 bg-blue-600/5 border border-blue-600/10 rounded-xl">
             <p className="text-[11px] text-blue-400 font-medium leading-relaxed">
                💡 <b>Tip:</b> If the video fails to load, click <b>"AD-BLOCK ON"</b> to toggle compatible mode. Many servers require popups to initialize the player correctly.
             </p>
          </div>

          {!isPremium && (
              <div className="bg-gradient-to-r from-yellow-600/10 to-transparent border border-yellow-600/20 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-600/20 flex items-center justify-center text-yellow-600 text-lg">👑</div>
                    <div>
                        <p className="text-sm font-bold text-white leading-tight">Support VOZ Stream</p>
                        <p className="text-[10px] text-gray-500">Enable advanced features & support Hamad Al-Abdouli.</p>
                    </div>
                </div>
                <a href="https://t.me/iivoz" target="_blank" className="bg-yellow-600 text-black px-4 py-2 rounded-md text-[10px] font-black uppercase hover:bg-yellow-500 transition">Contact @iivoz</a>
              </div>
          )}

          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <span className="text-xs font-bold text-gray-500 flex items-center mr-2 uppercase tracking-widest">Servers:</span>
            {Object.keys(SERVER_MAP).map((srv) => (
                <button
                    key={srv}
                    onClick={() => setServer(srv)}
                    className={`px-4 py-2 rounded-md text-xs font-bold transition ${server === srv ? 'bg-primary-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                    {srv.toUpperCase()}
                </button>
            ))}
          </div>

          {/* Interaction Bar: Share & Next Episode */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">Share VOZ:</span>
                  <a 
                    href={`https://wa.me/?text=Watch ${item.title || item.name} in HD on VOZ Stream! 🍿 https://vozstream.vercel.app/watch/${type}/${item.id}`} 
                    target="_blank"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.735-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  </a>
                  <a 
                    href={`https://t.me/share/url?url=https://vozstream.vercel.app/watch/${type}/${item.id}&text=Watch ${item.title || item.name} on VOZ Stream! 🚀`} 
                    target="_blank"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.462 8.357l-1.554 7.346c-.115.533-.426.66-.867.411l-2.368-1.745-1.141 1.1c-.126.126-.232.231-.476.231l.17-2.408 4.384-3.959c.191-.17-.042-.264-.297-.094l-5.418 3.41-2.333-.73c-.507-.158-.517-.507.106-.752l9.112-3.511c.421-.154.79.099.66.702z"/></svg>
                  </a>
                  <button 
                    onClick={handleStartParty}
                    className="h-9 px-4 flex items-center justify-center gap-2 rounded-full bg-primary-600/10 text-primary-500 hover:bg-primary-600 hover:text-white transition text-[10px] font-black uppercase"
                  >
                     <Users size={16} /> Start Party
                  </button>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Copied to clipboard!"); }}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
                  >
                     <Plus size={18} className="rotate-45" />
                  </button>
              </div>

              {type === "tv" && (
                  <button 
                    onClick={() => {
                        const nextEp = episodes.find(e => e.episode_number === episode + 1);
                        if (nextEp) {
                            setEpisode(episode + 1);
                            window.scrollTo({top: 0, behavior: 'smooth'});
                        } else {
                            alert("You've reached the end of this season! Stay tuned for more.");
                        }
                    }}
                    className="group bg-primary-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-500 transition shadow-xl"
                  >
                        Next Episode <Play size={14} fill="white" className="transition-transform group-hover:translate-x-1" />
                  </button>
              )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-white lg:text-5xl">
                    {item.title || item.name}
                </h1>
                <button 
                    onClick={toggleWatchlist}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                >
                    {isInWatchlist(item.id) ? <Check /> : <Plus />}
                </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={16} fill="currentColor" /> {item.vote_average.toFixed(1)}
                </div>
                {type === "tv" && <div className="text-primary-600 font-bold uppercase tracking-widest">Season {season} Episode {episode}</div>}
                <div className="flex items-center gap-1">
                    <Clock size={16} /> {item.runtime || item.episode_run_time?.[0] || "--"} min
                </div>
                <div className="flex items-center gap-1">
                    <Calendar size={16} /> {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)}
                </div>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-3xl">
                {item.overview}
            </p>
          </div>

          {type === "tv" && (
              <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Episodes</h3>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm">
                            Season {activeSeasonTab} <ChevronDown size={14} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-40 bg-[#0b0b0b] border border-white/10 rounded-md shadow-2xl scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition z-50">
                            {item.seasons?.map((s: any) => (
                                <button 
                                    key={s.id}
                                    onClick={() => loadEpisodes(item.id, s.season_number)}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition ${activeSeasonTab === s.season_number ? 'text-primary-600 font-bold' : ''}`}
                                >
                                    Season {s.season_number}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {episodes.map((ep: any) => (
                        <div 
                            key={ep.id}
                            onClick={() => { setSeason(activeSeasonTab); setEpisode(ep.episode_number); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                            className={`flex gap-4 p-3 rounded-xl border transition cursor-pointer group ${season === activeSeasonTab && episode === ep.episode_number ? 'bg-primary-600/20 border-primary-600/50' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                            <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                                <img src={getImageUrl(ep.still_path || item.backdrop_path)} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                                    <Play size={20} fill="white" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                                <h4 className="font-bold text-white truncate text-sm">EP{ep.episode_number}: {ep.name}</h4>
                                <p className="text-xs text-gray-400 line-clamp-2 mt-1">{ep.overview || "No overview available."}</p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
          )}
        </div>

        <div className="space-y-8">
            {sidebarAd && (
                <div 
                    className="rounded-xl border border-white/10 bg-white/5 p-4 overflow-hidden flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: sidebarAd }}
                />
            )}

            <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Star className="text-primary-600" size={18} fill="currentColor" /> Recommendations</h3>
                <div className="grid grid-cols-2 gap-4">
                    {similar.results.slice(0, 6).map((s: any) => (
                        <div key={s.id} className="group relative aspect-video overflow-hidden rounded-md cursor-pointer border border-white/5">
                            <img 
                                src={getImageUrl(s.backdrop_path)} 
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2 text-center">
                                <p className="text-[10px] font-bold text-white line-clamp-2">{s.title || s.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-12">
        <MovieRow title="More like this" movies={similar.results} />
      </div>
    </main>
  );
}
