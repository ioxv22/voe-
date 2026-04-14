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
            
            // Limit large playlists to first 5000 lines to prevent timeout
            if (data.length > 5000000) data = data.slice(0, 5000000); 

            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
            const lines = data.split('\n');
            const rewrittenLines = lines.map(line => {
                if (line.startsWith('#') || line.trim() === '') return line;
                
                let absoluteUrl = line.trim();
                if (!absoluteUrl.startsWith('http')) {
                    absoluteUrl = baseUrl + absoluteUrl.substring(absoluteUrl.startsWith('/') ? 1 : 0);
                }
                return `/api/iptv?url=${encodeURIComponent(absoluteUrl)}`;
            });
            
            return new NextResponse(rewrittenLines.join('\n'), {
                headers: { 
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=60'
                }
            });
        } else {
            // Streaming binary data for performance
            return new NextResponse(response.body, {
                status: response.status,
                headers: { 
                    'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
