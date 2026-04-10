"use client";

import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import LandingPage from "@/components/LandingPage";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { fetchTMDB, endpoints } from "@/lib/tmdb";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading: authLoading, signInWithGoogle, signInAsGuest } = useAuth();
  const { currentProfile, loading: profileLoading } = useProfile();
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
                setData((prev: any) => ({ ...prev, trending }));
                setLoadingContent(false);

                // Fetch Dedicated Rows
                const [latest, series, kids, topRated] = await Promise.all([
                    fetchTMDB(endpoints.movies, `${kidsParams}&sort_by=primary_release_date.desc`),
                    fetchTMDB(endpoints.series, kidsParams),
                    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"), // Anime for everyone
                    fetchTMDB(endpoints.topRated, kidsParams)
                ]);
                
                setData((prev: any) => ({ 
                    ...prev, 
                    latest: latest.results, 
                    series: series.results, 
                    kids: kids.results,
                    topRated: topRated.results
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

      <div className="relative z-30 -mt-16 lg:-mt-24 space-y-16">
        
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
        
        {/* NEW RELEASES */}
        {data?.latest && (
            <MovieRow 
                title={currentProfile.isKids ? "New for Kids" : "Latest Movies"} 
                movies={data.latest} 
            />
        )}

        {/* TV SERIES */}
        {data?.series && (
            <MovieRow 
                title={currentProfile.isKids ? "Fun Series" : "Latest TV Series"} 
                movies={data.series} 
            />
        )}

        {/* TOP RATED / KIDS PORTAL */}
        {data?.topRated && (
             <MovieRow 
                title={currentProfile.isKids ? "Best for Kids" : "Top Rated Content"} 
                movies={data.topRated} 
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
