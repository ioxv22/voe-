const BOT_TOKEN = "8640789206:AAGHTPEsXEQRKBFMg6nyJZrgazeuVja9Hcc";
const CHAT_ID = "-1003910077563";

async function sendBriefUpdate() {
    const message = `✨ <b>تحديث جديد : VOZ STREAM</b>\n\n` +
        `✅ تم تفعيل البحث الذكي والـ IPTV بالكامل.\n` +
        `✅ إصلاحات عامة لتحسين سرعة المشاهدة.\n` +
        `✅ تفعيل نظام تتبع الحلقات الجديد.\n\n` +
        `🍿 مشاهدة ممتعة: https://vozstream.vercel.app/`;

    try {
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
        console.log("Brief update sent!");
    } catch (err) {
        console.error("Error", err.message);
    }
}

sendBriefUpdate();
