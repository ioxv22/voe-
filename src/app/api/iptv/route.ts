import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    try {
        const targetHost = new URL(url).host;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Host': targetHost,
                'Referer': `http://${targetHost}/`,
                'Connection': 'keep-alive'
            },
            next: { revalidate: 60 }
        });
        
        if (url.includes('.m3u8') || url.includes('.m3u')) {
            let data = await response.text();
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

            // Rewrite relative URLs to absolute via proxy
            const lines = data.split('\n');
            const rewrittenLines = lines.map(line => {
                if (line.startsWith('#') || line.trim() === '') return line;
                
                let absoluteUrl = line.trim();
                if (!absoluteUrl.startsWith('http')) {
                    absoluteUrl = baseUrl + absoluteUrl;
                }
                return `/api/iptv?url=${encodeURIComponent(absoluteUrl)}`;
            });
            
            return new NextResponse(rewrittenLines.join('\n'), {
                headers: { 
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*' 
                }
            });
        } else {
            // Binary segment (.ts)
            const buffer = await response.arrayBuffer();
            return new NextResponse(buffer, {
                headers: { 
                    'Content-Type': response.headers.get('content-type') || 'video/MP2T',
                    'Access-Control-Allow-Origin': '*' 
                }
            });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
