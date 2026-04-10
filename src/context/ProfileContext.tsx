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
  updateProfile: (id: string, name: string, avatar: string, isKids: boolean, pin?: string) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
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

      // 1. FAST TRACK: If we have a saved profile session, use it immediately to kill the Loading Screen!
      const savedSessionStr = localStorage.getItem(sessionActiveKey);
      if (savedSessionStr) {
          try {
              setCurrentProfile(JSON.parse(savedSessionStr));
              setLoading(false); // Unblock UI Instantly!
          } catch (e) {
              console.error("Session parse error", e);
          }
      }

      // 2. TIMEOUT PROTECTION: Force unblock after 1.5s maximum if DB hangs
      const safetyTimer = setTimeout(() => {
          setLoading(false);
      }, 1500);

      try {
          if (isGuest) {
            const localProfiles = localStorage.getItem(guestKey);
            let parsed = localProfiles ? JSON.parse(localProfiles) : [];
            if (parsed.length === 0) {
                parsed = [{ id: 'guest_main', name: 'Guest', avatar: DEFAULT_AVATAR, isKids: false, myList: [] }];
                localStorage.setItem(guestKey, JSON.stringify(parsed));
            }
            setProfiles(parsed);
            if (!savedSessionStr) {
                setCurrentProfile(parsed[0]);
                localStorage.setItem(sessionActiveKey, JSON.stringify(parsed[0]));
            }
            clearTimeout(safetyTimer);
            setLoading(false);
          } else {
            // Asynchronous fetch so it doesn't block
            const q = query(collection(db, "users", user.uid, "profiles"), limit(4));
            getDocs(q).then((snapshot) => {
                if (snapshot.empty) {
                  const defaultProfile = { id: 'main', name: user.displayName || 'Me', avatar: user.photoURL || DEFAULT_AVATAR, isKids: false, myList: [] };
                  setDoc(doc(db, "users", user.uid, "profiles", "main"), defaultProfile).catch(() => {});
                  setProfiles([defaultProfile]);
                  if (!savedSessionStr) {
                      setCurrentProfile(defaultProfile);
                      localStorage.setItem(sessionActiveKey, JSON.stringify(defaultProfile));
                  }
                } else {
                  const p = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
                  setProfiles(p);
                  
                  // Restore active profile connection if possible
                  if (savedSessionStr) {
                      const savedData = JSON.parse(savedSessionStr);
                      const found = p.find(prof => prof.id === savedData.id);
                      if (found) {
                          setCurrentProfile(found);
                          localStorage.setItem(sessionActiveKey, JSON.stringify(found));
                      } else {
                          // If last used profile doesn't exist anymore, pick first
                          setCurrentProfile(p[0]);
                          localStorage.setItem(sessionActiveKey, JSON.stringify(p[0]));
                      }
                  } else {
                      // First time login or cleared cache
                      setCurrentProfile(p[0]);
                      localStorage.setItem(sessionActiveKey, JSON.stringify(p[0]));
                  }
                }
                clearTimeout(safetyTimer);
                setLoading(false);
            }).catch(err => {
                console.warn("Profile Sync Offline - Using Cache", err);
                if (profiles.length === 0) {
                    setProfiles([{ id: 'fb', name: user.displayName || 'Me', avatar: DEFAULT_AVATAR, isKids: false, myList: [] }]);
                }
                clearTimeout(safetyTimer);
                setLoading(false);
            });
          }
      } catch (err) {
          clearTimeout(safetyTimer);
          setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, isGuest, authLoading]); 

  const selectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile);
    localStorage.setItem("voz_active_profile", JSON.stringify(profile));
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
    localStorage.setItem("voz_active_profile", JSON.stringify(updatedProfile));

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

  const updateProfile = async (id: string, name: string, avatar: string, isKids: boolean = false, pin?: string) => {
    if (!user) return;
    const updatedData = { name, avatar, isKids, pin };
    
    setProfiles(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, ...updatedData } : p);
        if (isGuest) localStorage.setItem("voz_guest_profiles", JSON.stringify(updated));
        return updated;
    });

    if (currentProfile?.id === id) {
        const newCurrent = { ...currentProfile, ...updatedData };
        setCurrentProfile(newCurrent);
        sessionStorage.setItem("voz_active_profile", JSON.stringify(newCurrent));
    }

    if (!isGuest) {
        const docRef = doc(db, "users", user.uid, "profiles", id);
        updateDoc(docRef, updatedData).catch(() => {});
    }
  };

  const deleteProfile = async (id: string) => {
      if (!user) return;
      setProfiles(prev => {
          const updated = prev.filter(p => p.id !== id);
          if (isGuest) localStorage.setItem("voz_guest_profiles", JSON.stringify(updated));
          return updated;
      });
      if (!isGuest) {
          const { deleteDoc } = await import("firebase/firestore");
          const docRef = doc(db, "users", user.uid, "profiles", id);
          deleteDoc(docRef).catch(() => {});
      }
  };

  return (
    <ProfileContext.Provider value={{ profiles, currentProfile, selectProfile, createProfile, updateProfile, deleteProfile, toggleMyList, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) throw new Error("useProfile error");
  return context;
};
