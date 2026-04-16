
export async function uploadFileToAI(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://sii3.top/api/upload.php', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Failed to upload file');
    const url = await response.text();
    return url.trim();
}

export async function askVOZAI(text: string, fileUrls: string[] = []): Promise<string> {
    const systemPrompt = `You are VOZ AI powered by GPT-5.2. Respond in the user's language. If the user sends only text, respond normally. If files are provided, analyze them.`;
    
    const fullText = `${systemPrompt}\n\nUser: ${text}`;
    
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: fullText,
                fileUrls: fileUrls
            })
        });

        if (!response.ok) throw new Error('AI Engine Offline');
        const result = await response.text();
        
        // Clean up response
        return result.replace(/^(VOZ AI:|ChatGPT:)/i, '').trim();
    } catch (err) {
        console.error("AI Error:", err);
        throw err;
    }
}
