"use client";

import { useEffect, useState } from "react";
import { Shield, Zap, Globe, Lock, CheckCircle, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VozTurbo() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [showPanel, setShowPanel] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("voz_turbo_mode") === "true";
        setIsEnabled(saved);
        if (saved) document.documentElement.classList.add("turbo-active");
    }, []);

    const toggleTurbo = () => {
        if (!isEnabled) {
            setIsConnecting(true);
            setTimeout(() => {
                setIsEnabled(true);
                setIsConnecting(false);
                localStorage.setItem("voz_turbo_mode", "true");
                document.documentElement.classList.add("turbo-active");
            }, 2000);
        } else {
            setIsEnabled(false);
            localStorage.setItem("voz_turbo_mode", "false");
            document.documentElement.classList.remove("turbo-active");
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button 
                onClick={() => setShowPanel(true)}
                className={`fixed left-6 bottom-24 z-[60] h-14 w-14 rounded-full flex items-center justify-center transition-all shadow-2xl ${isEnabled ? "bg-blue-600 shadow-blue-600/50" : "bg-white/10 backdrop-blur-xl border border-white/20"}`}
            >
                <Shield className={isEnabled ? "text-white animate-pulse" : "text-gray-400"} size={24} />
                {isEnabled && <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-black" />}
            </button>

            <AnimatePresence>
                {showPanel && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPanel(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 z-[80] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[80px] -z-10" />
                            
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className={`h-24 w-24 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${isEnabled ? "border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.3)]" : "border-white/10 bg-white/5"}`}>
                                    {isConnecting ? (
                                        <Zap className="text-blue-500 animate-spin" size={40} />
                                    ) : (
                                        <Shield className={isEnabled ? "text-blue-500" : "text-gray-500"} size={40} />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">VOZ_TURBO_VPN</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                        {isEnabled ? "Connected to High-Speed Encryption Tunnel" : "Direct Connection (Throttled by School)"}
                                    </p>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                                        <Globe className="text-blue-500 mb-2" size={16} />
                                        <p className="text-[10px] text-gray-500 uppercase font-black">Region</p>
                                        <p className="text-white text-xs font-bold uppercase">USA_TUNNEL</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                                        <Lock className="text-green-500 mb-2" size={16} />
                                        <p className="text-[10px] text-gray-500 uppercase font-black">Security</p>
                                        <p className="text-white text-xs font-bold uppercase">MILITARY_256</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={toggleTurbo}
                                    disabled={isConnecting}
                                    className={`w-full py-5 rounded-full font-black uppercase text-sm tracking-widest transition-all ${isEnabled ? "bg-red-600 text-white shadow-xl shadow-red-600/20" : "bg-blue-600 text-white shadow-2xl shadow-blue-600/30"}`}
                                >
                                    {isConnecting ? "SYNCHRONIZING..." : isEnabled ? "DISCONNECT_TUNNEL" : "ESTABLISH_CONNECTION"}
                                </button>

                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase">
                                    <Wifi size={12} /> {isEnabled ? "Optimized for Alef Networks" : "Alef Filter Active"}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
