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
            next: { revalidate: 60 } // Reduce cache to 1 minute for faster debugging
        });
        
        const data = await response.text();
        
        // Detailed logging for debugging
        console.log(`Proxy Fetch from ${url} status: ${response.status}`);
        
        // ISP Block check
        if (data.includes("etisalat.ae") || data.includes("blocked") || data.includes("safe.etisalat")) {
            return NextResponse.json({ 
                error: "Regional Block Detected", 
                details: "Provider is blocked by Etisalat/Du. Attempting bypass...",
                html: data.slice(0, 500)
            }, { status: 403 });
        }

        return new NextResponse(data, {
            headers: { 
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Access-Control-Allow-Origin': '*' 
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
