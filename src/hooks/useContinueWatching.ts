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
import { checkAchievements } from "@/lib/achievements";
import { getDoc } from "firebase/firestore";

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
    }, (error) => {
      console.warn("Continue Watching Sync Failed (Permissions):", error.message);
    });

    return () => unsubscribe();
  }, [user]);

  const saveProgress = async (movie: any, mediaType: string, season?: number, episode?: number) => {
    if (!user) {
        // ... (local storage fallback remains the same)
        const history = JSON.parse(localStorage.getItem("voz_history") || "[]");
        const newItem = {
            id: movie.id,
            media_type: mediaType,
            title: movie.title || movie.name,
            name: movie.title || movie.name,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            season,
            episode,
            lastWatched: new Date().toISOString(),
        };
        const filtered = history.filter((h: any) => h.id !== movie.id).slice(0, 19);
        localStorage.setItem("voz_history", JSON.stringify([newItem, ...filtered]));
        return;
    }

    try {
      const historyRef = doc(db, "users", user.uid, "history", String(movie.id));
      await setDoc(historyRef, {
        id: movie.id,
        media_type: mediaType,
        title: movie.title || movie.name,
        name: movie.title || movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        season: season || null,
        episode: episode || null,
        lastWatched: new Date().toISOString(),
      }, { merge: true });

      // Track specific episode
      if (mediaType === 'tv' && season && episode) {
          const epRef = doc(db, "users", user.uid, "history", String(movie.id), "watched_episodes", `s${season}e${episode}`);
          await setDoc(epRef, { watched: true, timestamp: new Date().toISOString() });
      }
      
      // Achievement Check
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
          const currentAchievements = userSnap.data().achievements || [];
          const unlocked = await checkAchievements(user.uid, [...items, movie], currentAchievements);
          if (unlocked.length > 0) {
              unlocked.forEach(a => {
                  // Emit a global event or just alert for now
                  console.log(`Achievement Unlocked: ${a.title}`);
              });
          }
      }
    } catch (e) {
      console.error("Error saving progress", e);
    }
  };

  return { history: items, saveProgress };
}
