"use client";

import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Terminal, ShieldCheck, Lock } from "lucide-react";

export default function AdminInit() {
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleInit = async () => {
        if (!password) return alert("Please enter a password");
        setStatus("loading");
        try {
            const configRef = doc(db, "system", "config");
            const snap = await getDoc(configRef);
            
            // Allow initialization only if document doesn't exist or password is missing
            if (!snap.exists() || !snap.data().adminPassword) {
                await setDoc(configRef, { 
                    adminPassword: password,
                    maintenance: false,
                    alertBanner: ""
                }, { merge: true });
                setStatus("success");
            } else {
                alert("Security Error: Admin password already set. You must change it from within the dashboard or manually in Firebase Console.");
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 text-white">
            <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-[40px] p-12 backdrop-blur-3xl shadow-2xl">
                <div className="h-20 w-20 bg-primary-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary-600/20">
                    <Lock size={40} className="text-primary-500" />
                </div>
                
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2">Admin Setup</h1>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] text-center mb-10 italic">Initialize your System Core Access Key</p>

                {status === "success" ? (
                    <div className="text-center space-y-6">
                        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck size={32} className="text-green-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-400">Password set successfully! You can now login to the dashboard.</p>
                        <a href="/admin" className="block w-full bg-primary-600 py-4 rounded-2xl font-black uppercase text-xs hover:bg-primary-500 transition">Go to Dashboard</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">New Admin Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-primary-500 transition"
                                placeholder="ENTER_SECURE_KEY"
                            />
                        </div>
                        <button 
                            onClick={handleInit}
                            disabled={status === "loading"}
                            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-sm hover:scale-105 transition active:scale-95 disabled:opacity-50"
                        >
                            {status === "loading" ? "INITIALIZING..." : "Set Admin Password"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
