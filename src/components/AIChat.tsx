 "use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileUp, Sparkles, X, Paperclip, MessageSquare, Bot, User, Trash2 } from "lucide-react";
import { askVOZAI, uploadFileToAI } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
  files?: string[];
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am VOZ AI powered by GPT-5.2. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() && pendingFiles.length === 0) return;
    
    const userMsg: Message = { role: "user", content: input, files: pendingFiles.map(f => f.name) };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput("");
    
    try {
        // 1. Upload files if any
        let fileUrls: string[] = [];
        for (const file of pendingFiles) {
            const url = await uploadFileToAI(file);
            fileUrls.push(url);
        }
        setPendingFiles([]);

        // 2. Ask AI
        const response = await askVOZAI(input, fileUrls);
        setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err: any) {
        setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Signal lost: ${err.message || 'The neural engine is currently unreachable.'}` }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setPendingFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full bg-primary-600 text-white shadow-2xl shadow-primary-600/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <AnimatePresence mode="wait">
            {isOpen ? <X key="x" /> : <Sparkles key="s" className="animate-pulse" />}
        </AnimatePresence>
        <span className="absolute -top-12 right-0 bg-black text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ask VOZ AI</span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                className="fixed bottom-24 right-6 z-[60] w-[90vw] md:w-[400px] h-[600px] bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden shadow-primary-600/10"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary-600/20 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/20">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">VOZ AI</h3>
                            <p className="text-[10px] font-bold text-primary-500 animate-pulse uppercase">Neural Core Online</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((m, idx) => (
                        <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {m.role === 'user' ? <User size={12} /> : <Bot size={12} className="text-primary-500" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{m.role === 'user' ? 'You' : 'VOZ AI'}</span>
                                </div>
                                <p className="text-sm leading-relaxed">{m.content}</p>
                                {m.files && m.files.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {m.files.map((f, i) => (
                                            <span key={i} className="text-[9px] bg-black/40 px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 uppercase">
                                                <Paperclip size={10} /> {f}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-bounce" />
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:0.2s]" />
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Input */}
                <div className="p-6 border-t border-white/5 bg-black/40">
                    {pendingFiles.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {pendingFiles.map((file, i) => (
                                <div key={i} className="bg-white/5 px-2 py-1 rounded-md border border-white/10 text-[9px] flex items-center gap-2 uppercase font-black">
                                    <Paperclip size={10} /> {file.name}
                                    <button onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))}><X size={10} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-gray-500 hover:text-white">
                            <FileUp size={20} />
                            <input type="file" className="hidden" multiple onChange={handleFile} accept="image/*,application/pdf" />
                        </label>
                        <input 
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-xs font-medium outline-none focus:border-primary-600/50 transition-all"
                            placeholder="ASK VOZ AI ANYTHING..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading}
                            className="h-12 w-12 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
