"use client";

import { useState, useEffect } from "react";
import { Crown, Zap, ShieldCheck, Share2, Gem, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function VozVipModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, isPremium, activateVIP, requestVIP } = useAuth();
  const [step, setStep] = useState(1);
  const [shares, setShares] = useState(0);

  const handleShare = () => {
    const url = "https://vozstream.vercel.app";
    const text = "Watch the latest movies in 4K for free on VOZ STREAM! 🍿🎬";
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
    setShares(prev => prev + 1);
  };

  const handleClaim = async () => {
    if (shares >= 5) {
        await requestVIP();
        setStep(3);
    } else {
        alert(`You need ${5 - shares} more shares to claim VIP status!`);
    }
  };

  if (isPremium) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6"
        >
            <div className="relative max-w-2xl w-full bg-[#0b0b0b] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">✕</button>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 h-full min-h-[500px]">
                    {/* Left Sidebar - Perks */}
                    <div className="lg:col-span-2 bg-primary-600/5 border-r border-white/5 p-8 flex flex-col justify-center gap-8">
                        <h3 className="text-primary-500 font-black uppercase tracking-[0.3em] text-[10px]">VIP_PERKS</h3>
                        <Perk icon={<ShieldCheck size={18}/>} title="Ad-Free" desc="Zero interruptions forever." />
                        <Perk icon={<Zap size={18}/>} title="4K Ultra" desc="Priority high-bitrate nodes." />
                        <Perk icon={<Gem size={18}/>} title="Profiles" desc="Create up to 4 secure profiles." />
                    </div>

                    {/* Right Content - Actions */}
                    <div className="lg:col-span-3 p-10 flex flex-col justify-center text-center items-center">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <Crown size={64} className="text-yellow-500 mb-6 mx-auto animate-bounce" />
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Claim Your <span className="text-yellow-500">Crown</span></h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10 italic">Help VOZ grow to unlock the full premium experience for free.</p>
                                <button 
                                    onClick={() => setStep(2)}
                                    className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-sm hover:bg-gray-200 transition shadow-xl"
                                >
                                    Get Started
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                                <h2 className="text-3xl font-black uppercase italic mb-8">Share Progress</h2>
                                <div className="relative h-4 w-full bg-white/5 rounded-full mb-10 overflow-hidden border border-white/10">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(shares/5)*100}%` }}
                                        className="h-full bg-gradient-to-r from-primary-600 to-yellow-500" 
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase tracking-widest">{shares}/5 SHARES</span>
                                </div>
                                <div className="space-y-4">
                                    <button 
                                        onClick={handleShare}
                                        className="w-full bg-[#229ED9] text-white py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:scale-105 transition"
                                    >
                                        <Share2 size={16} /> Share on Telegram
                                    </button>
                                    <button 
                                        onClick={handleClaim}
                                        disabled={shares < 5}
                                        className={`w-full py-4 rounded-xl font-black uppercase text-xs transition ${shares >= 5 ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        Claim VIP Status
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                <CheckCircle2 size={64} className="text-green-500 mb-6 mx-auto" />
                                <h2 className="text-3xl font-black uppercase italic mb-4">Request Sent!</h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Our master node is verifying your shares. Your account will be upgraded within 24 hours.</p>
                                <button onClick={onClose} className="mt-10 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase hover:bg-white/10 transition">Understood</button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Perk({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 text-primary-500">{icon}</div>
            <div>
                <h4 className="text-xs font-black uppercase tracking-tighter text-white">{title}</h4>
                <p className="text-[10px] text-gray-500 leading-tight">{desc}</p>
            </div>
        </div>
    );
}
