"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | any | null;
  loading: boolean;
  isGuest: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsGuest: () => void;
  activateVIP: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistence of instant-VIP
    const localVIP = localStorage.getItem("voz_instant_vip") === "true";
    if (localVIP) setIsPremium(true);

    const guestSession = localStorage.getItem("voz_guest_session");
    
    // Safety Timer: Force loading screen to drop after 1.5s if auth hangs
    const safetyTimer = setTimeout(() => {
        if (loading) setLoading(false);
    }, 1500);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimer); // Clear timer if auth resolves fast
      
      if (firebaseUser) {
          setUser(firebaseUser);
          setIsGuest(false);
          
          // NON-BLOCKING Background Sync
          const syncUser = async () => {
              try {
                  const userDocRef = doc(db, "users", firebaseUser.uid);
                  const userDoc = await getDoc(userDocRef);
                  if (userDoc.exists()) {
                      const data = userDoc.data();
                      const hasVIP = !!data.isVIP || !!data.isPremium || localVIP;
                      setIsPremium(hasVIP);
                      setIsAdmin(!!data.isAdmin || firebaseUser.email === "admin@voz.stream"); // Fallback check
                      if (hasVIP) localStorage.setItem("voz_instant_vip", "true");
                  } else {
                      setDoc(userDocRef, { 
                          email: firebaseUser.email, 
                          displayName: firebaseUser.displayName,
                          isPremium: localVIP,
                          isAdmin: firebaseUser.email === "admin@voz.stream"
                      }, { merge: true }).catch(() => {});
                  }
              } catch (err) {
                  console.warn("Auth sync offline - continuing with local state.");
                  setIsPremium(localVIP);
              }
          };
          syncUser();
          setLoading(false);
      } else if (guestSession) {
          setIsGuest(true);
          setIsPremium(localVIP);
          setIsAdmin(false);
          setUser({ displayName: "Guest User", uid: "guest_id", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" });
          setLoading(false);
      } else {
          setUser(null);
          setIsAdmin(false);
          setIsPremium(localVIP);
          setLoading(false);
      }
    });

    return () => {
        clearTimeout(safetyTimer);
        unsubscribe();
    };
  }, []); 

  const activateVIP = async () => {
    setIsPremium(true);
    localStorage.setItem("voz_instant_vip", "true");
    if (user && !isGuest) {
        try {
            await setDoc(doc(db, "users", user.uid), { isPremium: true }, { merge: true });
        } catch (e) {
            console.error("Failed to sync VIP to Firebase", e);
        }
    }
  };

  const signInAsGuest = () => {
    localStorage.setItem("voz_guest_session", "true");
    setIsGuest(true);
    setUser({ displayName: "Guest User", uid: "guest_id", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" });
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      localStorage.removeItem("voz_guest_session");
    } catch (error: any) {
      console.error("Google Sign In Error: ", error);
      alert(`Login Failed: ${error.message}. If deploying on Vercel, ensure your Vercel domain is added to Firebase Authentication -> Settings -> Authorized Domains.`);
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      setDoc(doc(db, "users", cred.user.uid), { email, isPremium: false, isAdmin: email === "admin@voz.stream" }).catch(() => {});
      localStorage.removeItem("voz_guest_session");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem("voz_guest_session");
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem("voz_guest_session");
    if (!isGuest) await signOut(auth);
    setUser(null);
    setIsGuest(false);
    setIsAdmin(false);
    setLoading(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, isPremium, isAdmin, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest, activateVIP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth missing");
  return context;
};

