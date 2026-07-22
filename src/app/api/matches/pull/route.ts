import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const response = await fetch('https://onsideplus.blogspot.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });

        const html = await response.text();
        const matches: any[] = [];

        // Pattern for OnsidePlus posts (matches)
        // Usually matches look like: <h3 class='post-title entry-title' ...> <a href='...'>مباراة برشلونة ضد ريال مدريد</a> </h3>
        const postRegex = /<h3 class=['"]post-title entry-title['"][\s\S]*?<a href=['"](https:\/\/onsideplus\.blogspot\.com\/.*?)['"]>([\s\S]*?)<\/a>/g;
        
        let match;
        while ((match = postRegex.exec(html)) !== null) {
            const url = match[1];
            const rawTitle = match[2].trim();
            
            // Clean up title (remove 'مباراة', 'بث مباشر', etc.)
            let title = rawTitle.replace(/مباراة/g, '').replace(/بث مباشر/g, '').replace(/H[D|d]/g, '').trim();
            
            // Extract teams if possible (usually Team A vs Team B or Team A ضد Team B)
            const teams = title.split(/ضد|vs/i);
            const team1 = teams[0]?.trim() || "Team 1";
            const team2 = teams[1]?.trim() || "Team 2";

            if (url && title) {
                matches.push({
                    title: title,
                    team1: team1,
                    team2: team2,
                    time: "LIVE", // OnsidePlus home matches are usually today's live matches
                    url: url
                });
            }
        }

        // Filter out non-match titles if any (optional)
        const finalMatches = matches.filter(m => m.title.includes('ضد') || m.title.includes('vs')).slice(0, 10);

        return NextResponse.json({ matches: finalMatches });
    } catch (err: any) {
        console.error("Pull Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
