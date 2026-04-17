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
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import MatchSchedule from "@/components/MatchSchedule";
import Link from "next/link";
import { Radio, Activity, Sparkles, Search } from "lucide-react";
import SocialWelcome from "@/components/SocialWelcome";


export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, signInAsGuest } = useAuth();
  const { currentProfile, loading: profileLoading } = useProfile();
  const { t } = useLanguage();
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
                const [latest, series, arabicSeries, anime, action, horror, topRated, kDrama, khaleeji, family] = await Promise.all([
                    fetchTMDB(endpoints.movies, `${kidsParams}&sort_by=primary_release_date.desc`),
                    fetchTMDB(endpoints.series, kidsParams),
                    fetchTMDB("/discover/tv", `with_original_language=ar&sort_by=popularity.desc`), // Broad Arabic Series
                    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"),
                    fetchTMDB("/discover/movie", "with_genres=28&sort_by=popularity.desc"), // Action
                    fetchTMDB("/discover/movie", "with_genres=27&sort_by=popularity.desc"), // Horror
                    fetchTMDB(endpoints.topRated, kidsParams),
                    fetchTMDB("/discover/tv", "with_original_language=ko&sort_by=popularity.desc"), // K-Drama
                    fetchTMDB("/discover/tv", "with_original_language=ar&with_origin_country=AE|SA|KW|QA|BH|OM&sort_by=popularity.desc"), // Khaleeji
                    fetchTMDB("/discover/movie", "with_genres=10751&sort_by=popularity.desc"), // Family
                ]);
                
                setData((prev: any) => ({ 
                    ...prev, 
                    latest: filterSafeContent(latest.results), 
                    series: filterSafeContent(series.results), 
                    arabicSeries: filterSafeContent(arabicSeries.results),
                    anime: filterSafeContent(anime.results),
                    action: filterSafeContent(action.results),
                    horror: filterSafeContent(horror.results),
                    topRated: filterSafeContent(topRated.results),
                    kDrama: filterSafeContent(kDrama.results),
                    khaleeji: filterSafeContent(khaleeji.results),
                    family: filterSafeContent(family.results)
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
      <SocialWelcome />
      <Navbar />

      
      {featured && <Hero movie={featured} />}

      <div className="relative z-30 -mt-16 lg:-mt-24 space-y-16 px-4 lg:px-12">
        {/* QUICK ACCESS BUTTONS (COMPACT) */}
        <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
            <Link href="/search/ai">
                <div className="group flex items-center gap-2 bg-primary-600 px-4 py-2.5 rounded-full shadow-lg hover:bg-primary-500 transition active:scale-95">
                    <Sparkles size={14} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Search AI</span>
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

        {/* KHALEEJI CONTENT */}
        {data?.khaleeji && data.khaleeji.length > 0 && (
            <MovieRow 
                title={`${t("khaleeji")} | مسلسلات خليجية`} 
                movies={data.khaleeji} 
                isHighlighted
            />
        )}

        {/* FAMILY CONTENT */}
        {data?.family && (
            <MovieRow 
                title={`${t("family")} | عائلي`} 
                movies={data.family} 
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

        {/* TOP RATED */}
        {data?.topRated && (
            <MovieRow 
                title="Cinematic Masterpieces | الأعلى تقييماً" 
                movies={data.topRated} 
            />
        )}

        {/* ANIME */}
        {data?.anime && (
             <MovieRow 
                title={currentProfile.isKids ? "Best for Kids" : "Anime Protocol | انمي"} 
                movies={data.anime} 
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

        {/* K-DRAMA */}
        {data?.kDrama && (
            <MovieRow 
                title="Korean Dramas | مسلسلات كورية" 
                movies={data.kDrama} 
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
