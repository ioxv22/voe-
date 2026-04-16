
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { text, fileUrls } = await request.json();

        // New provider: vibe-api.me (wrapped with AllOrigins bypass)
        const targetUrl = `http://vibe-api.me/api_groq.php?text=${encodeURIComponent(text)}`;
        const apiUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/plain, */*',
                'Cache-Control': 'no-cache'
            },
            signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        if (!response.ok) {
            return NextResponse.json({ error: "AI Engine Busy" }, { status: response.status });
        }

        const result = await response.text();
        return new NextResponse(result, { status: 200 });

    } catch (err: any) {
        console.error("Proxy Logic Error:", err.message);
        return NextResponse.json({ error: err.name === 'AbortError' ? "Neural timeout" : err.message }, { status: 500 });
    }
}
