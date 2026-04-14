const BOT_TOKEN = "8640789206:AAGHTPEsXEQRKBFMg6nyJZrgazeuVja9Hcc";
const CHAT_ID = "-1003910077563";
const TMDB_KEY = "4d8a341b16e8d0427445100613dd7ba2";

async function sendPhotoToTelegram(photoUrl, caption) {
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                photo: photoUrl,
                caption: caption,
                parse_mode: 'HTML'
            })
        });
        if (response.ok) {
            console.log("Sent photo to Telegram");
        } else {
            const data = await response.json();
            console.error("Error from Telegram", data);
            // Fallback to text if photo fails
            if (data.description.includes("wrong type of the file")) {
                await sendToTelegram(caption);
            }
        }
    } catch (err) {
        console.error("Error sending to Telegram", err.message);
    }
}

async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
}

async function start() {
    console.log("Fetching movies from TMDB with images...");
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}`);
        const data = await res.json();
        const movies = data.results;

        console.log(`Found ${movies.length} movies. Sending...`);

        for (const m of movies) {
            const title = m.title || m.name;
            const overview = m.overview || "No description available.";
            const type = m.media_type === 'movie' ? '🎬 Movie' : '📺 Series';
            const year = (m.release_date || m.first_air_date || "").slice(0, 4);
            const posterUrl = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
            
            const caption = `🚨 <b>New Entry on VOZ Stream!</b>\n\n${type}: <b>${title}</b> (${year})\n\n📝 <i>${overview.slice(0, 800)}...</i>\n\n🍿 Watch now on: https://vozstream.vercel.app/watch/${m.media_type}/${m.id}`;
            
            await sendPhotoToTelegram(posterUrl, caption);
            // Wait 2 seconds between messages to avoid rate limit
            await new Promise(r => setTimeout(r, 2000));
        }

        console.log("All done!");
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

start();
