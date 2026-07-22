"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
  requestVIP: () => Promise<void>;
  logout: () => Promise<void>;
  updateAccountPassword: (newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
                  
                  // Fetch country for profile if not present
                  let userCountry = "Unknown";
                  try {
                      const geoRes = await fetch("https://ipwho.is/");
                      const geoData = await geoRes.json();
                      userCountry = geoData.country || "Unknown";
                  } catch (e) {}

                  if (userDoc.exists()) {
                      const data = userDoc.data();
                      const hasVIP = !!data.isVIP || !!data.isPremium;
                      setIsPremium(hasVIP);
                      setIsAdmin(!!data.isAdmin || firebaseUser.email === "admin@voz.stream"); // Fallback check
                      
                      // Update country if missing
                      if (!data.country || data.country === "Unknown") {
                          await setDoc(userDocRef, { country: userCountry }, { merge: true });
                      }
                  } else {
                      await setDoc(userDocRef, { 
                          email: firebaseUser.email, 
                          displayName: firebaseUser.displayName,
                          isPremium: false,
                          isAdmin: firebaseUser.email === "admin@voz.stream",
                          country: userCountry,
                          createdAt: serverTimestamp()
                      }, { merge: true });
                  }
              } catch (err) {
                  console.warn("Auth sync offline.");
                  setIsPremium(false);
              }
          };
          syncUser();
          setLoading(false);
      } else if (guestSession) {
          setIsGuest(true);
          setIsPremium(false);
          setIsAdmin(false);
          setUser({ displayName: "Guest User", uid: "guest_id", photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" });
          setLoading(false);
      } else {
          setUser(null);
          setIsAdmin(false);
          setIsPremium(false);
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
      
      let userCountry = "Unknown";
      try {
          const geoRes = await fetch("https://ipwho.is/");
          const geoData = await geoRes.json();
          userCountry = geoData.country || "Unknown";
      } catch (e) {}

      await setDoc(doc(db, "users", cred.user.uid), { 
          email, 
          isPremium: false, 
          isAdmin: email === "admin@voz.stream",
          country: userCountry,
          createdAt: serverTimestamp()
      }, { merge: true });
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

  const requestVIP = async () => {
    if (!user || isGuest) {
        alert("Please sign in properly to request VIP status.");
        return;
    }
    try {
        await setDoc(doc(db, "vip_requests", user.uid), {
            userId: user.uid,
            userName: user.displayName || "Anonymous User",
            userEmail: user.email || "No Email",
            status: "pending",
            requestedAt: serverTimestamp(),
            shareCount: 5
        }, { merge: true });
        localStorage.setItem("voz_vip_pending", "true");
        alert("تم إرسال طلبك بنجاح! سيقوم المدير بمراجعته وتفعيل حسابك قريباً.");
    } catch (e) {
        console.error("Failed VIP request:", e);
        alert("Action failed. Try again after logging in.");
    }
  };

  const updateAccountPassword = async (newPass: string) => {
    if (!user || isGuest) throw new Error("Log in properly to change password.");
    try {
        await updatePassword(auth.currentUser!, newPass);
    } catch (error) {
        throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, isPremium, isAdmin, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest, activateVIP, requestVIP, logout, updateAccountPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth missing");
  return context;
};

