"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc,
  query,
  limit,
  setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  pin?: string;
}

interface ProfileContextType {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  selectProfile: (profile: UserProfile) => void;
  createProfile: (name: string, avatar: string, isKids: boolean, pin?: string) => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfiles([]);
      setCurrentProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfiles = async () => {
      const q = query(collection(db, "users", user.uid, "profiles"), limit(4));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Create initial default profile
        const defaultProfile = { 
            id: 'main', 
            name: user.displayName || 'Me', 
            avatar: user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' 
        };
        await setDoc(doc(db, "users", user.uid, "profiles", "main"), defaultProfile);
        setProfiles([defaultProfile]);
        setCurrentProfile(defaultProfile);
      } else {
        const p = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
        setProfiles(p);
        setCurrentProfile(p[0]);
      }
      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

  const selectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile);
    localStorage.setItem(`voz_profile_${user?.uid}`, profile.id);
  };

  const createProfile = async (name: string, avatar: string, isKids: boolean = false, pin?: string) => {
    if (!user || profiles.length >= 4) return;
    const newProfile = { id: Date.now().toString(), name, avatar, isKids, pin };
    await setDoc(doc(db, "users", user.uid, "profiles", newProfile.id), newProfile);
    setProfiles([...profiles, newProfile]);
  };

  return (
    <ProfileContext.Provider value={{ profiles, currentProfile, selectProfile, createProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
