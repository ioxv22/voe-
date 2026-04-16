 "use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Zap, Shield, Globe } from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  id: string | number;
  season?: number;
  episode?: number;
  title: string;
}

export default function DownloadModal({ isOpen, onClose, type, id, season, episode, title }: DownloadModalProps) {
  const mirrors = [
    { 
        name: "VidLink Mirror", 
        url: `https://vidlink.pro/download/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`,
        icon: <Zap size={16} className="text-yellow-500" />,
        desc: "High speed, multi-quality direct links"
    },
    { 
        name: "Vidsrc Pro Mirror", 
        url: `https://vidsrc.pro/download/${type}/${id}${type === 'tv' ? `/${season}/${episode}` : ''}`,
        icon: <Shield size={16} className="text-blue-500" />,
        desc: "Secure encrypted download tunnel"
    },
    { 
        name: "Vidsrc Me Mirror", 
        url: type === 'movie' ? `https://vidsrc.me/download/movie?tmdb=${id}` : `https://vidsrc.me/download/tv?tmdb=${id}&s=${season}&e=${episode}`,
        icon: <Globe size={16} className="text-green-500" />,
        desc: "Legacy server with high availability"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary-600/10 to-transparent">
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Download Center</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 line-clamp-1">{title}</p>
              </div>
              <button onClick={onClose} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div className="p-6 space-y-4">
                <div className="bg-primary-600/10 border border-primary-600/20 p-4 rounded-2xl mb-6">
                    <p className="text-[10px] font-black uppercase text-primary-500 leading-relaxed text-center">
                        Note: If a mirror shows 404, please try another one from the list below.
                    </p>
                </div>

                {mirrors.map((m, i) => (
                    <a 
                        key={i} 
                        href={m.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-primary-500/50 hover:bg-white/10 transition-all active:scale-95"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center border border-white/10">
                                {m.icon}
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest">{m.name}</h3>
                                <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">{m.desc}</p>
                            </div>
                        </div>
                        <Download size={18} className="text-gray-500 group-hover:text-white transition group-hover:translate-y-1" />
                    </a>
                ))}
            </div>

            {/* Footer */}
            <div className="p-8 bg-black/40 text-center">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">VOZ STREAM | SECURE_DL_BYPASS</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
