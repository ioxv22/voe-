"use client";

import React, { Suspense, use, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getStreamUrl } from "@/lib/stream";

function WatchContent({ type, id }: { type: string, id: string }) {
  const [server, setServer] = useState("nebula");
  const playerUrl = getStreamUrl(type, id, 1, 1, server, false, "en");

  return (
    <main className="min-h-screen bg-black text-white p-20">
      <Navbar />
      <h1 className="text-4xl font-bold mb-10">Streaming: {id}</h1>
      <iframe src={playerUrl} className="w-full aspect-video rounded-3xl" allowFullScreen />
      <div className="mt-10 flex gap-4">
          <button onClick={() => setServer("nebula")} className="px-6 py-2 bg-red-600 rounded-full font-bold">Nebula</button>
          <button onClick={() => setServer("vidsrc")} className="px-6 py-2 bg-white/10 rounded-full font-bold">Vidsrc</button>
      </div>
      <Footer />
    </main>
  );
}

export default function WatchPage({ params }: { params: Promise<{type: string, id: string}> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <WatchContent type={resolvedParams.type} id={resolvedParams.id} />
    </Suspense>
  );
}
