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
  const [forceHideProgress, setForceHideProgress] = useState(false);
  const router = useRouter();

  // Safety timer to ensure we don't stay stuck on black screen if API is slow
  useEffect(() => {
    const timer = setTimeout(() => {
        setForceHideProgress(true);
    }, 8000); // 8 second grace period for high-volume loads
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && user && !profileLoading && !currentProfile) {
        router.push("/profiles");
    }
  }, [user, authLoading, currentProfile, profileLoading, router]);

  useEffect(() => {
    if (user && currentProfile) {
        async function load() {
            setLoadingContent(true);
            const isKids = currentProfile?.isKids;
            const kidsParams = isKids ? "with_genres=16,10751" : ""; 

            try {
                // Primary content for initial paint
                const trending = await fetchTMDB(endpoints.trending, isKids ? "with_genres=16" : "");
                setData((prev: any) => ({ ...prev, trending }));
                setLoadingContent(false);

                // Background secondary content
                const [movies, series, anime] = await Promise.all([
                    fetchTMDB(endpoints.movies, kidsParams),
                    fetchTMDB(endpoints.series, kidsParams),
                    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"),
                ]);
                setData((prev: any) => ({ ...prev, movies, series, anime }));
            } catch (err) {
                console.error("Content fetch failed", err);
                setLoadingContent(false);
            }
        }
        load();
    }
  }, [user, currentProfile]);

  // CLINICAL LOADING CHECK
  // 1. Initial State: Auth is still determining who you are
  if (authLoading) return <LoadingScreen />;

  // 2. Unauthenticated: Show landing/login immediately
  if (!user) return <LandingPage onSignIn={signInWithGoogle} onGuestSignIn={signInAsGuest} />;

  // 3. Profile Fetching: We know user exists, but wait for profile logic
  if (profileLoading && !forceHideProgress) return <LoadingScreen />;

  // 4. Redirect Case: User is logged in but hasn't picked a profile (ProfileContext logic handles this)
  if (!currentProfile) return <LoadingScreen />;

  // 5. Content Prep: Show loading until at least the Hero data exists
  if (loadingContent && !data?.trending && !forceHideProgress) return <LoadingScreen />;

  // If we reach here, we are ready to show the UI
  const featured = data?.trending?.results?.[0];

  return (
    <main className="min-h-screen bg-[#020202] pb-20 overflow-x-hidden">
      <Navbar />
      
      {featured && <Hero movie={featured} />}

      <div className="relative z-30 -mt-16 lg:-mt-24 space-y-12">
        {data?.trending && (
            <MovieRow 
                title={currentProfile?.isKids ? "Fun Adventures for You" : "Trending Now"} 
                movies={data.trending.results} 
            />
        )}
        
        {data?.movies && (
            <MovieRow 
                title={currentProfile?.isKids ? "Kids Movies" : "Popular Movies"} 
                movies={data.movies.results} 
            />
        )}

        {data?.series && (
            <MovieRow 
                title={currentProfile?.isKids ? "Animation Series" : "TV Shows"} 
                movies={data.series.results} 
            />
        )}
        
        {/* Contact/Telegram Highlight */}
        <div className="px-4 lg:px-12 pb-12">
            <div className="rounded-3xl bg-white/[0.03] backdrop-blur-md p-10 border border-white/5 flex flex-col items-start lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">Need Support?</h3>
                    <p className="text-gray-500 max-w-sm font-medium">Connect with the development team for content requests and technical assistance.</p>
                </div>
                <a 
                    href="https://t.me/iivoz" 
                    target="_blank" 
                    className="px-10 py-4 bg-primary-600 text-black font-black rounded-2xl hover:bg-primary-700 transition shadow-2xl shadow-primary-600/20 uppercase tracking-widest text-xs"
                >
                    Chat on Telegram @iivoz
                </a>
            </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
