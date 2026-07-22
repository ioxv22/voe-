"use client";

import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import LandingPage from "@/components/LandingPage";
import LoadingScreen from "@/components/LoadingScreen";

import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints, filterSafeContent } from "@/lib/tmdb";
import { getFilteredSeries as fetchDramaSeries } from "@/lib/drama-api";
import DramaRow from "@/components/DramaRow";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Send } from "lucide-react";
import { MovieRowSkeleton, HeroSkeleton } from "@/components/Skeletons";

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, signInAsGuest } = useAuth();
  const { currentProfile, loading: profileLoading } = useProfile();
  const { t } = useLanguage();
  const { history } = useContinueWatching();
  const [data, setData] = useState<any>(null);
  const [dramaData, setDramaData] = useState<any>(null);
  const [featuredAnime, setFeaturedAnime] = useState<any[]>([]);
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
                const kidsParams = isKids ? "with_genres=16,35,10751" : ""; 

                const trending = await fetchTMDB(endpoints.trending, isKids ? "with_genres=16" : "");
                setData((prev: any) => ({ ...prev, trending: { ...trending, results: filterSafeContent(trending.results) } }));
                setLoadingContent(false);

                const [latest, series, arabicSeries, anime, action, horror, topRated, turkish, khaleeji, ramadan, spyFamily, netflix, shahid] = await Promise.all([
                    fetchTMDB(endpoints.movies, `${kidsParams}&sort_by=primary_release_date.desc`),
                    fetchTMDB(endpoints.series, kidsParams),
                    fetchTMDB("/discover/tv", `with_original_language=ar&sort_by=popularity.desc`), 
                    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"),
                    fetchTMDB("/discover/movie", "with_genres=28&sort_by=popularity.desc"), 
                    fetchTMDB("/discover/movie", "with_genres=27&sort_by=popularity.desc"), 
                    fetchTMDB(endpoints.topRated, kidsParams),
                    fetchTMDB("/discover/tv", "with_original_language=tr&sort_by=popularity.desc"), 
                    fetchTMDB("/discover/tv", "with_original_language=ar&with_origin_country=AE|SA|KW|QA|BH|OM&sort_by=popularity.desc"), 
                    fetchTMDB("/discover/tv", `with_original_language=ar&first_air_date_year=2026&sort_by=popularity.desc`), 
                    fetchTMDB("/tv/120089", ""),
                    fetchTMDB("/discover/movie", "with_watch_providers=8&watch_region=SA&sort_by=popularity.desc"),
                    fetchTMDB("/discover/tv", "with_watch_providers=1751&watch_region=SA&sort_by=popularity.desc"),
                ]);
                
                if (spyFamily) {
                     setFeaturedAnime([spyFamily]);
                }
                
                setData((prev: any) => ({ 
                    ...prev, 
                    latest: filterSafeContent(latest.results), 
                    series: filterSafeContent(series.results), 
                    arabicSeries: filterSafeContent(arabicSeries.results),
                    anime: filterSafeContent(anime.results),
                    action: filterSafeContent(action.results),
                    horror: filterSafeContent(horror.results),
                    topRated: filterSafeContent(topRated.results),
                    turkish: filterSafeContent(turkish.results),
                    khaleeji: filterSafeContent(khaleeji.results),
                    ramadan: filterSafeContent(ramadan.results),
                    netflix: filterSafeContent(netflix.results),
                    shahid: filterSafeContent(shahid.results),
                    top10: filterSafeContent(trending.results).slice(0, 10)
                }));

                const [dramaTrending, dramaNewest, dramaTopRated, dramaKhaleeji, dramaEgyptian] = await Promise.all([
                    fetchDramaSeries("most_viewed", 12),
                    fetchDramaSeries("newest", 12),
                    fetchDramaSeries("top_rated", 12),
                    fetchDramaSeries("most_viewed", 12, "KW"),
                    fetchDramaSeries("most_viewed", 12, "EG")
                ]);

                setDramaData({
                    trending: dramaTrending,
                    newest: dramaNewest,
                    topRated: dramaTopRated,
                    khaleeji: dramaKhaleeji,
                    egyptian: dramaEgyptian
                });
            } catch (err) {
                console.error("VistaFlix Home Load Failure:", err);
                setLoadingContent(false);
            }
        }
        load();
    }
  }, [user, currentProfile]);

  if (authLoading || (user && profileLoading)) return <LoadingScreen />;
  if (!user) return <LandingPage onSignIn={signInWithGoogle} onGuestSignIn={signInAsGuest} />;
  
  if (loadingContent) {
    return (
      <main className="min-h-screen bg-[#050505]">
        <HeroSkeleton />
        <div className="relative z-30 -mt-16 lg:-mt-24 space-y-4">
          <MovieRowSkeleton />
          <MovieRowSkeleton />
          <MovieRowSkeleton />
        </div>
      </main>
    );
  }

  const featured = data?.trending?.results?.[0];

  return (
    <main className="min-h-screen bg-[#050505] bg-mesh pb-20 overflow-x-hidden text-white select-none" dir="rtl">

      {featured && <Hero movie={featured} />}

      <div className="relative z-30 -mt-16 lg:-mt-24 space-y-14">
        
        {/* QUICK AI SEARCH BUTTON */}
        <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start px-6 lg:px-16">
            <Link href="/search">
                <div className="group flex items-center gap-2 bg-[#111114] border border-[#25252B] hover:border-[#E50924]/60 px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition active:scale-95">
                    <Sparkles size={15} className="text-[#E50924]" />
                    <span className="text-xs font-bold text-white">البحث الذكي في VistaFlix</span>
                </div>
            </Link>
        </div>

        {/* CONTINUE WATCHING */}
        {(history && history.length > 0) && (
            <MovieRow 
                title="أكمل المشاهدة" 
                movies={history}
                isHighlighted
            />
        )}

        {/* TOP 10 IN VISTAFLIX */}
        {data?.top10 && (
            <MovieRow 
                title="توب 10 في VistaFlix اليوم" 
                movies={data.top10} 
                isTop10
            />
        )}

        {/* MY LIST */}
        {currentProfile?.myList && currentProfile.myList.length > 0 && (
            <MovieRow 
                title="قائمتي المفضلة" 
                movies={currentProfile.myList} 
            />
        )}

        {/* DRAMA API - KHALEEJI & ARABIC PREMIUM */}
        {dramaData?.trending && (
            <DramaRow 
                title="حصريات VistaFlix العربية" 
                series={dramaData.trending}
                isHighlighted
            />
        )}

        {/* RAMADAN 2026 SPECIAL */}
        {data?.ramadan && data.ramadan.length > 0 && (
            <MovieRow 
                title="مسلسلات رمضان 2026" 
                movies={data.ramadan} 
            />
        )}

        {/* NEW RELEASES */}
        {data?.latest && (
            <MovieRow 
                title={currentProfile?.isKids ? "جديد للأطفال" : "أحدث الأفلام والمسلسلات"} 
                movies={data.latest} 
            />
        )}

        {/* ARABIC TV HITS */}
        {data?.arabicSeries && data.arabicSeries.length > 0 && (
            <MovieRow 
                title="مسلسلات عربية مميزة" 
                movies={data.arabicSeries} 
            />
        )}

        {dramaData?.khaleeji && dramaData.khaleeji.length > 0 && (
            <DramaRow 
                title="روائع الدراما الخليجية" 
                series={dramaData.khaleeji}
                isHighlighted
            />
        )}

        {dramaData?.egyptian && dramaData.egyptian.length > 0 && (
            <DramaRow 
                title="نبض الدراما المصرية" 
                series={dramaData.egyptian}
            />
        )}

        {/* NETFLIX HUB */}
        {data?.netflix && data.netflix.length > 0 && (
            <MovieRow 
                title="أحدث أختيارات نتفلكس" 
                movies={data.netflix} 
            />
        )}

        {/* SHAHID HUB */}
        {data?.shahid && data.shahid.length > 0 && (
            <MovieRow 
                title="إنتاجات شاهد VIP" 
                movies={data.shahid} 
            />
        )}

        {/* TURKISH DRAMA */}
        {data?.turkish && (
            <MovieRow 
                title="الدراما التركية المترجمة" 
                movies={data.turkish} 
            />
        )}

        {/* TOP RATED */}
        {data?.topRated && (
            <MovieRow 
                title="الأعلى تقييماً عالمياً" 
                movies={data.topRated} 
            />
        )}

        {/* ANIME */}
        {data?.anime && (
             <MovieRow 
                title={currentProfile?.isKids ? "أنمي للأطفال" : "عالم الأنمي الياباني"} 
                movies={data.anime} 
            />
        )}

        {/* ACTION */}
        {data?.action && (
            <MovieRow 
                title="أفلام الحركة والأكشن" 
                movies={data.action} 
            />
        )}

        {/* HORROR */}
        {data?.horror && (
            <MovieRow 
                title="أفلام الرعب والغموض" 
                movies={data.horror} 
            />
        )}

        {/* Telegram Support Highlighting */}
        <div className="px-6 lg:px-16 pb-12">
            <div className="bg-[#171717] p-8 md:p-12 rounded-[24px] border border-[#333333] flex flex-col items-center text-center lg:flex-row lg:text-right justify-between gap-8 shadow-xl">
                <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black text-white">الدعم الفني والطلب في VistaFlix</h3>
                    <p className="text-sm text-[#B3B3B3] max-w-lg leading-relaxed">تجهتك مشكلة في التشغيل أو تود طلب فيلم أو مسلسل غير موجود؟ تواصل مباشرة مع فريقنا عبر تلغرام.</p>
                </div>
                <a 
                    href="https://t.me/VOZSTREAM" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary py-4 px-8 rounded-2xl text-xs font-bold whitespace-nowrap"
                >
                    <Send size={16} /> تواصل عبر تلغرام
                </a>
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
