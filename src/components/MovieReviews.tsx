 "use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { MessageSquare, Star, Send, Trash2, ShieldCheck } from "lucide-react";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  rating: number;
  createdAt: any;
  isVIP?: boolean;
}

export default function MovieReviews({ movieId, type }: { movieId: string | number, type: string }) {
  const { user } = useAuth();
  const { currentProfile } = useProfile();
  const [reviews, setReviews] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
        collection(db, "reviews"),
        where("movieId", "==", String(movieId)),
        orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
        setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return () => unsub();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentProfile || !input.trim()) return;
    setLoading(true);
    try {
        await addDoc(collection(db, "reviews"), {
            movieId: String(movieId),
            type,
            userId: user.uid,
            userName: currentProfile.name,
            userAvatar: currentProfile.avatar,
            text: input,
            rating,
            isVIP: !!user.isPremium || !!user.isVIP,
            createdAt: serverTimestamp()
        });
        setInput("");
        setRating(5);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
        <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 border border-primary-600/20">
                <MessageSquare size={20} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Community Reviews</h2>
        </div>

        {user ? (
            <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                            <Star 
                                key={s} 
                                size={18} 
                                className={`cursor-pointer transition-all ${rating >= s ? 'text-yellow-500 fill-yellow-500 scale-110' : 'text-gray-700'}`}
                                onClick={() => setRating(s)}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase">Rate this {type}</span>
                </div>
                <div className="relative">
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Share your thoughts with the VOZ community..."
                        className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-primary-600/50 transition resize-none h-32"
                    />
                    <button 
                        disabled={loading || !input.trim()}
                        className="absolute bottom-4 right-4 bg-primary-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-primary-700 disabled:opacity-50 transition shadow-lg shadow-primary-600/20"
                    >
                        {loading ? 'Posting...' : 'Post Review'}
                    </button>
                </div>
            </form>
        ) : (
            <div className="p-8 rounded-[40px] border border-white/5 bg-white/[0.01] text-center">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Sign in to leave a review</p>
            </div>
        )}

        <div className="space-y-6">
            {reviews.map(rev => (
                <div key={rev.id} className="p-8 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition relative group">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <img src={rev.userAvatar} className="h-12 w-12 rounded-2xl object-cover border border-white/10" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-black text-sm uppercase tracking-tight">{rev.userName}</p>
                                    {rev.isVIP && <ShieldCheck size={14} className="text-yellow-500" />}
                                </div>
                                <div className="flex gap-0.5 mt-1">
                                    {[1,2,3,4,5].map(s => (
                                        <Star key={s} size={10} className={rev.rating >= s ? 'text-yellow-500 fill-yellow-500' : 'text-gray-800'} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-[9px] font-black text-gray-700 uppercase">
                            {rev.createdAt?.toDate ? new Date(rev.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                        </span>
                    </div>
                    <p className="mt-6 text-gray-400 text-sm italic leading-relaxed">"{rev.text}"</p>
                </div>
            ))}
            {reviews.length === 0 && (
                <div className="text-center py-20 opacity-20">
                    <MessageSquare size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase">No reviews yet. Be the first!</p>
                </div>
            )}
        </div>
    </div>
  );
}
