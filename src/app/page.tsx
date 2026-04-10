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
    // 1. Session Protection: If logged in but no profile, send to selection
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
                const kidsParams = isKids ? "with_genres=16,10751" : ""; 

                // Fetch essential data first
                const trending = await fetchTMDB(endpoints.trending, isKids ? "with_genres=16" : "");
                setData((prev: any) => ({ ...prev, trending }));
                setLoadingContent(false);

                // Load secondary rows in background
                const [movies, series, anime] = await Promise.all([
                    fetchTMDB(endpoints.movies, kidsParams),
                    fetchTMDB(endpoints.series, kidsParams),
                    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"),
                ]);
                setData((prev: any) => ({ ...prev, movies, series, anime }));
            } catch (err) {
                console.error("Home Data Load Failure:", err);
                setLoadingContent(false);
            }
        }
        load();
    }
  }, [user, currentProfile]);

  // CLINICAL STATE RESOLUTION
  if (authLoading || (user && profileLoading)) {
      return <LoadingScreen />;
  }

  if (!user) {
      return <LandingPage onSignIn={signInWithGoogle} onGuestSignIn={signInAsGuest} />;
  }

  if (!currentProfile) {
      // Re-trigger loading screen while redirecting
      return <LoadingScreen />;
  }

  // Show content only when trending data exists (or fallback)
  if (loadingContent && !data?.trending) {
      return <LoadingScreen />;
  }

  const featured = data?.trending?.results?.[0];

  return (
    <main className="min-h-screen bg-[#020202] pb-20 overflow-x-hidden selection:bg-primary-600 selection:text-white">
      <Navbar />
      
      {featured && <Hero movie={featured} />}

      <div className="relative z-30 -mt-16 lg:-mt-24 space-y-16">
        {data?.trending && (
            <MovieRow 
                title={currentProfile.isKids ? "Specially for Kids" : "Global Trending"} 
                movies={data.trending.results} 
            />
        )}
        
        {data?.movies && (
            <MovieRow 
                title={currentProfile.isKids ? "Top Animations" : "New On VOZ Movies"} 
                movies={data.movies.results} 
            />
        )}

        {data?.series && (
            <MovieRow 
                title={currentProfile.isKids ? "Series for You" : "Latest TV Series"} 
                movies={data.series.results} 
            />
        )}
        
        {/* Support Access */}
        <div className="px-4 lg:px-12 pb-12">
            <div className="rounded-[40px] bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-3xl p-12 border border-white/5 flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center justify-between gap-10">
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">VOZ STREAM SUPPORT</h3>
                    <p className="text-gray-500 max-w-sm font-medium leading-relaxed">Encountering playback issues or missing your favorite season? Contact the DXB protocol team.</p>
                </div>
                <a 
                    href="https://t.me/iivoz" 
                    target="_blank" 
                    className="px-12 py-5 bg-white text-black font-black rounded-full hover:bg-primary-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl shadow-white/5 uppercase tracking-[0.2em] text-[10px]"
                >
                    Chat on Telegram
                </a>
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
