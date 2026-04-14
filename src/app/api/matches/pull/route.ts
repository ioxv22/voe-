import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const response = await fetch('https://www.yallakora.com/match-center', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });

        const html = await response.text();
        
        // Regex to extract matches
        // This is a simplified regex based on YallaKora's structure
        const matches: any[] = [];
        const matchBlocks = html.split('<div class="matchItem');

        matchBlocks.shift(); // Remove first block

        matchBlocks.forEach(block => {
            try {
                const teamAMatch = block.match(/<div class="teams teamA">.*?<p>(.*?)<\/p>/s);
                const teamBMatch = block.match(/<div class="teams teamB">.*?<p>(.*?)<\/p>/s);
                const timeMatch = block.match(/<span class="time">(.*?)<\/span>/s);

                if (teamAMatch && teamBMatch) {
                    const teamA = teamAMatch[1].trim();
                    const teamB = teamBMatch[1].trim();
                    const time = timeMatch ? timeMatch[1].trim() : "TBD";

                    matches.push({
                        title: `${teamA} vs ${teamB}`,
                        team1: teamA,
                        team2: teamB,
                        time: time,
                        url: "" // User must provide stream URL manually
                    });
                }
            } catch (e) {}
        });

        return NextResponse.json({ matches: matches.slice(0, 15) });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
