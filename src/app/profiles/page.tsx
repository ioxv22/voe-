"use client";

import { useProfile } from "@/context/ProfileContext";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilesPage() {
  const { profiles, selectProfile, createProfile } = useProfile();
  const router = useRouter();

  const handleSelect = (p: any) => {
    selectProfile(p);
    router.push("/");
  };

  const handleAdd = async () => {
    const name = prompt("Enter profile name:");
    if (name) {
      const isKids = confirm("Is this profile for a child?");
      const avatar = isKids 
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${name}` 
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
      await createProfile(name, avatar, isKids);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#141414] text-white">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-4xl font-medium lg:text-5xl"
      >
        Who's watching?
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-8">
        {profiles.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.1 }}
            className="group flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => handleSelect(p)}
          >
            <div className="h-32 w-32 overflow-hidden rounded-md border-2 border-transparent group-hover:border-white lg:h-40 lg:w-40">
              <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <p className="text-gray-400 group-hover:text-white">{p.name}</p>
          </motion.div>
        ))}

        {profiles.length < 4 && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="group flex flex-col items-center gap-4 cursor-pointer"
            onClick={handleAdd}
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-md border-2 border-transparent bg-white/5 group-hover:bg-white/10 group-hover:border-white lg:h-40 lg:w-40">
              <Plus size={48} className="text-gray-400 group-hover:text-white" />
            </div>
            <p className="text-gray-400 group-hover:text-white">Add Profile</p>
          </motion.div>
        )}
      </div>

      <button className="mt-20 border border-gray-500 px-6 py-2 text-gray-500 transition hover:border-white hover:text-white">
        Manage Profiles
      </button>
    </main>
  );
}
