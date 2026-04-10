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
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | any | null;
  loading: boolean;
  isGuest: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guestSession = localStorage.getItem("voz_guest_session");
    if (guestSession) {
        setIsGuest(true);
        setUser({ displayName: "Guest User", uid: "guest_id", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" });
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsGuest(false);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInAsGuest = () => {
    setIsGuest(true);
    setUser({ displayName: "Guest User", uid: "guest_id", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" });
    localStorage.setItem("voz_guest_session", "true");
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.removeItem("voz_guest_session");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem("voz_guest_session");
    } catch (error) {
      console.error("Sign up failed", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem("voz_guest_session");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isGuest) {
        setIsGuest(false);
        setUser(null);
        localStorage.removeItem("voz_guest_session");
      } else {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest, logout }}>
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
