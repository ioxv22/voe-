"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans selection:bg-red-600 selection:text-white">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <div 
            className="h-full w-full bg-cover bg-center opacity-40 scale-105"
            style={{ backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-07018d22cd35/4305318b-4839-49cd-9a87-326db72b6cc4/SA-en-20230212-popsignuptwoweeks-perspective_alpha_website_large.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex w-full items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-1 text-3xl font-black tracking-tighter text-primary-600">
          <span className="text-white">VOZ</span>
          <span className="bg-primary-600 px-1 text-black rounded-sm">STREAM</span>
        </div>
        <button 
            onClick={onSignIn}
            className="rounded bg-primary-600 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-primary-700"
        >
          Sign In
        </button>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-4xl font-black text-white lg:text-7xl"
        >
          Unlimited movies, TV shows, and more.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-xl text-white lg:text-2xl"
        >
          Watch anywhere. Cancel anytime at @iivoz.
        </motion.p>
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="mt-8 flex w-full max-w-2xl flex-col items-center gap-4 text-white lg:flex-row"
        >
          <p className="flex-1 text-lg">Ready to watch? Follow us on Telegram to stay updated.</p>
          <button 
            onClick={onSignIn}
            className="flex items-center gap-2 rounded bg-primary-600 px-8 py-3 text-2xl font-medium transition hover:bg-primary-700"
          >
            Get Started <ChevronRight size={24} />
          </button>
        </motion.div>
      </div>

      {/* Sub Features (Netflix Style Cards) */}
      <div className="relative z-10 border-t-8 border-white/10 bg-black py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-20 px-6 lg:grid-cols-2">
            <div className="space-y-4">
                <h2 className="text-4xl font-black text-white">Enjoy on your TV.</h2>
                <p className="text-xl text-white">Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
            </div>
            <div className="flex justify-center">
                <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png" className="max-h-60" />
            </div>
        </div>
      </div>
    </div>
  );
}
