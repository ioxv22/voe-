const TG_TOKEN = "8640789206:AAGHTPEsXEQRKBFMg6nyJZrgazeuVja9Hcc";
const CHAT_ID = "-1003910077563";
const TMDB_KEY = "f207f2ef84a1e948842e61a66a7b21ec";

async function postToTelegram() {
    console.log("🚀 Starting Bulk Sync to Telegram...");
    
    const endpoints = [
        { name: "Trending Now", url: `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}` },
        { name: "Latest Movies", url: `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}` },
        { name: "Arabic Specials", url: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_original_language=ar&sort_by=popularity.desc` },
        { name: "Khaleeji Hits", url: `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_original_language=ar&with_origin_country=AE|SA|KW|QA|BH|OM&sort_by=popularity.desc` }
    ];

    for (const ep of endpoints) {
        try {
            console.log(`📡 Fetching: ${ep.name}`);
            const res = await fetch(ep.url);
            const data = await res.json();
            
            if (!data.results) {
                console.error(`❌ No results for ${ep.name}`, data);
                continue;
            }

            const results = data.results.slice(0, 10); 

            for (const item of results) {
                const title = item.title || item.name;
                const type = item.media_type || (item.first_air_date ? "tv" : "movie");
                const poster = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
                const rating = item.vote_average?.toFixed(1) || "N/A";
                const year = (item.release_date || item.first_air_date || "").split('-')[0];
                
                const watchUrl = `https://voz.stream/watch/${type}/${item.id}`;
                
                const caption = `<b>🎬 ${title} (${year})</b>\n\n` +
                                `⭐ Rating: ${rating}\n` +
                                `📂 Category: ${ep.name}\n\n` +
                                `🔗 Watch Now: <a href="${watchUrl}">${watchUrl}</a>\n\n` +
                                `✨ Enjoy 4K Streaming on VOZ STREAM!`;

                console.log(`📤 Posting: ${title}`);
                const tgRes = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        photo: poster,
                        caption: caption,
                        parse_mode: 'HTML'
                    })
                });
                
                if (!tgRes.ok) {
                    const tgErr = await tgRes.json();
                    console.error(`❌ TG Error:`, tgErr);
                }
                
                await new Promise(r => setTimeout(r, 2000));
            }
        } catch (err) {
            console.error(`Error processing ${ep.name}:`, err);
        }
    }
    console.log("✅ Bulk Sync Complete!");
}

postToTelegram();
