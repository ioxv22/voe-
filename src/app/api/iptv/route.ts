import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    const useExternal = searchParams.get('external') === 'true';
    const finalUrl = useExternal ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;

    try {
        const targetHost = new URL(url).host;
        const response = await fetch(finalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Host': targetHost,
                'Referer': `http://${targetHost}/`,
                'Connection': 'keep-alive'
            },
            redirect: 'follow',
            next: { revalidate: 60 }
        });
        
        const contentType = response.headers.get('content-type') || '';
        const isPlaylist = url.includes('.m3u8') || url.includes('.m3u') || contentType.includes('mpegurl') || contentType.includes('application/x-mpegurl') || contentType.includes('text/plain');

        if (isPlaylist) {
            let data = await response.text();
            
            // Skip binary data misidentified as text
            if (data.startsWith('\x7FELF') || data.startsWith('\x00\x00\x00')) {
                 return new NextResponse(response.body, { headers: { 'Content-Type': 'application/octet-stream', 'Access-Control-Allow-Origin': '*' } });
            }

            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
            const lines = data.split('\n');
            const rewrittenLines = lines.map(line => {
                if (line.startsWith('#') || line.trim() === '') return line;
                
                let absoluteUrl = line.trim();
                if (!absoluteUrl.startsWith('http')) {
                    absoluteUrl = baseUrl + absoluteUrl.substring(absoluteUrl.startsWith('/') ? 1 : 0);
                }
                return `/api/iptv?url=${encodeURIComponent(absoluteUrl)}${useExternal ? '&external=true' : ''}`;
            });
            
            return new NextResponse(rewrittenLines.join('\n'), {
                headers: { 
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-store'
                }
            });
        } else {
            // Streaming binary data for performance
            return new NextResponse(response.body, {
                status: response.status,
                headers: { 
                    'Content-Type': contentType || 'application/octet-stream',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
