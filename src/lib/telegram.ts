export const sendTelegramNotification = async (token: string, chatId: string, message: string) => {
    if (!token || !chatId) return;
    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (err) {
        console.error("Telegram Error:", err);
    }
};

export const sendTelegramPhoto = async (token: string, chatId: string, photoUrl: string, caption: string) => {
    if (!token || !chatId || !photoUrl) return;
    try {
        const url = `https://api.telegram.org/bot${token}/sendPhoto`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                photo: photoUrl,
                caption: caption,
                parse_mode: 'HTML'
            })
        });
    } catch (err) {
        console.error("Telegram Photo Error:", err);
    }
};
