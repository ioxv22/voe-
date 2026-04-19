"use client";

import { useEffect } from "react";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // Use sessionStorage to only count once per browser session
      const hasVisited = sessionStorage.getItem("voz_visited");
      if (hasVisited) return;

      try {
        const statsRef = doc(db, "system", "stats");
        
        // Fetch Country info
        let country = "Unknown";
        try {
            const geoRes = await fetch("https://ipapi.co/json/");
            const geoData = await geoRes.json();
            country = geoData.country_name || "Unknown";
        } catch (e) {
            console.error("Geo fetch failed");
        }

        await setDoc(statsRef, { 
            totalVisits: increment(1),
            [`countries.${country}`]: increment(1)
        }, { merge: true });
        
        sessionStorage.setItem("voz_visited", "true");
      } catch (err) {
        console.error("Traffic Error:", err);
      }
    };

    trackVisit();
  }, []);

  return null; // This component doesn't render anything, it just tracks
}
