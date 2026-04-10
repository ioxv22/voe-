"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export function useContinueWatching() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "history"), 
      orderBy("lastWatched", "desc"),
      limit(20)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const saveProgress = async (movie: any, progress: number = 0) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "history", String(movie.id)), {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        progress,
        lastWatched: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Error saving progress", e);
    }
  };

  return { history: items, saveProgress };
}
