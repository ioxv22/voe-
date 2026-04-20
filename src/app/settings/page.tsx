"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, ShieldCheck, Mail, Crown, ChevronRight, User, Key, KeyRound, LogOut, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { user, isGuest, isPremium, updateAccountPassword, logout } = useAuth();
  const { profiles, updateProfile } = useProfile();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [editingPin, setEditingPin] = useState<string | null>(null);
  const [newPin, setNewPin] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    setError("");
    setSuccess("");
    try {
        await updateAccountPassword(newPassword);
        setSuccess("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
    } catch (err: any) {
        setError(err.message || "Failed to update password. You may need to re-log in to perform this action.");
    } finally {
        setLoading(false);
    }
  };

  const handleUpdatePin = async (profileId: string) => {
      if (newPin.length !== 4 && newPin.length !== 0) return alert("PIN must be 4 digits or empty to remove.");
      try {
          const prof = profiles.find(p => p.id === profileId);
          if (prof) {
              await updateProfile(profileId, prof.name, prof.avatar, prof.isKids, newPin || undefined);
              setEditingPin(null);
              setNewPin("");
              alert("Profile PIN updated!");
          }
      } catch (e) {
          alert("Failed to update PIN.");
      }
  };

  if (!user && !isGuest) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#020202] text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-5xl mx-auto">
          <header className="mb-12">
              <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter mb-4">Account <span className="text-primary-600">Settings</span></h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">Manage your VOZ Universe and Security Protocols</p>
          </header>

          <div className="grid grid-cols-1 gap-12">
              
              {/* Account Security Section */}
              <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 lg:p-12 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[100px] rounded-full -mr-20 -mt-20" />
                  
                  <div className="flex items-center gap-4 mb-10 text-primary-500 relative z-10">
                      <ShieldCheck size={32} />
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Security Hub</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                      {/* Password Change */}
                      <form onSubmit={handlePasswordChange} className="space-y-6">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              <Key size={14} /> Update Master Password
                          </h3>
                          
                          {error && <p className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold">{error}</p>}
                          {success && <p className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl text-xs font-bold flex items-center gap-2"><CheckCircle2 size={16}/> {success}</p>}

                          <div className="space-y-4">
                              <input 
                                type="password" 
                                placeholder="New Password" 
                                disabled={isGuest}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-600 transition"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <input 
                                type="password" 
                                placeholder="Confirm New Password" 
                                disabled={isGuest}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary-600 transition"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                          </div>

                          <button 
                            disabled={loading || isGuest}
                            className="w-full bg-primary-600 py-4 rounded-2xl font-black uppercase text-sm hover:bg-primary-700 transition shadow-xl disabled:opacity-50"
                          >
                            {loading ? "Syncing..." : isGuest ? "Guest: Local Only" : "Commit Changes"}
                          </button>
                      </form>

                      {/* Info & Logout */}
                      <div className="space-y-8 lg:border-l lg:border-white/5 lg:pl-12">
                          <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Connected Identity</h3>
                                <div className="flex items-center gap-4 bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                                    <div className="h-12 w-12 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-500">
                                        <Mail size={24} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-black text-gray-500 uppercase">Primary Email</p>
                                        <p className="font-bold truncate">{user?.email || "Anonymous Access"}</p>
                                    </div>
                                </div>
                          </div>

                          <div className="space-y-4">
                               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Account Status</h3>
                               <div className={`p-6 rounded-3xl border flex items-center justify-between ${isPremium ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/[0.03] border-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <Crown className={isPremium ? 'text-yellow-500' : 'text-gray-600'} />
                                        <span className="font-black uppercase italic tracking-tighter text-xl">{isPremium ? 'VOZ VIP' : 'STANDARD'}</span>
                                    </div>
                                    {!isPremium && <button className="text-[10px] font-black uppercase bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition">Upgrade</button>}
                               </div>
                          </div>

                          <button 
                            onClick={logout}
                            className="flex items-center justify-center gap-3 w-full py-4 text-red-500 font-black uppercase text-xs border border-red-500/10 hover:bg-red-500/10 rounded-2xl transition"
                          >
                              <LogOut size={16} /> Logout from Universe
                          </button>
                      </div>
                  </div>
              </section>

              {/* Profile Codes Section */}
              <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-10 text-primary-500">
                      <User size={32} />
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Profile Control</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {profiles.map(p => (
                          <div key={p.id} className="bg-black/40 border border-white/5 rounded-3xl p-6 text-center group">
                                <div className="h-24 w-24 mx-auto rounded-2xl overflow-hidden mb-6 border-4 border-transparent group-hover:border-primary-600 transition">
                                    <img src={p.avatar} className="w-full h-full object-cover" alt={p.name} />
                                </div>
                                <h4 className="font-black italic uppercase tracking-tighter mb-4 text-lg">{p.name}</h4>
                                
                                <div className="space-y-4">
                                    {editingPin === p.id ? (
                                        <div className="space-y-3">
                                            <input 
                                                autoFocus
                                                type="text" 
                                                maxLength={4}
                                                placeholder="4-DIGIT PIN" 
                                                className="w-full bg-white/5 border border-primary-600/50 rounded-xl p-3 text-center text-xs font-black tracking-[0.5em] outline-none"
                                                value={newPin}
                                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingPin(null)} className="flex-1 py-2 text-[8px] font-black uppercase bg-white/5 rounded-lg">Cancel</button>
                                                <button onClick={() => handleUpdatePin(p.id)} className="flex-1 py-2 text-[8px] font-black uppercase bg-primary-600 text-black rounded-lg">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                setEditingPin(p.id);
                                                setNewPin(p.pin || "");
                                            }}
                                            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase hover:bg-white/10 transition"
                                        >
                                            <KeyRound size={14} /> {p.pin ? "Change PIN" : "Setup PIN"}
                                        </button>
                                    )}
                                </div>
                          </div>
                      ))}
                  </div>

                  <div className="mt-10 p-6 bg-primary-600/5 rounded-3xl border border-primary-600/10 flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-500">
                          <Lock size={18} />
                      </div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                          PIN codes prevent others from accessing your personal profile history, My List, and recommendations. 
                          Leave blank to disable the lock.
                      </p>
                  </div>
              </section>

          </div>
      </div>

      <Footer />
    </main>
  );
}
