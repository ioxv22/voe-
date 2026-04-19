"use client";

import { useEffect } from "react";
import { doc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // Use sessionStorage to only count once per browser session
      const hasVisited = sessionStorage.getItem("voz_visited");
      if (hasVisited) return;

      try {
        const statsRef = doc(db, "system", "stats");
        
        // Fetch Country info with Multiple Fallbacks
        let country = "Unknown";
        
        const geoAPIs = [
            async () => {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                return data.country_name;
            },
            async () => {
                const res = await fetch("https://ipwho.is/");
                const data = await res.json();
                return data.country;
            },
            async () => {
                const res = await fetch("http://ip-api.com/json/");
                const data = await res.json();
                return data.country;
            }
        ];

        for (const api of geoAPIs) {
            try {
                const name = await api();
                if (name && name !== "undefined") {
                    country = name;
                    break;
                }
            } catch (e) {
                console.warn("One Geo API failed, trying next...");
            }
        }

        // Clean country name for Firestore keys (remove dots, etc if any, though usually fine)
        const safeCountryName = country.replace(/[$.[\]#/]/g, "_");

        await setDoc(statsRef, { 
            totalVisits: increment(1),
            [`countries.${safeCountryName}`]: increment(1)
        }, { merge: true });
        
        sessionStorage.setItem("voz_visited", "true");
        console.log("Visitor tracked from:", safeCountryName);
      } catch (err) {
        console.error("Traffic Tracking Error:", err);
      }
    };

    trackVisit();
  }, []);

  return null;
}
