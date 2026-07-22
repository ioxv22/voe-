"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ExternalLink, X, Coffee, Crown, Sparkles, CheckCircle2, Zap, Smartphone, Apple } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [step, setStep] = useState<'intro' | 'payment'>('intro');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="max-w-4xl w-full bg-[#0b0b0b] border border-white/10 rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col md:flex-row min-h-[500px]"
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-600/10 opacity-50" />
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/30 hover:text-white transition z-20"
          >
            <X size={24} />
          </button>

          {/* Left Panel - The Hook */}
          <div className="w-full md:w-2/5 p-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between relative z-10">
            <div>
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <Crown className="text-primary" size={32} />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter metallic-text leading-none mb-4">VOZ VIP PROTOCOL</h2>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed">Unlock the ultimate streaming experience. Support the infrastructure and get premium perks.</p>
            </div>

            <div className="space-y-4 py-8">
               <Benefit text="Pure 4K Node Access" />
               <Benefit text="Zero Buffer Protocol" />
               <Benefit text="Priority Support Line" />
               <Benefit text="Ads-Free Forever" />
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase text-primary mb-1">Lifetime VIP Access</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black italic text-white">$2</span>
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest italic">One-Time Support</span>
                </div>
            </div>
          </div>

          {/* Right Panel - Action */}
          <div className="w-full md:w-3/5 p-10 lg:p-16 flex flex-col justify-center items-center text-center space-y-10 relative z-10">
            {step === 'intro' ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 w-full">
                <div className="space-y-2">
                    <Sparkles className="text-yellow-500 mx-auto" size={32} />
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Support & Unlock</h3>
                    <p className="text-white/40 text-sm font-medium italic">Help Hamad alabdolly keep VOZ STREAM alive and free for everyone!</p>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => setStep('payment')}
                        className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 transition shadow-2xl flex items-center justify-center gap-3"
                    >
                        <Zap size={18} fill="black" /> Support Now - $2
                    </button>

                    <button 
                        onClick={onClose}
                        className="w-full bg-white/5 border border-white/10 text-white/40 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition"
                    >
                        Continue to Video (Free Mode)
                    </button>
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                  Donations help us bypass ad-networks and provide 4K nodes
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 w-full">
                <button 
                  onClick={() => setStep('intro')}
                  className="text-primary text-[10px] font-black uppercase flex items-center gap-2 hover:translate-x-[-4px] transition mx-auto"
                >
                  ← Back
                </button>

                <div className="space-y-4">
                    <a 
                      href="https://creators.sa/h7madddd" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 transition shadow-2xl flex flex-col items-center gap-1"
                    >
                        <div className="flex items-center gap-2">
                             <Apple size={18} /> <CreditCard size={18} />
                        </div>
                        <span>Pay with Apple Pay / Card</span>
                    </a>

                    <a 
                      href="https://t.me/VOZSTREAM" 
                      target="_blank"
                      className="w-full bg-[#229ED9] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 transition shadow-2xl flex flex-col items-center gap-1"
                    >
                        <div className="flex items-center gap-2">
                             <Smartphone size={18} />
                        </div>
                        <span>Pay with Phone Credit (UAE)</span>
                    </a>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-primary italic leading-relaxed">
                        After payment, please send a screenshot to @VOZSTREAM on Telegram to activate your VIP status.
                    </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-white/60">
      <CheckCircle2 size={16} className="text-primary" />
      <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
    </div>
  );
}

function CreditCard(props: any) {
    return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
}

