
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { text, fileUrls, type } = await request.json();

        if (type === 'upload') {
            // Forwarding upload is tricky with raw files, 
            // but the user's error was in the text chat (askVOZAI).
            return NextResponse.json({ error: "Use client-side upload or separate proxy" }, { status: 400 });
        }

        const body = new URLSearchParams();
        body.append('text', text);
        if (fileUrls && fileUrls.length > 0) {
            body.append('link', fileUrls.join(','));
        }

        const response = await fetch('https://sii3.top/api/OCR.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: body.toString()
        });

        if (!response.ok) {
            return NextResponse.json({ error: "AI Provider Error" }, { status: response.status });
        }

        const result = await response.text();
        return new NextResponse(result, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
