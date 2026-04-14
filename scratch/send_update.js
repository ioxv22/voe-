const BOT_TOKEN = "8640789206:AAGHTPEsXEQRKBFMg6nyJZrgazeuVja9Hcc";
const CHAT_ID = "-1003910077563";

async function sendUpdateNotification() {
    const message = `🚀 <b>VOZ STREAM : الكود المصدري الجديد جاهز!</b>\n\n` +
        `🛠 <b>قائمة التحديثات والميزات الجديدة:</b>\n\n` +
        `🛡 <b>تأمين الموقع (Security):</b> تم سد كافة الثغرات وإزالة كلمات المرور الافتراضية.\n` +
        `🧠 <b>البحث الذكي (AI Search):</b> ابحث عن الأفلام بوصفها (مثال: فيلم فضائي حزين).\n` +
        `⚽ <b>البث المباشر (IPTV):</b> قسم كامل للقنوات الرياضية، المسلسلات، والتمثيليات.\n` +
        `✅ <b>تتبع المشاهدة:</b> ظهور علامة صح على الحلقات التي شاهدتها سابقاً.\n` +
        `💎 <b>اشتراكات VIP:</b> تفعيل سيرفرات VIP عالية السرعة حصرياً للأعضاء.\n` +
        `🔧 <b>تحسين الأداء:</b> إصلاح أخطاء البرمجة (Build Fixes) وتسريع استجابة الخوادم.\n\n` +
        `📺 شاهد الآن: https://vozstream.vercel.app/`;

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
        console.log("Update notification sent to Telegram!");
    } catch (err) {
        console.error("Error sending update", err.message);
    }
}

sendUpdateNotification();
