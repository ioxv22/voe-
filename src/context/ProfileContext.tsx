"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
  query,
  limit,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  pin?: string;
  myList?: any[]; // Array of movie objects
}

interface ProfileContextType {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  selectProfile: (profile: UserProfile) => void;
  createProfile: (name: string, avatar: string, isKids: boolean, pin?: string) => Promise<void>;
  toggleMyList: (movie: any) => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfiles([]);
      setCurrentProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfiles = async () => {
      setLoading(true);
      const guestKey = "voz_guest_profiles";
      const sessionActiveKey = "voz_active_profile";

      try {
          if (isGuest) {
            const localProfiles = localStorage.getItem(guestKey);
            let parsed = localProfiles ? JSON.parse(localProfiles) : [];
            if (parsed.length === 0) {
                parsed = [{ id: 'guest_main', name: 'Guest', avatar: DEFAULT_AVATAR, isKids: false, myList: [] }];
                localStorage.setItem(guestKey, JSON.stringify(parsed));
            }
            setProfiles(parsed);
            const saved = sessionStorage.getItem(sessionActiveKey);
            if (saved) setCurrentProfile(JSON.parse(saved));
          } else {
            const q = query(collection(db, "users", user.uid, "profiles"), limit(4));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
              const defaultProfile = { id: 'main', name: user.displayName || 'Me', avatar: user.photoURL || DEFAULT_AVATAR, isKids: false, myList: [] };
              setDoc(doc(db, "users", user.uid, "profiles", "main"), defaultProfile).catch(() => {});
              setProfiles([defaultProfile]);
            } else {
              const p = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
              setProfiles(p);
              const saved = sessionStorage.getItem(sessionActiveKey);
              if (saved) {
                  const savedData = JSON.parse(saved);
                  const found = p.find(prof => prof.id === savedData.id);
                  if (found) setCurrentProfile(found);
              }
            }
          }
      } catch (err) {
          console.warn("Profile Load Failed - Standard Fallback Active");
          setProfiles([{ id: 'fb', name: user.displayName || 'User', avatar: DEFAULT_AVATAR, isKids: false, myList: [] }]);
      } finally {
          setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, isGuest, authLoading]);

  const selectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile);
    sessionStorage.setItem("voz_active_profile", JSON.stringify(profile));
  };

  const toggleMyList = async (movie: any) => {
    if (!currentProfile || !user) return;

    const isAdded = currentProfile.myList?.some(m => m.id === movie.id);
    const updatedList = isAdded 
        ? currentProfile.myList?.filter(m => m.id !== movie.id) || []
        : [...(currentProfile.myList || []), movie];

    // Optimistic Update
    const updatedProfile = { ...currentProfile, myList: updatedList };
    setCurrentProfile(updatedProfile);
    sessionStorage.setItem("voz_active_profile", JSON.stringify(updatedProfile));

    setProfiles(prev => prev.map(p => p.id === currentProfile.id ? updatedProfile : p));

    if (isGuest) {
        const guestProfiles = JSON.parse(localStorage.getItem("voz_guest_profiles") || "[]");
        const newGuestProfiles = guestProfiles.map((p: any) => p.id === currentProfile.id ? updatedProfile : p);
        localStorage.setItem("voz_guest_profiles", JSON.stringify(newGuestProfiles));
    } else {
        const docRef = doc(db, "users", user.uid, "profiles", currentProfile.id);
        await updateDoc(docRef, {
            myList: isAdded ? arrayRemove(movie) : arrayUnion(movie)
        }).catch(err => console.error("Update List Error", err));
    }
  };

  const createProfile = async (name: string, avatar: string, isKids: boolean = false, pin?: string) => {
    if (!user || profiles.length >= 4) return;
    const newProfile = { id: Date.now().toString(), name, avatar, isKids, pin, myList: [] };
    setProfiles(prev => {
        const updated = [...prev, newProfile];
        if (isGuest) localStorage.setItem("voz_guest_profiles", JSON.stringify(updated));
        return updated;
    });
    if (!isGuest) {
        setDoc(doc(db, "users", user.uid, "profiles", newProfile.id), newProfile).catch(() => {});
    }
  };

  return (
    <ProfileContext.Provider value={{ profiles, currentProfile, selectProfile, createProfile, toggleMyList, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) throw new Error("useProfile error");
  return context;
};
