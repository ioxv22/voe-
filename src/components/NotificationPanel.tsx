"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Film, Tv, PlayCircle, Info, X, Bell } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'movie' | 'tv' | 'system' | 'personal';
    date: any;
}

export default function NotificationPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch global notifications (limit to last 12h)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const qGlobal = query(
        collection(db, "notifications"), 
        where("date", ">=", twelveHoursAgo),
        orderBy("date", "desc")
    );
    const unsubGlobal = onSnapshot(qGlobal, (snapshot) => {
        const globals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setNotifications(prev => {
            const others = prev.filter(n => n.type === 'personal');
            return [...globals, ...others].sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
        });
    });

    // Fetch personal notifications
    let unsubPersonal = () => {};
    if (user?.uid) {
        const qPersonal = query(collection(db, "user_notifications"), where("userId", "==", user.uid), orderBy("timestamp", "desc"), limit(5));
        unsubPersonal = onSnapshot(qPersonal, (snapshot) => {
            const personals = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(), 
                type: 'personal', 
                date: doc.data().timestamp 
            } as Notification));
            setNotifications(prev => {
                const others = prev.filter(n => n.type !== 'personal');
                return [...personals, ...others].sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
            });
        });
    }

    return () => {
        unsubGlobal();
        unsubPersonal();
    };
  }, [user]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 right-4 lg:right-12 z-[70] w-[350px] max-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="font-black tracking-widest text-xs uppercase">Platform Updates</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition flex gap-4 cursor-default group">
                            <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                                n.type === 'movie' ? 'bg-primary-600/20 text-primary-600' : 
                                n.type === 'tv' ? 'bg-blue-600/20 text-blue-500' : 
                                n.type === 'personal' ? 'bg-green-600/20 text-green-500' : 'bg-gray-600/20 text-gray-400'
                            }`}>
                                {n.type === 'movie' ? <Film size={18} /> : 
                                 n.type === 'tv' ? <Tv size={18} /> : 
                                 n.type === 'personal' ? <Bell size={18} /> : <Info size={18} />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-white group-hover:text-primary-500 transition">{n.title}</p>
                                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{n.message}</p>
                                <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
                                    {n.type === 'personal' ? 'Direct Reply' : 'Just Added'} • VOZ STREAM
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center space-y-4">
                        <PlayCircle size={48} className="mx-auto text-gray-800" />
                        <p className="text-xs text-gray-600 font-bold tracking-widest uppercase">No new updates yet.</p>
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-primary-600/10 text-center">
                <p className="text-[10px] font-black text-primary-600 tracking-widest uppercase">Voz Stream Protocol v2.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
