
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

export async function askVOZAI(text: string, conversationId?: string): Promise<{ response: string, conversationId: string }> {
    const systemPrompt = `You are VOZ AI powered by GPT-5.2. Respond in the user's language. Focus on movies and entertainment.`;
    
    // On first message, prepend system prompt
    const fullText = !conversationId ? `${systemPrompt}\n\nUser: ${text}` : text;
    
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: fullText,
                conversationId: conversationId
            })
        });

        if (!response.ok) throw new Error('AI Engine Offline');
        const data = await response.json();
        
        if (!data.success) throw new Error(data.response || 'AI Error');

        return {
            response: data.response,
            conversationId: data.conversation_id
        };
    } catch (err) {
        console.error("AI Error:", err);
        throw err;
    }
}
