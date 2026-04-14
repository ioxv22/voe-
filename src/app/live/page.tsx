"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Radio, Play, Tv, Film, Search, ChevronRight, Info, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STREAMS = {
  unified: "http://hlaamart.site:80/playlist/hamad201011@2727/hamad201011@2727/webtvlist?output=hls&key=live,movie,created_live,radio_streams,series"
};

const CATEGORIES = [
    { id: 'live', name: 'Live TV', icon: <Radio size={14} />, color: 'bg-red-600' },
    { id: 'sports', name: 'Sports | كورة', icon: <Activity size={14} />, color: 'bg-green-600' },
    { id: 'series', name: 'Series | مسلسلات', icon: <Tv size={14} />, color: 'bg-primary-600' },
    { id: 'movies', name: 'Movies | أفلام', icon: <Film size={14} />, color: 'bg-blue-600' },
    { id: 'radio', name: 'Radio', icon: <Radio size={14} />, color: 'bg-purple-600' }
];

interface Channel {
  name: string;
  url: string;
  logo?: string;
  group?: string;
}

export default function LivePage() {
  const [activeTab, setActiveTab] = useState("live");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
        setActiveTab(tabParam);
    } else {
        const savedTab = localStorage.getItem('voz_live_tab');
        if (savedTab) {
            setActiveTab(savedTab);
            localStorage.removeItem('voz_live_tab');
        }
    }
  }, []);

  useEffect(() => {
    async function fetchM3U() {
      setLoading(true);
      try {
        const response = await fetch(`/api/iptv?url=${encodeURIComponent(STREAMS.unified)}`);
        const text = await response.text();
        
        let allChannels = parseM3U(text);
        
        // If parsing failed (maybe it's not M3U format from webtvlist)
        if (allChannels.length === 0 && text.includes('http')) {
            // Primitive fallback parser for simple list
            const rawLines = text.split('\n');
            allChannels = rawLines.filter(l => l.startsWith('http')).map(l => ({ name: 'Channel ' + l.split('/').pop(), url: l }));
        }

        // Filter by category
        let filtered = allChannels;
        if (activeTab === 'sports') {
           filtered = allChannels.filter(c => 
                c.group?.toLowerCase().includes('sport') || 
                c.name.toLowerCase().includes('bein') || 
                c.name.includes('كورة') ||
                c.group?.toLowerCase().includes('كورة') ||
                c.name.toLowerCase().includes('sport')
           );
        } else if (activeTab === 'series') {
           filtered = allChannels.filter(c => 
                c.group?.toLowerCase().includes('series') || 
                c.name.toLowerCase().includes('drama') || 
                c.name.includes('مسلسل') ||
                c.name.includes('عربي') ||
                c.group?.toLowerCase().includes('مسلسل')
           );
        } else if (activeTab === 'movies') {
           filtered = allChannels.filter(c => 
                c.group?.toLowerCase().includes('movie') || 
                c.name.includes('فيلم') ||
                c.group?.toLowerCase().includes('فيلم')
           );
        } else if (activeTab === 'radio') {
           filtered = allChannels.filter(c => 
                c.group?.toLowerCase().includes('radio') || 
                c.name.includes('اذاعة')
           );
        } else {
           // Live TV default
           filtered = allChannels.filter(c => 
                c.group?.toLowerCase().includes('live') || 
                (!c.group?.toLowerCase().includes('movie') && !c.group?.toLowerCase().includes('series'))
           );
        }

        setChannels(filtered);
        setFilteredChannels(filtered);
        if (filtered.length > 0) setSelectedChannel(null); // Reset player on tab change
      } catch (err) {
        console.error("Failed to fetch IPTV:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchM3U();
  }, [activeTab]);

  useEffect(() => {
    if (!selectedChannel) return;

    const video = document.getElementById('live-player') as HTMLVideoElement;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = selectedChannel.url;
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.onload = () => {
            // @ts-ignore
            if (window.Hls.isSupported()) {
                // @ts-ignore
                const hls = new window.Hls();
                hls.loadSource(selectedChannel.url);
                hls.attachMedia(video);
            }
        };
        document.body.appendChild(script);
    }
  }, [selectedChannel]);

  useEffect(() => {
    const filtered = channels.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.group?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChannels(filtered);
  }, [searchTerm, channels]);

  const parseM3U = (data: string) => {
    const lines = data.split("\n");
    const result: Channel[] = [];
    let currentChannel: Partial<Channel> = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("#EXTINF:")) {
            const info = line.split(",")[1];
            const name = info || "Unknown Channel";
            
            // Extract logo if exists
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            const groupMatch = line.match(/group-title="([^"]+)"/);
            
            currentChannel = { 
                name, 
                logo: logoMatch ? logoMatch[1] : undefined,
                group: groupMatch ? groupMatch[1] : undefined
            };
        } else if (line.startsWith("http")) {
            currentChannel.url = line;
            if (currentChannel.name && currentChannel.url) {
                result.push(currentChannel as Channel);
            }
            currentChannel = {};
        }
    }
    return result;
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-red-600">
      <Navbar />

      <div className="pt-28 px-4 lg:px-12 pb-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
            <div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                    <Radio className="text-red-600 animate-pulse" size={40} />
                    VOZ LIVE TV
                </h1>
                <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-xs">Premium IPTV Protocol • Protected Encryption</p>
                {/* Branding rights */}
                <p className="text-primary-500 font-black text-[10px] mt-1 uppercase tracking-[0.3em]">VOZ STREAM | HAMAD AL-ABDOULI RIGHTS</p>
            </div>

            <div className="flex flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-3xl w-full lg:w-auto gap-2">
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase transition flex items-center justify-center gap-2 ${activeTab === cat.id ? `${cat.color} text-white shadow-xl` : 'text-gray-500 hover:text-white'}`}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar / Channel List */}
            <div className="lg:col-span-1 space-y-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH CHANNELS..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black uppercase tracking-widest outline-none focus:border-red-500/50 transition bg-black/40"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {loading ? (
                        [1,2,3,4,5,6].map(i => <div key={i} className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />)
                    ) : filteredChannels.map((chan, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setSelectedChannel(chan)}
                            className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-4 group ${selectedChannel?.url === chan.url ? 'bg-red-600/20 border-red-600/50' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}
                        >
                            <div className="h-10 w-10 rounded-lg bg-black flex-shrink-0 overflow-hidden border border-white/10">
                                {chan.logo ? <img src={chan.logo} className="h-full w-full object-contain" /> : <Tv className="m-auto text-gray-700" size={20} />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[11px] font-black uppercase tracking-tighter truncate group-hover:text-red-500 transition">{chan.name}</p>
                                <p className="text-[9px] text-gray-600 font-bold truncate">{chan.group || "PREMIUM STREAM"}</p>
                            </div>
                            <Play size={12} className={selectedChannel?.url === chan.url ? "text-red-500" : "text-gray-800"} />
                        </div>
                    ))}
                    {!loading && filteredChannels.length === 0 && (
                        <div className="text-center py-20 opacity-20">
                            <Info size={40} className="mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase">No Channels Found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Player */}
            <div className="lg:col-span-3">
                {selectedChannel ? (
                    <div className="space-y-6">
                        <div className="aspect-video w-full rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl relative group">
                            <video 
                                id="live-player"
                                key={selectedChannel.url}
                                controls 
                                autoPlay
                                className="w-full h-full"
                                poster={selectedChannel.logo}
                            />
                            
                            {/* Watermark */}
                            <div className="absolute top-8 left-8 pointer-events-none opacity-20 select-none">
                                <p className="text-4xl font-black italic uppercase tracking-tighter">VOZ STREAM</p>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-2">HAMAD AL-ABDOULI RIGHTS</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-red-500">{selectedChannel.name}</h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase animate-pulse">Live</span>
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{selectedChannel.group || "Premium Protocol"}</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
                                    <Info size={20} />
                                </button>
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(selectedChannel.url); alert("Stream URL Copied!"); }}
                                    className="h-12 px-6 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition shadow-xl shadow-red-600/20"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video w-full rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 border-dashed flex flex-col items-center justify-center text-center p-12 lg:p-24">
                        <div className="h-24 w-24 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 mb-8 border border-red-600/20">
                            <Radio size={48} className="animate-pulse" />
                        </div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Select a Channel</h2>
                        <p className="text-gray-500 text-sm font-medium max-w-md uppercase tracking-widest leading-relaxed">
                            Select a stream from the list to start watching live broadcasts with premium HLS encryption protocols.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
