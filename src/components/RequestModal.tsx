"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Film } from "lucide-react";

export default function RequestModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [movieName, setMovieName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieName.trim()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, "requests"), {
        movieName,
        status: "pending",
        timestamp: serverTimestamp()
      });
      alert("Movie request submitted! We'll add it soon.");
      setMovieName("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-card p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute right-6 top-6 text-gray-500 hover:text-white transition">
              <X size={24} />
            </button>

            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Film size={32} />
              </div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Request Content</h2>
              <p className="mt-2 text-sm text-muted">Can't find a movie or show? Tell us and we'll fetch it for you!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Movie or Series Name</label>
                <input
                  autoFocus
                  required
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  placeholder="e.g. Breaking Bad - Season 5"
                  className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white placeholder-gray-600 outline-none transition focus:border-primary/50 focus:bg-white/10"
                />
              </div>

              <button
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary py-4 font-black transition hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "SENDING..." : (
                  <>
                    <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    SUBMIT REQUEST
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
