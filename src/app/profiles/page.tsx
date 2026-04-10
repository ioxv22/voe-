"use client";

import { useProfile } from "@/context/ProfileContext";
import { Plus, Edit2, Lock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Garrett",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Buster",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Tinker",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Sparky",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Joy",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Wink",
];

export default function ProfilesPage() {
  const { profiles, selectProfile, createProfile } = useProfile();
  const [isManaging, setIsManaging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activePinProfile, setActivePinProfile] = useState<any>(null);
  const [pinInput, setPinInput] = useState("");
  
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);
  const [isKids, setIsKids] = useState(false);
  const [newPin, setNewPin] = useState("");
  
  const router = useRouter();

  const handleSelect = (p: any) => {
    if (isManaging) {
        alert("Edit feature coming soon!");
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
        alert("Incorrect PIN");
        setPinInput("");
    }
  };

  const handleCreate = async () => {
    if (newName) {
      try {
        setIsAdding(false); // Close immediately for maximum speed
        await createProfile(newName, newAvatar, isKids, newPin || undefined);
        setNewName("");
        setNewPin("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#141414] text-white p-4">
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
            <h1 className="mb-12 text-4xl font-medium lg:text-5xl">
              {isManaging ? "Manage Profiles:" : "Who's watching?"}
            </h1>

            <div className="flex flex-wrap justify-center gap-8">
              {profiles.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.05 }}
                  className="group relative flex flex-col items-center gap-4 cursor-pointer"
                  onClick={() => handleSelect(p)}
                >
                  <div className="relative h-32 w-32 overflow-hidden rounded-md border-2 border-transparent group-hover:border-white lg:h-40 lg:w-40">
                    <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition">
                        {isManaging ? <Edit2 size={32} /> : p.pin ? <Lock size={24} className="opacity-50" /> : null}
                    </div>
                  </div>
                  <p className="text-gray-400 group-hover:text-white">{p.name}</p>
                  {p.isKids && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase">Kids</span>
                  )}
                </motion.div>
              ))}

              {profiles.length < 4 && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group flex flex-col items-center gap-4 cursor-pointer"
                  onClick={() => setIsAdding(true)}
                >
                  <div className="flex h-32 w-32 items-center justify-center rounded-md border-2 border-transparent bg-white/5 group-hover:bg-white/10 group-hover:border-white lg:h-40 lg:w-40">
                    <Plus size={48} className="text-gray-400 group-hover:text-white" />
                  </div>
                  <p className="text-gray-400 group-hover:text-white">Add Profile</p>
                </motion.div>
              )}
            </div>

            <button 
                onClick={() => setIsManaging(!isManaging)}
                className="mt-20 border border-gray-500 px-8 py-2 text-gray-500 uppercase tracking-widest text-sm transition hover:border-white hover:text-white"
            >
              {isManaging ? "Done" : "Manage Profiles"}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="add"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-lg bg-black/40 p-8 backdrop-blur-md border border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Add Profile</h2>
                <button onClick={() => setIsAdding(false)}><X /></button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex flex-col items-center gap-4">
                    <img src={newAvatar} className="h-40 w-40 rounded-md border-2 border-primary-600" />
                    <p className="text-xs text-gray-400">Selected Character</p>
                </div>

                <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Name</label>
                            <input 
                                type="text" 
                                autoFocus
                                placeholder="Type name..."
                                className="w-full bg-[#333] p-3 text-lg outline-none focus:bg-[#444]"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase">Profile PIN (Optional)</label>
                            <input 
                                type="password" 
                                maxLength={4}
                                placeholder="4 digits"
                                className="w-full bg-[#333] p-3 text-lg outline-none focus:bg-[#444] tracking-widest"
                                value={newPin}
                                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-[#333] p-4 rounded-md">
                        <input 
                            type="checkbox" 
                            id="kids" 
                            className="h-6 w-6 accent-primary-600"
                            checked={isKids}
                            onChange={(e) => setIsKids(e.target.checked)}
                        />
                        <label htmlFor="kids" className="cursor-pointer">
                            <span className="block font-bold">Kid?</span>
                            <span className="text-xs text-gray-400">Restricts content and changes avatars.</span>
                        </label>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase">Choose Character</label>
                        <div className="flex flex-wrap gap-3">
                            {AVATARS.map(url => (
                                <img 
                                    key={url}
                                    src={url} 
                                    className={`h-12 w-12 rounded cursor-pointer transition ${newAvatar === url ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'}`}
                                    onClick={() => setNewAvatar(url)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={handleCreate}
                            className="bg-white px-8 py-2 text-black font-bold uppercase transition hover:bg-gray-200"
                        >
                            Save
                        </button>
                        <button 
                             onClick={() => setIsAdding(false)}
                            className="border border-gray-600 px-8 py-2 text-gray-400 uppercase font-bold transition hover:border-white hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
