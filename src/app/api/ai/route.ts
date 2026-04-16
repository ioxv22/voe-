
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { text, conversationId, model = "1" } = await request.json();

        const response = await fetch('https://zecora0.serv00.net/deepseek.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                model: String(model),
                message: text,
                conversation_id: conversationId || undefined
            })
        });

        if (!response.ok) {
            return NextResponse.json({ error: "AI Engine Offline" }, { status: response.status });
        }

        const result = await response.text();
        try {
            const data = JSON.parse(result);
            return NextResponse.json(data);
        } catch (e) {
            return new NextResponse(result, { status: 200 });
        }

    } catch (err: any) {
        console.error("DeepSeek Proxy Error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
