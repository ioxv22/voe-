import { NextResponse } from 'next/server';
import { sendTelegramPhoto } from '@/lib/telegram';

const TG_TOKEN = "8640789206:AAGHTPEsXEQRKBFMg6nyJZrgazeuVja9Hcc";
const TG_CHAT_ID = "-1003910077563";
const TMDB_KEY = "4d8a341b16e8d0427445100613dd7ba2";

export async function GET() {
    try {
        // 1. Fetch Arabic Series from TMDB
        const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_original_language=ar&sort_by=popularity.desc`);
        const data = await res.json();
        const items = data.results || [];

        if (items.length === 0) return NextResponse.json({ message: "No series found" });

        // 2. Iterate and send (with slight delay to avoid rate limits)
        let count = 0;
        for (const item of items.slice(0, 15)) { // Limit to 15 to avoid spam
            const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
            if (!poster) continue;

            const caption = `<b>📺 مسلسلات عربية جديدة على VOZ!</b>\n\n🎬 <b>${item.name}</b>\n⭐ التقييم: ${item.vote_average}\n📅 سنة الإنتاج: ${item.first_air_date?.slice(0, 4)}\n\n📝 ${item.overview?.slice(0, 150)}...\n\n🍿 شاهد الآن على VOZ STREAM!`;
            
            await sendTelegramPhoto(TG_TOKEN, TG_CHAT_ID, poster, caption);
            count++;
            
            // Artificial delay
            await new Promise(r => setTimeout(r, 1000));
        }

        return NextResponse.json({ success: true, count });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
