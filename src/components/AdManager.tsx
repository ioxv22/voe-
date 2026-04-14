"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { useAuth } from "@/context/AuthContext";

export default function AdManager() {
  const [adCode, setAdCode] = useState("");
  const { isPremium } = useAuth();

  useEffect(() => {
    async function loadAds() {
      if (isPremium) return; // VIPs don't see ads
      const adsSnap = await getDoc(doc(db, "system", "ads"));
      if (adsSnap.exists()) {
        const data = adsSnap.data();
        if (data.header) {
          setAdCode(data.header);
        }
      }
    }
    loadAds();
  }, [isPremium]);

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden">
        {adCode && (
            <div 
                id="voz-global-ads"
                dangerouslySetInnerHTML={{ __html: adCode }} 
            />
        )}
    </div>
  );
}
