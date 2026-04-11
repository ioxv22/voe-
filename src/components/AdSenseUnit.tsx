"use client";

import { useEffect } from "react";

export default function AdSenseUnit() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, []);

  return (
    <div className="w-full my-8 bg-black/40 rounded-2xl border border-white/5 overflow-hidden p-4">
      <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-format="autorelaxed"
           data-ad-client="ca-pub-8867564621500356"
           data-ad-slot="5627334021"></ins>
    </div>
  );
}
