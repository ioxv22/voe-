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
    if (!authLoading && user && !profileLoading && !currentProfile) {
        router.push("/profiles");
    }
  }, [user, authLoading, currentProfile, profileLoading]);

  useEffect(() => {
    if (user && currentProfile) {
        async function load() {
            setLoadingContent(true);
            const isKids = currentProfile?.isKids;
            const kidsParams = isKids ? "with_genres=16,10751" : ""; 

            try {
                // Fetch basic data first for Hero (faster initial load)
                const trending = await fetchTMDB(endpoints.trending, isKids ? "with_genres=16" : "");
                setData((prev: any) => ({ ...prev, trending }));
                setLoadingContent(false); // Show Hero immediately

                // Fetch the rest in the background
                const [movies, series, anime] = await Promise.all([
                    fetchTMDB(endpoints.movies, kidsParams),
                    fetchTMDB(endpoints.series, kidsParams),
                    fetchTMDB(endpoints.anime, "with_genres=16&with_original_language=ja"),
                ]);
                setData((prev: any) => ({ ...prev, movies, series, anime }));
            } catch (err) {
                console.error("Content load failed", err);
                setLoadingContent(false);
            }
        }
        load();
    }
  }, [user, currentProfile]);

  if (authLoading || profileLoading) return <LoadingScreen />;

  if (!user) return <LandingPage onSignIn={signInWithGoogle} onGuestSignIn={signInAsGuest} />;

  if (!currentProfile) return <LoadingScreen />;

  // Display partial data if trending is loaded
  if (loadingContent && !data?.trending) return <LoadingScreen />;

  const featured = data?.trending?.results?.[0];

  return (
    <main className="min-h-screen bg-[#020202] pb-20">
      <Navbar />
      
      {featured && <Hero movie={featured} />}

      <div className="-mt-16 relative z-30 lg:-mt-24">
        {data?.trending && (
            <MovieRow 
                title={currentProfile.isKids ? "Fun Adventures for You" : "Trending Now"} 
                movies={data.trending.results} 
            />
        )}
        
        {data?.movies && (
            <MovieRow 
                title={currentProfile.isKids ? "Kids Movies" : "Popular Movies"} 
                movies={data.movies.results} 
            />
        )}

        {data?.series && (
            <MovieRow 
                title={currentProfile.isKids ? "Animation Series" : "TV Shows"} 
                movies={data.series.results} 
            />
        )}
        
        {/* Contact/Telegram Highlight */}
        <div className="mt-12 px-4 lg:px-12">
            <div className="rounded-xl bg-gradient-to-r from-blue-600/20 to-transparent p-8 border border-white/5 flex flex-col items-start lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Need Help or Content Requests?</h3>
                    <p className="text-gray-400 max-w-md">Contact us directly on Telegram for fast support and site updates.</p>
                </div>
                <a 
                    href="https://t.me/iivoz" 
                    target="_blank" 
                    className="px-8 py-3 bg-[#0088cc] text-white font-bold rounded-full hover:scale-105 transition shadow-lg shadow-blue-500/20"
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
