"use client";

import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import LandingPage from "@/components/LandingPage";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, filterSafeContent } from "@/lib/tmdb";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Radio, Activity, Sparkles, Search } from "lucide-react";

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, signInAsGuest } = useAuth();
  const { currentProfile, loading: profileLoading } = useProfile();
  const { history } = useContinueWatching();
  const [data, setData] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !profileLoading && user && !currentProfile) {
        router.replace("/profiles");
    }
  }, [user, authLoading, currentProfile, profileLoading, router]);

  useEffect(() => {
    if (user && currentProfile) {
        async function load() {
            setLoadingContent(true);
            try {
                const isKids = currentProfile?.isKids;
                const kidsParams = isKids ? "with_genres=16,35,10751" : ""; // Animation, Comedy, Family for Kids

                // Fetch essential data for Hero
                const trending = await fetchTMDB(endpoints.trending, isKids ? "with_genres=16" : "");
                setData((prev: any) => ({ ...prev, trending: { ...trending, results: filterSafeContent(trending.results) } }));
                setLoadingContent(false);

                // Fetch Dedicated Rows
                const [latest, series, arabicSeries, kids, action, horror, kDrama] = await Promise.all([
                    fetchTMDB(endpoints.movies, `${kidsParams}&sort_by=primary_release_date.desc`),
                    fetchTMDB(endpoints.series, kidsParams),
                    fetchTMDB("/discover/tv", `with_original_language=ar&sort_by=popularity.desc`), // Broad Arabic Series
                    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"),
                    fetchTMDB("/discover/movie", "with_genres=28&sort_by=popularity.desc"), // Action
                    fetchTMDB("/discover/movie", "with_genres=27&sort_by=popularity.desc"), // Horror
                    fetchTMDB("/discover/tv", "with_original_language=ko&sort_by=popularity.desc") // K-Drama
                ]);
                
                setData((prev: any) => ({ 
                    ...prev, 
                    latest: filterSafeContent(latest.results), 
                    series: filterSafeContent(series.results), 
                    arabicSeries: filterSafeContent(arabicSeries.results),
                    kids: filterSafeContent(kids.results),
                    action: filterSafeContent(action.results),
                    horror: filterSafeContent(horror.results),
                    kDrama: filterSafeContent(kDrama.results)
                }));
            } catch (err) {
                console.error("Home Data Load Failure:", err);
                setLoadingContent(false);
            }
        }
        load();
    }
  }, [user, currentProfile]);

  if (authLoading || (user && profileLoading)) return <LoadingScreen />;
  if (!user) return <LandingPage onSignIn={signInWithGoogle} onGuestSignIn={signInAsGuest} />;
  if (!currentProfile) return <LoadingScreen />;

  const featured = data?.trending?.results?.[0];

  return (
    <main className="min-h-screen bg-[#020202] pb-20 overflow-x-hidden selection:bg-primary-600 selection:text-white">
      <Navbar />
      
      {featured && <Hero movie={featured} />}

      <div className="relative z-30 -mt-16 lg:-mt-24 space-y-16 px-4 lg:px-12">
        {/* QUICK ACCESS BUTTONS */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 justify-center lg:justify-start">
            <Link href="/live">
                <div className="group relative overflow-hidden bg-red-600 px-8 py-5 rounded-[24px] shadow-2xl shadow-red-600/20 cursor-pointer transition hover:scale-105 active:scale-95 flex items-center gap-4 min-w-[240px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white relative z-10">
                        <Radio size={24} className="animate-pulse" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 leading-none mb-1">Live Protocol</p>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-white leading-none">Bثوث مبايرة TV</h3>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition">
                        <Activity size={80} />
                    </div>
                </div>
            </Link>

            <Link href="/live">
                <div className="group relative overflow-hidden bg-green-600 px-8 py-5 rounded-[24px] shadow-2xl shadow-green-600/20 cursor-pointer transition hover:scale-105 active:scale-95 flex items-center gap-4 min-w-[240px]" onClick={() => { localStorage.setItem('voz_live_tab', 'sports') }}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white relative z-10">
                        <Activity size={24} className="animate-bounce" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 leading-none mb-1">Real-time Stream</p>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-white leading-none">بثوث كورة LIVE</h3>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition">
                        <Radio size={80} />
                    </div>
                </div>
            </Link>

            <Link href="/search/ai">
                <div className="group relative overflow-hidden bg-primary-600 px-8 py-5 rounded-[24px] shadow-2xl shadow-primary-600/20 cursor-pointer transition hover:scale-105 active:scale-95 flex items-center gap-4 min-w-[240px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white relative z-10">
                        <Sparkles size={24} className="animate-spin-slow" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 leading-none mb-1">Natural Language</p>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-white leading-none">البحث الذكي AI</h3>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition">
                        <Search size={80} />
                    </div>
                </div>
            </Link>
        </div>
        
        {/* MY LIST - PERSISTENT COLLECTION */}
        {currentProfile.myList && currentProfile.myList.length > 0 && (
            <MovieRow 
                title="My List" 
                movies={currentProfile.myList} 
                isHighlighted 
            />
        )}

        {/* TRENDING ROW */}
        {data?.trending && (
            <MovieRow 
                title={currentProfile.isKids ? "Hot Animations" : "Trending on VOZ"} 
                movies={data.trending.results} 
            />
        )}
        
        {/* CONTINUE WATCHING */}
        {(history && history.length > 0) && (
            <MovieRow 
                title="Continue Watching" 
                movies={history}
                isHighlighted
            />
        )}
        
        {/* NEW RELEASES */}
        {data?.latest && (
            <MovieRow 
                title={currentProfile.isKids ? "New for Kids" : "Latest Movies"} 
                movies={data.latest} 
            />
        )}

        {/* ARABIC SERIES */}
        {data?.arabicSeries && data.arabicSeries.length > 0 && (
            <MovieRow 
                title="Arabic TV Hits | مسلسلات عربية" 
                movies={data.arabicSeries} 
                isHighlighted
            />
        )}

        {/* K-DRAMA */}
        {data?.kDrama && (
            <MovieRow 
                title="Korean Dramas | مسلسلات كورية" 
                movies={data.kDrama} 
            />
        )}

        {/* ACTION */}
        {data?.action && (
            <MovieRow 
                title="Adrenaline Rush | أفلام أكشن" 
                movies={data.action} 
            />
        )}

        {/* TV SERIES */}
        {data?.series && (
            <MovieRow 
                title={currentProfile.isKids ? "Fun Series" : "Binge-worthy TV Series"} 
                movies={data.series} 
            />
        )}

        {/* HORROR */}
        {data?.horror && (
            <MovieRow 
                title="Nightmare Fuel | أفلام رعب" 
                movies={data.horror} 
            />
        )}

        {/* ANIME / KIDS */}
        {data?.kids && (
             <MovieRow 
                title={currentProfile.isKids ? "Best for Kids" : "Popular Anime"} 
                movies={data.kids} 
            />
        )}
        
        {/* Telegram Support Highlighting */}
        <div className="px-4 lg:px-12 pb-12">
            <div className="rounded-[40px] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-3xl p-12 border border-white/5 flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center justify-between gap-10">
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Support Protocol</h3>
                    <p className="text-gray-500 max-w-sm font-medium leading-relaxed">Having issues with "My List" or searching for a specific movie? Contact our team on Telegram.</p>
                </div>
                <a 
                    href="https://t.me/iivoz" 
                    target="_blank" 
                    className="px-12 py-5 bg-primary-600 text-black font-black rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-2xl shadow-primary-600/30 uppercase tracking-[0.2em] text-[10px]"
                >
                    Connect @IIVOZ
                </a>
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
