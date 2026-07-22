'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Gift, CheckCircle } from 'lucide-react';

export default function SocialWelcome() {
    const [isVisible, setIsVisible] = useState(false);
    const [platform, setPlatform] = useState('');

    useEffect(() => {
        // التحقق من المصدر
        const source = localStorage.getItem('referral_source');
        const hasSeenWelcome = sessionStorage.getItem('has_seen_welcome');
        
        if (source && !hasSeenWelcome) {
            setPlatform(source);
            setIsVisible(true);
            
            // إخفاء الرسالة تلقائياً بعد 6 ثوانٍ
            const timer = setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('has_seen_welcome', 'true');
            }, 6500);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('has_seen_welcome', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 20, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md"
                >
                    <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 shadow-2xl shadow-primary-600/20">
                        {/* Background Animation Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-pulse" />
                        
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-600/20 p-3 rounded-2xl">
                                {platform === 'tiktok' ? <Sparkles className="text-primary-500" size={24} /> : <Gift className="text-secondary-500" size={24} />}
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="text-white font-black text-sm tracking-tight flex items-center gap-2">
                                    {platform === 'tiktok' ? 'WELCOME TIKTOK HERO!' : 
                                     platform === 'insta' ? 'HELLO INSTA FAMILY!' : 
                                     'EXCLUSIVE ACCESS ACTIVATED!'}
                                    <CheckCircle size={14} className="text-green-500" />
                                </h3>
                                <p className="text-gray-400 text-xs mt-1 leading-tight">
                                    Special server priority unlocked for your session. Enjoy 4K streaming!
                                </p>
                            </div>

                            <button 
                                onClick={handleClose}
                                className="text-gray-500 hover:text-white transition p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
