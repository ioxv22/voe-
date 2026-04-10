"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users", user.uid, "watchlist"), orderBy("addedAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWatchlist(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addToWatchlist = async (movie: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "watchlist", String(movie.id)), {
        ...movie,
        addedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Error adding to watchlist", e);
    }
  };

  const removeFromWatchlist = async (movieId: string | number) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "watchlist", String(movieId)));
    } catch (e) {
      console.error("Error removing from watchlist", e);
    }
  };

  const isInWatchlist = (movieId: string | number) => {
    return watchlist.some(item => String(item.id) === String(movieId));
  };

  return { watchlist, loading, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
