"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdManager() {
  const [adCode, setAdCode] = useState("");

  useEffect(() => {
    async function loadAds() {
      const adsSnap = await getDoc(doc(db, "system", "ads"));
      if (adsSnap.exists()) {
        const data = adsSnap.data();
        if (data.header) {
          setAdCode(data.header);
        }
      }
    }
    loadAds();
  }, []);

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
