"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
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
  const { user, isGuest } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear and return if no user
    if (!user) {
      setProfiles([]);
      setCurrentProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfiles = async () => {
      setLoading(true);
      try {
          if (isGuest) {
            const localProfiles = localStorage.getItem("voz_guest_profiles");
            if (localProfiles) {
                const parsed = JSON.parse(localProfiles);
                setProfiles(parsed);
                // Respect session selection if exists
                const sessionProfile = sessionStorage.getItem("voz_active_profile");
                if (sessionProfile) {
                    setCurrentProfile(JSON.parse(sessionProfile));
                }
            } else {
                const defaultProfile = { id: 'guest_main', name: 'Guest', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest', isKids: false };
                setProfiles([defaultProfile]);
                localStorage.setItem("voz_guest_profiles", JSON.stringify([defaultProfile]));
            }
          } else {
            const q = query(collection(db, "users", user.uid, "profiles"), limit(4));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
              const defaultProfile = { 
                  id: 'main', 
                  name: user.displayName || 'Me', 
                  avatar: user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                  isKids: false
              };
              await setDoc(doc(db, "users", user.uid, "profiles", "main"), defaultProfile);
              setProfiles([defaultProfile]);
            } else {
              const p = snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile));
              setProfiles(p);
              
              // Respect session selection
              const sessionProfile = sessionStorage.getItem("voz_active_profile");
              if (sessionProfile) {
                  const found = p.find(prof => prof.id === JSON.parse(sessionProfile).id);
                  if (found) setCurrentProfile(found);
              }
            }
          }
      } catch (err) {
          console.error("Profile fetch error", err);
      } finally {
          setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, isGuest]);

  const selectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile);
    sessionStorage.setItem("voz_active_profile", JSON.stringify(profile));
  };

  const createProfile = async (name: string, avatar: string, isKids: boolean = false, pin?: string) => {
    if (!user || profiles.length >= 4) return;
    
    const newProfile = { id: Date.now().toString(), name, avatar, isKids, pin };
    
    // Optimistic Update
    setProfiles(prev => {
        const updated = [...prev, newProfile];
        if (isGuest) {
            localStorage.setItem("voz_guest_profiles", JSON.stringify(updated));
        }
        return updated;
    });

    if (!isGuest) {
        try {
            await setDoc(doc(db, "users", user.uid, "profiles", newProfile.id), newProfile);
        } catch (err) {
            console.error("Firestore sync failed", err);
        }
    }
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
