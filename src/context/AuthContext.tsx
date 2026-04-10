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
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Guest Check (Fastest)
    const guestSession = localStorage.getItem("voz_guest_session");
    if (guestSession) {
        setIsGuest(true);
        setIsPremium(false);
        setUser({ displayName: "Guest User", uid: "guest_id", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" });
        setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
          // Set user IMMEDIATELY for UI responsiveness
          setUser(firebaseUser);
          setIsGuest(false);
          setLoading(false);

          // Fetch Premium status in the background
          try {
              const userDocRef = doc(db, "users", firebaseUser.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                  setIsPremium(!!userDoc.data().isVIP || !!userDoc.data().isPremium);
              } else {
                  // Provision new user record if not exists
                  await setDoc(userDocRef, { 
                      email: firebaseUser.email, 
                      displayName: firebaseUser.displayName,
                      createdAt: new Date().toISOString(),
                      isPremium: false 
                  }, { merge: true });
                  setIsPremium(false);
              }
          } catch (err) {
              console.error("Profile sync delayed:", err);
              // We don't block the UI if Firestore is slow/offline
          }
      } else {
          // No firebase user
          if (!localStorage.getItem("voz_guest_session")) {
              setUser(null);
              setIsGuest(false);
              setLoading(false);
          }
      }
    });
    return () => unsubscribe();
  }, []);

  const signInAsGuest = () => {
    setIsGuest(true);
    setIsPremium(false);
    setUser({ displayName: "Guest User", uid: "guest_id", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" });
    localStorage.setItem("voz_guest_session", "true");
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      localStorage.removeItem("voz_guest_session");
    } catch (error) {
      console.error("Google login error", error);
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, "users", cred.user.uid), { email, isPremium: false });
      localStorage.removeItem("voz_guest_session");
    } catch (error) {
      console.error("Sign up failed", error);
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
      console.error("Login failed", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      if (isGuest) {
        setIsGuest(false);
        setUser(null);
        localStorage.removeItem("voz_guest_session");
      } else {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, isPremium, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
