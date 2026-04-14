import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        const data = await response.text();
        
        // Check if it's an Etisalat block page
        if (data.includes("etisalat.ae") && data.includes("blocked")) {
            return NextResponse.json({ error: "Provider Blocked", details: "The IPTV source is blocked by the regional ISP." }, { status: 403 });
        }

        return new NextResponse(data, {
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
