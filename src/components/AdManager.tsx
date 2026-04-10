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
    <div className="w-full flex flex-col items-center justify-center my-4 overflow-hidden">
        {/* Hardcoded Adsterra Native Banner in iFrame to bypass React block */}
        <iframe 
            srcDoc={`
                <!DOCTYPE html>
                <html>
                    <body style="margin:0;padding:0;background:transparent;display:flex;justify-content:center;align-items:center;">
                        <script async="async" data-cfasync="false" src="https://pl29118998.profitablecpmratenetwork.com/a279fcd0ccd0a0b5b0dcace3052c9bcf/invoke.js"></script>
                        <div id="container-a279fcd0ccd0a0b5b0dcace3052c9bcf"></div>
                    </body>
                </html>
            `}
            style={{ width: '100%', minHeight: '100px', border: 'none', overflow: 'hidden' }}
            scrolling="no"
        />

        {adCode && (
            <div 
                id="voz-global-ads"
                dangerouslySetInnerHTML={{ __html: adCode }} 
            />
        )}
    </div>
  );
}
