"use client";

import { motion } from "framer-motion";
import { ChevronRight, Mail, Lock, User } from "lucide-react";
import Logo from "./Logo";
import Footer from "./Footer";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage({ onSignIn, onGuestSignIn }: { onSignIn: () => void, onGuestSignIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
        if (isLogin) {
            await signInWithEmail(email, password);
        } else {
            await signUpWithEmail(email, password);
        }
    } catch (err: any) {
        setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black font-sans selection:bg-red-600 selection:text-white">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0 h-[100vh]">
        <div 
            className="h-full w-full bg-cover bg-center opacity-40 scale-105"
            style={{ backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-07018d22cd35/4305318b-4839-49cd-9a87-326db72b6cc4/SA-en-20230212-popsignuptwoweeks-perspective_alpha_website_large.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-4 lg:px-12">
        <Logo />
        <button 
            onClick={onSignIn}
            className="rounded bg-primary-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-primary-700 shadow-lg shadow-primary-600/20"
        >
          Sign In with Google
        </button>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-4 text-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            <div className="text-left space-y-6">
                <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-black text-white lg:text-8xl leading-[0.9]"
                >
                Watching is <br/><span className="text-primary-600">better</span> now.
                </motion.h1>
                <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-400 max-w-lg"
                >
                Join the premium community of VOZ STREAM. Experience 4K quality with no interruptions.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-4 pt-4"
                >
                    <button onClick={onSignIn} className="bg-white text-black px-8 py-4 rounded-md font-black uppercase text-sm hover:bg-gray-200 transition">Google Login</button>
                    <button onClick={onGuestSignIn} className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-md font-black uppercase text-sm hover:bg-white/10 transition">Try as Guest</button>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-auto"
            >
                <h2 className="text-2xl font-black mb-6 uppercase tracking-widest">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-xs text-red-500 bg-red-500/10 p-2 rounded">{error}</p>}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white outline-none focus:border-primary-600 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white outline-none focus:border-primary-600 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-primary-600 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-primary-700 transition shadow-lg shadow-primary-600/20">
                        {isLogin ? 'Enter' : 'Join Now'}
                    </button>
                </form>
                <p className="mt-6 text-sm text-gray-500">
                    {isLogin ? "Don't have an account?" : "Already a member?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-white font-bold hover:underline">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
                <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">Encrypted & Secure</p>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Sub Features */}
      <div className="relative z-10 border-t-8 border-white/10 bg-black py-20 px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-20 lg:grid-cols-2 items-center">
            <div className="space-y-4">
                <h2 className="text-4xl font-black text-white">Watch anywhere. <br/><span className="text-primary-600">Anytime.</span></h2>
                <p className="text-xl text-gray-400">Stream on your phone, tablet, laptop, and TV without paying more.</p>
            </div>
            <div className="flex justify-center">
                <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png" className="max-h-60" />
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
