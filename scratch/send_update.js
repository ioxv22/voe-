const token = "8640789206:AAGHTPEsXEQRKBFMg6nyJZrgazeuVja9Hcc";
const chatId = "-1003910077563";
const message = `🚀 <b>VOZ Stream - GLOBAL UPDATE v4.5</b>

The platform has been officially upgraded with high-end protocols:

✅ <b>Bulletproof Security</b>: No more unauthorized database access. Firestore Rules have been locked down and the Admin Terminal is now identity-verified via Google SSL.
✅ <b>Native iOS App Protocol</b>: Improved PWA support for iPhone. Users will now be guided to "Add to Home Screen" to use VOZ as a full native app.
✅ <b>Neural Social Engine</b>: Upgraded SEO and OpenGraph metadata. When you share links on Twitter or Discord, they will show premium high-res previews.
✅ <b>GitHub Sync</b>: The latest source code is now live and synchronized for production.

🍿 Enjoy the premium streaming experience now!
🔗 <b>URL:</b> https://voz-stream.vercel.app/`;

async function send() {
    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const data = await response.json();
        if (data.ok) {
            console.log("Update sent to Telegram successfully!");
        } else {
            console.error("Failed to send update:", data);
        }
    } catch (err) {
        console.error("Error connecting to Telegram:", err);
    }
}

send();
