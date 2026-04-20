import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, clearIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJt1XDCr2kKLKEfql3Dv0Hy0S_BISFZS0",
  authDomain: "vozstream-4ab7c.firebaseapp.com",
  projectId: "vozstream-4ab7c",
  storageBucket: "vozstream-4ab7c.firebasestorage.app",
  messagingSenderId: "75976618516",
  appId: "1:75976618516:web:a874a4ac073c0bc818ad01",
  measurementId: "G-DYPEFY12V9"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);


// Initialize Standard Firestore
const db = initializeFirestore(app, {});

// Self-Repair: Clear corrupted persistence if any existed before
if (typeof window !== "undefined") {
  clearIndexedDbPersistence(db).catch(() => {});
}

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
