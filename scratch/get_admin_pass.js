const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAJt1XDCr2kKLKEfql3Dv0Hy0S_BISFZS0",
  authDomain: "vozstream-4ab7c.firebaseapp.com",
  projectId: "vozstream-4ab7c",
  storageBucket: "vozstream-4ab7c.firebasestorage.app",
  messagingSenderId: "75976618516",
  appId: "1:75976618516:web:a874a4ac073c0bc818ad01",
  measurementId: "G-DYPEFY12V9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getAdminPass() {
    const snap = await getDoc(doc(db, "system", "config"));
    if (snap.exists()) {
        console.log("ADMIN_PASS:" + snap.data().adminPassword);
    } else {
        console.log("NOT_FOUND");
    }
    process.exit(0);
}

getAdminPass();
