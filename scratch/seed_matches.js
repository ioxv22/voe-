const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc, query } = require("firebase/firestore");

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

const matchesData = [
    { title: "Atletico Madrid vs Barcelona", time: "23:00", url: "" },
    { title: "Liverpool vs Paris Saint-Germain", time: "23:00", url: "" },
    { title: "Al Qadisiyah vs Al Shabab", time: "22:00", url: "" },
    { title: "Al Ittihad vs Zed FC", time: "22:00", url: "" },
    { title: "Kahraba Ismailia vs Ismaily SC", time: "22:00", url: "" },
    { title: "El Gouna vs Modern Sport", time: "19:00", url: "" },
    { title: "Al Nassr vs Al Khaleej", time: "21:00", url: "" },
    { title: "Smouha vs Enppi", time: "19:00", url: "" }
];

async function seedMatches() {
    console.log("Cleaning old matches...");
    const snap = await getDocs(collection(db, "matches"));
    for (const d of snap.docs) {
        await deleteDoc(d.ref);
    }

    console.log("Seeding new matches...");
    for (const match of matchesData) {
        await addDoc(collection(db, "matches"), {
            ...match,
            createdAt: serverTimestamp()
        });
        console.log(`Injected: ${match.title}`);
    }
    console.log("Done!");
    process.exit(0);
}

seedMatches();
