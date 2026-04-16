
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { text, fileUrls, type } = await request.json();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const body = new URLSearchParams();
        body.append('text', text);
        if (fileUrls && fileUrls.length > 0) {
            body.append('link', fileUrls.join(','));
        }

        const response = await fetch('https://sii3.top/api/OCR.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*'
            },
            body: body.toString(),
            signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        if (!response.ok) {
            const errText = await response.text();
            console.error("AI Provider Error:", response.status, errText);
            return NextResponse.json({ error: "AI Engine Offline" }, { status: response.status });
        }

        const result = await response.text();
        return new NextResponse(result, { status: 200 });

    } catch (err: any) {
        console.error("Proxy Logic Error:", err.message);
        return NextResponse.json({ error: err.name === 'AbortError' ? "Neural timeout" : err.message }, { status: 500 });
    }
}
