"use client";

import { useState, useEffect } from "react";
import { Bell, X, Info, Flame, AlertTriangle } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface Notification {
  id: string;
  title?: string;
  message?: string;
  date?: { seconds: number };
  timestamp?: { seconds: number };
  isSystem: boolean;
  read?: boolean;
  type?: 'system' | 'movie' | 'info';
  userId?: string;
}

export default function NotificationHub() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1. Fetch Global System Notifications
    const qSystem = query(collection(db, "notifications"), orderBy("date", "desc"), limit(5));
    const unsubSystem = onSnapshot(qSystem, (snapshot) => {
        const sysNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isSystem: true } as Notification));
        setNotifications(prev => {
            const userOnly = prev.filter(n => !n.isSystem);
            return [...sysNotifs, ...userOnly].sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
        });
    });

    // 2. Fetch User-Specific Notifications
    let unsubUser = () => {};
    if (user) {
        const qUser = query(
            collection(db, "user_notifications"), 
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc"), 
            limit(5)
        );
        unsubUser = onSnapshot(qUser, (snapshot) => {
            const userNotifs = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data(), isSystem: false } as Notification));
                
            setUnreadCount(userNotifs.filter(n => !n.isSystem && !n.read).length);
            setNotifications(prev => {
                const systemOnly = prev.filter(n => n.isSystem);
                return [...systemOnly, ...userNotifs].sort((a, b) => {
                    const timeA = a.date?.seconds || a.timestamp?.seconds || 0;
                    const timeB = b.date?.seconds || b.timestamp?.seconds || 0;
                    return timeB - timeA;
                });
            });
        });
    }

    return () => {
        unsubSystem();
        unsubUser();
    };
  }, [user]);

  const markAsRead = async () => {
      setUnreadCount(0);
      if (user) {
          notifications.filter(n => !n.isSystem && !n.read).forEach(async (n) => {
              await updateDoc(doc(db, "user_notifications", n.id), { read: true });
          });
      }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) markAsRead(); }} 
        className="relative p-2 text-gray-400 hover:text-white transition"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[8px] font-black text-white ring-2 ring-black">
                {unreadCount}
            </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-4 w-80 overflow-hidden rounded-3xl border border-white/10 bg-black/90 backdrop-blur-3xl shadow-2xl z-[70]"
            >
              <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Voz_Intelligence</h3>
                <button onClick={() => setIsOpen(false)}><X size={16} className="text-gray-500 hover:text-white" /></button>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n.id} className="group relative flex gap-4 border-b border-white/5 p-5 hover:bg-white/5 transition">
                            <div className="mt-1 flex-shrink-0">
                                {n.type === 'system' ? <AlertTriangle className="text-yellow-500" size={18} /> : (n.type === 'movie' ? <Flame className="text-primary-500" size={18} /> : <Info className="text-blue-500" size={18} />)}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-black uppercase tracking-tighter text-white mb-1">{n.title}</h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed">{n.message}</p>
                                <span className="mt-2 block text-[8px] font-bold text-gray-700 uppercase tracking-widest italic">Now on Voz Server v2</span>
                            </div>
                            {!n.isSystem && !n.read && <div className="absolute top-5 right-5 h-1 w-1 rounded-full bg-primary-600 shadow-[0_0_10px_#e50914]" />}
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <div className="h-12 w-12 rounded-full border border-white/5 flex items-center justify-center"><Bell size={20} className="text-gray-800" /></div>
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">No active alerts</p>
                    </div>
                )}
              </div>
              
              <div className="bg-primary-600/10 p-3 text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-primary-500">VOZ_ENCRYPTED_FEED</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
