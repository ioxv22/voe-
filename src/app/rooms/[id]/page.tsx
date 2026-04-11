"use client";

import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot, collection, addDoc, query, orderBy, serverTimestamp, setDoc, updateDoc, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { getStreamUrl, SERVER_MAP } from "@/lib/stream";
import { MessageSquare, Send, X, Users, Crown, Lock, Play, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomDetailsPage({ params }: { params: any }) {
  const { user } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [reactions, setReactions] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    async function getParams() {
      const { id } = await params;
      setRoomId(id);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!roomId) return;
    const unsubRoom = onSnapshot(doc(db, "rooms", roomId), (doc) => {
      setRoom({ id: doc.id, ...doc.data() });
    });
    
    const qMessages = query(collection(db, "rooms", roomId, "messages"), orderBy("timestamp", "asc"));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qReactions = query(collection(db, "rooms", roomId, "reactions"), orderBy("timestamp", "desc"), limit(20));
    const unsubReactions = onSnapshot(qReactions, (snapshot) => {
        setReactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubRoom(); unsubMessages(); unsubReactions(); };
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (room.password && passwordInput !== room.password) {
        return alert("Incorrect Room Password.");
    }
    setIsJoined(true);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !roomId) return;
    
    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text: newMessage,
      userId: user.uid,
      userName: user.displayName,
      userAvatar: user.photoURL,
      timestamp: serverTimestamp()
    });
    setNewMessage("");
  };

  const sendReaction = async (emoji: string) => {
    if (!user || !roomId) return;
    await addDoc(collection(db, "rooms", roomId, "reactions"), {
        emoji,
        userId: user.uid,
        userName: user.displayName,
        timestamp: serverTimestamp()
    });
  };

  if (!room) return <div className="min-h-screen bg-black" />;

  if (!isJoined && room.password) {
      return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
                <div className="h-20 w-20 rounded-3xl bg-yellow-600/10 text-yellow-600 flex items-center justify-center mb-8 mx-auto border border-yellow-600/20">
                    <Lock size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{room.name}</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">This room is protected</p>
                <form onSubmit={handleJoin} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="SECURITY PIN" 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-center text-white outline-none focus:border-yellow-600 transition"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                    />
                    <button className="w-full bg-yellow-600 py-4 rounded-2xl font-black text-black uppercase tracking-widest hover:bg-yellow-500 transition">Enter Party</button>
                </form>
            </motion.div>
        </div>
      );
  }

  const playerUrl = getStreamUrl(room.currentType || "movie", room.currentMovie?.id, 1, 1, "nebula");

  return (
    <main className="min-h-screen bg-[#020202] flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-1 pt-20 lg:pt-24 h-full relative">
        {/* PLAYER SIDE */}
        <div className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarOpen ? 'lg:mr-80' : ''}`}>
            <div className="flex-1 relative bg-black flex items-center justify-center group">
                <iframe src={playerUrl} className="w-full h-full border-none" allowFullScreen />
                
                {/* Status Bar */}
                <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Party: {room.name}</span>
                </div>

                {/* Floating Reactions Layer */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <AnimatePresence>
                        {reactions.map((r: any) => (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, scale: 0.5, y: 100, x: Math.random() * 200 - 100 }}
                                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8], y: -400 }}
                                transition={{ duration: 4, ease: "easeOut" }}
                                className="absolute bottom-20 left-1/2 text-4xl select-none"
                            >
                                {r.emoji}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Reaction Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {['🔥', '😂', '🍿', '❤️', '😱', '👏'].map(emoji => (
                        <button 
                            key={emoji}
                            onClick={() => sendReaction(emoji)}
                            className="hover:scale-125 transition active:scale-95 text-xl p-2"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            {/* Room Info Footer */}
            <div className="p-6 bg-[#050505] border-t border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase">{room.hostName}'s Room</h2>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1 text-primary-500"><Radio size={12} /> Sync On</span>
                        <span>{messages.length} Messages</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition ${isSidebarOpen ? 'bg-primary-600 border-primary-600 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                >
                    <MessageSquare size={18} /> {isSidebarOpen ? 'Hide Chat' : 'Show Chat'}
                </button>
            </div>
        </div>

        {/* CHAT SIDEBAR */}
        <div className={`fixed right-0 top-20 bottom-0 w-full lg:w-80 bg-[#080808] border-l border-white/5 transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} z-40 flex flex-col`}>
             <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={16} className="text-primary-600" /> Crew Chat
                </h3>
                <div className="px-2 py-0.5 rounded bg-primary-600/10 text-primary-500 text-[8px] font-black uppercase">Active</div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                 {messages.map((msg, i) => (
                     <div key={msg.id || i} className="flex gap-3">
                         <div className="h-8 w-8 rounded-full bg-white/5 overflow-hidden flex-shrink-0">
                             {msg.userAvatar ? <img src={msg.userAvatar} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-gray-500">{msg.userName?.[0]}</div>}
                         </div>
                         <div className="flex-1 min-w-0">
                             <div className="flex items-baseline gap-2 mb-0.5">
                                 <span className={`text-[10px] font-black uppercase tracking-tight ${msg.userId === room.hostId ? 'text-yellow-500' : 'text-gray-400'}`}>
                                    {msg.userName} {msg.userId === room.hostId && "👑"}
                                 </span>
                             </div>
                             <p className="text-xs text-gray-200 leading-relaxed break-words">{msg.text}</p>
                         </div>
                     </div>
                 ))}
                 <div ref={chatEndRef} />
             </div>

             <form onSubmit={sendMessage} className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                 <div className="relative">
                     <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs pr-12 outline-none focus:border-primary-600 transition text-white"
                        placeholder="Say something..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                     />
                     <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-600 p-2 hover:scale-110 transition">
                         <Send size={16} />
                     </button>
                 </div>
             </form>
        </div>
      </div>
    </main>
  );
}
