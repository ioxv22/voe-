const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } = require("firebase/firestore");
const https = require("https");

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

async function syncMatches() {
    console.log("Fetching matches from YallaKora...");
    
    https.get('https://www.yallakora.com/match-center', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', async () => {
            const matches = [];
            const blocks = data.split('<div class="matchItem');
            blocks.shift();
            
            for (const block of blocks.slice(0, 10)) {
                const teamA = (block.match(/<div class="teams teamA">[\s\S]*?<p>([\s\S]*?)<\/p>/) || [])[1];
                const teamB = (block.match(/<div class="teams teamB">[\s\S]*?<p>([\s\S]*?)<\/p>/) || [])[1];
                const time = (block.match(/<span class="time">([\s\S]*?)<\/span>/) || [])[1];
                
                if (teamA && teamB) {
                    matches.push({
                        title: `${teamA.trim()} vs ${teamB.trim()}`,
                        team1: teamA.trim(),
                        team2: teamB.trim(),
                        time: time ? time.trim() : "Unknown",
                        url: "",
                        createdAt: new Date()
                    });
                }
            }
            
            console.log(`Found ${matches.length} matches. Uploading to Firestore...`);
            for (const match of matches) {
                await addDoc(collection(db, "matches"), match);
                console.log(`Added: ${match.title}`);
            }
            console.log("Sync Complete!");
            process.exit(0);
        });
    }).on("error", (err) => {
        console.error("Error: " + err.message);
        process.exit(1);
    });
}

syncMatches();
