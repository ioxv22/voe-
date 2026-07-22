"use client";

import { useProfile } from "@/context/ProfileContext";
import { Plus, Edit2, Lock, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AVATARS = [
    // Anime / Premium Illustrated (Reliable)
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Haruka&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Akira&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Yuki&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Natsuki&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/lorelei/svg?seed=Kenji&backgroundColor=b6e3f4,c0aede,d1d4f9",

    // Adventurer / Hero Style
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoro&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Saber&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Goku&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Luffy&backgroundColor=b6e3f4,c0aede,d1d4f9",

    // Notionists / Minimal Art
    "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Garrett"
];

export default function ProfilesPage() {
  const { profiles, selectProfile, createProfile, updateProfile, deleteProfile, loading: contextLoading } = useProfile();
  const [isManaging, setIsManaging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePinProfile, setActivePinProfile] = useState<any>(null);
  const [pinInput, setPinInput] = useState("");
  
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);
  const [isKids, setIsKids] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  
  const router = useRouter();

  const resetForm = () => {
      setNewName("");
      setNewAvatar(AVATARS[0]);
      setIsKids(false);
      setNewPin("");
      setEditingProfileId(null);
      setIsAdding(false);
  };

  const handleSelect = (p: any) => {
    if (isManaging) {
        setEditingProfileId(p.id);
        setNewName(p.name);
        setNewAvatar(p.avatar);
        setIsKids(p.isKids);
        setNewPin(p.pin || "");
        setIsAdding(true);
        return;
    }
    
    if (p.pin) {
        setActivePinProfile(p);
        return;
    }
    
    selectProfile(p);
    router.push("/");
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === activePinProfile.pin) {
        selectProfile(activePinProfile);
        router.push("/");
    } else {
        alert("كلمة المرور غير صحيحة");
        setPinInput("");
    }
  };

  const handleSave = async () => {
    if (!newName) {
       alert("الرجاء كتابة اسم البروفايل أولاً!");
       return;
    }
    if (newName && !isSaving) {
      setIsSaving(true);
      try {
        if (editingProfileId && updateProfile) {
            await updateProfile(editingProfileId, newName, newAvatar, isKids, newPin || undefined);
        } else {
            await createProfile(newName, newAvatar, isKids, newPin || undefined);
        }
        resetForm();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
      if (editingProfileId && deleteProfile) {
          if(confirm("Are you sure you want to delete this profile?")) {
              setIsSaving(true);
              await deleteProfile(editingProfileId);
              resetForm();
              setIsSaving(false);
          }
      }
  };

  if (contextLoading) {
      return <div className="min-h-screen bg-[#141414] flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#141414] text-white p-6">
      <AnimatePresence mode="wait">
        {activePinProfile ? (
            <motion.div 
                key="pin"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
            >
                <h1 className="mb-8 text-3xl font-medium">Profile Lock is on.</h1>
                <p className="mb-8 text-gray-400">Enter your PIN to access the {activePinProfile.name} profile.</p>
                <div className="flex flex-col items-center gap-4">
                    <img src={activePinProfile.avatar} className="h-32 w-32 rounded-md mb-4" />
                    <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-6">
                        <input 
                            autoFocus
                            type="password"
                            maxLength={4}
                            placeholder="● ● ● ●"
                            className="bg-transparent text-4xl tracking-[1rem] text-center border-b-2 border-gray-600 outline-none focus:border-white w-48 py-2"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                        />
                        <button type="submit" className="hidden">Submit</button>
                        <button 
                            onClick={() => setActivePinProfile(null)}
                            className="text-gray-500 hover:text-white transition uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </motion.div>
        ) : !isAdding ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="mb-12 text-4xl font-black lg:text-5xl tracking-tighter">
              {isManaging ? "MANAGE PROFILES:" : "WHO'S WATCHING?"}
            </h1>

            <div className="flex flex-wrap justify-center gap-8">
              {profiles.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.05 }}
                  className="group relative flex flex-col items-center gap-4 cursor-pointer"
                  onClick={() => handleSelect(p)}
                >
                  <div className="relative h-32 w-32 overflow-hidden rounded-md border-2 border-transparent group-hover:border-white lg:h-40 lg:w-40 transition-all duration-300 pointer-events-auto">
                    <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition duration-300">
                        {isManaging ? <Edit2 size={32} /> : p.pin ? <Lock size={24} className="opacity-50" /> : null}
                    </div>
                  </div>
                  <p className="text-gray-400 group-hover:text-white font-medium transition">{p.name}</p>
                  {p.isKids && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 px-2 py-0.5 text-[10px] font-black rounded-sm uppercase shadow-lg">Kids</span>
                  )}
                </motion.div>
              ))}

              {profiles.length < 4 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group flex flex-col items-center gap-4 cursor-pointer"
                  onClick={() => setIsAdding(true)}
                >
                  <div className="flex h-32 w-32 items-center justify-center rounded-md border-2 border-transparent bg-white/5 group-hover:bg-white/10 group-hover:border-white lg:h-40 lg:w-40 transition-all">
                    <Plus size={48} className="text-gray-400 group-hover:text-white transition" />
                  </div>
                  <p className="text-gray-400 group-hover:text-white font-medium transition">Add Profile</p>
                </motion.div>
              )}
            </div>

            <button 
                onClick={() => setIsManaging(!isManaging)}
                className="mt-20 border border-gray-600 px-10 py-2.5 text-gray-500 uppercase tracking-widest text-xs font-bold transition hover:border-white hover:text-white"
            >
              {isManaging ? "Done" : "Manage Profiles"}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="add"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl rounded-3xl bg-black/80 p-8 backdrop-blur-3xl border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black tracking-tighter">{editingProfileId ? "Edit Profile" : "Add Profile"}</h2>
                <button 
                  onClick={resetForm}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10 transition"
                ><X /></button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <img src={newAvatar} className="h-40 w-40 rounded-xl border-2 border-primary-600 shadow-xl shadow-primary-600/10" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition rounded-xl" />
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Profile Name</label>
                            <input 
                                type="text" 
                                autoFocus
                                placeholder="Enter name..."
                                className="w-full bg-white/[0.05] border border-white/10 p-4 rounded-xl text-lg outline-none focus:bg-white/10 focus:border-primary-600 transition"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Security PIN</label>
                            <input 
                                type="password" 
                                maxLength={4}
                                placeholder="4 digits (Optional)"
                                className="w-full bg-white/[0.05] border border-white/10 p-4 rounded-xl text-lg outline-none focus:bg-white/10 focus:border-primary-600 transition tracking-[0.5em]"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                        <input 
                            type="checkbox" 
                            id="kids" 
                            className="h-6 w-6 accent-primary-600 rounded"
                            checked={isKids}
                            onChange={(e) => setIsKids(e.target.checked)}
                        />
                        <label htmlFor="kids" className="cursor-pointer">
                            <span className="block font-bold text-sm">Kids Mode?</span>
                            <span className="text-[10px] text-gray-500 uppercase font-medium tracking-wider">Restricts to animation and PG content.</span>
                        </label>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Character</label>
                        <div className="flex flex-wrap gap-3">
                            {AVATARS.map(url => (
                                <div 
                                    key={url}
                                    className={`h-11 w-11 rounded-lg cursor-pointer transition-all duration-300 pointer-events-auto overflow-hidden ${newAvatar === url ? 'ring-2 ring-primary-600 scale-110 shadow-lg shadow-primary-600/20 opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                    onClick={() => setNewAvatar(url)}
                                >
                                  <img src={url} className="h-full w-full pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-6">
                        <button 
                            disabled={isSaving}
                            onClick={handleSave}
                            className="bg-white px-10 py-3 text-black font-black uppercase text-xs tracking-widest transition hover:bg-primary-600 hover:text-white disabled:bg-gray-700 rounded-xl shadow-xl shadow-white/5 active:scale-95"
                        >
                            {isSaving ? "Saving..." : "Save Profile"}
                        </button>
                        <button 
                            onClick={resetForm}
                            className="border border-white/10 px-10 py-3 text-gray-500 uppercase font-black text-xs tracking-widest transition hover:border-white hover:text-white rounded-xl active:scale-95"
                        >
                            Cancel
                        </button>
                        {editingProfileId && (
                            <button 
                                onClick={handleDelete}
                                className="ml-auto bg-red-600/20 px-6 py-3 text-red-500 uppercase font-black text-xs tracking-widest transition hover:bg-red-600 hover:text-white shadow-xl shadow-red-600/5 active:scale-95 rounded-xl border border-red-600/20"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
