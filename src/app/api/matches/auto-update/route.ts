import { NextResponse } from 'next/server';
import { collection, addDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = "force-dynamic";

// Automated Match Sync Protocol
export async function GET() {
    try {
        // 1. Fetch from YallaKora
        const response = await fetch('https://www.yallakora.com/match-center', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = await response.text();
        const matchBlocks = html.split('<div class="matchItem');
        matchBlocks.shift();

        const newMatches: any[] = [];
        matchBlocks.forEach(block => {
            const teamAMatch = block.match(/<div class="teams teamA">[\s\S]*?<p>([\s\S]*?)<\/p>/);
            const teamBMatch = block.match(/<div class="teams teamB">[\s\S]*?<p>([\s\S]*?)<\/p>/);
            const timeMatch = block.match(/<span class="time">([\s\S]*?)<\/span>/);
            const leagueMatch = block.match(/<div class="tournName">[\s\S]*?<a>([\s\S]*?)<\/a>/);

            if (teamAMatch && teamBMatch) {
                newMatches.push({
                    title: `${teamAMatch[1].trim()} Vs ${teamBMatch[1].trim()}`,
                    team1: teamAMatch[1].trim(),
                    team2: teamBMatch[1].trim(),
                    time: timeMatch ? timeMatch[1].trim() : "TBD",
                    league: leagueMatch ? leagueMatch[1].trim() : "Live Sports",
                    url: "https://vidsrc.rip/embed/movie/550", // Placeholder for auto-streams
                    createdAt: serverTimestamp()
                });
            }
        });

        // 2. Sync with Firebase (Limited to top 10 matches for stability)
        const matchesRef = collection(db, "matches");
        
        // Optional: Clear old matches from today
        const oldDocs = await getDocs(matchesRef);
        for (const doc of oldDocs.docs) {
            await deleteDoc(doc.ref);
        }

        // Add new matches
        for (const m of newMatches.slice(0, 10)) {
            await addDoc(matchesRef, m);
        }

        return NextResponse.json({ 
            success: true, 
            syncedCount: newMatches.length > 10 ? 10 : newMatches.length,
            matches: newMatches.slice(0, 10)
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
