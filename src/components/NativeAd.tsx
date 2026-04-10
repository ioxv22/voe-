"use client";

import React from "react";

export default function NativeAd() {
  return (
    <div className="w-full flex justify-center my-8 px-4 overflow-hidden rounded-xl">
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[150px] flex items-center justify-center relative shadow-2xl">
        <iframe 
            title="Ad"
            src="/ad.html"
            style={{ width: '100%', minHeight: '150px', border: 'none', overflow: 'hidden' }}
            scrolling="no"
        />
        <div className="absolute top-1 right-2 text-[8px] text-gray-700 font-bold uppercase tracking-widest pointer-events-none opacity-50">VOZ Advertisement System</div>
      </div>
    </div>
  );
}
