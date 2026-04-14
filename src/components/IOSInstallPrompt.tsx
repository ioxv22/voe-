"use client";

import { useState, useEffect } from "react";
import { Share, X, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function IOSInstallPrompt() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Detect if it's iOS and NOT already in standalone mode
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIOS && !isStandalone) {
            // Show prompt after a short delay
            const timer = setTimeout(() => setShow(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-4 right-4 z-[100] bg-white text-black p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center"
            >
                <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-gray-400">
                    <X size={20} />
                </button>
                
                <div className="h-16 w-16 bg-black rounded-2xl mb-4 flex items-center justify-center p-2 border border-black/5">
                    <img src="https://i.ibb.co/23Bkgcrx/image.png" alt="VOZ" className="w-full h-full object-contain" />
                </div>

                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Install VOZ App</h3>
                <p className="text-xs text-gray-500 font-medium mb-6">Experience full-screen streaming without browser bars. It's fast and secure.</p>
                
                <div className="space-y-4 w-full text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="p-2 bg-blue-500 text-white rounded-lg"><Share size={14} /></div>
                        <span>1. Tap THE 'SHARE' button</span>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="p-2 bg-gray-200 text-black rounded-lg"><PlusSquare size={14} /></div>
                        <span>2. Select 'Add to Home Screen'</span>
                    </div>
                </div>

                <div className="mt-6 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10 }}
                        className="h-full bg-primary-600"
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
