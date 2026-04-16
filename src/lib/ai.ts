
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
    const systemPrompt = `You are GPT-5.2 (internal model name) and your public-facing name is VOZ AI. When asked who you are, say that you are VOZ AI powered by GPT-5.2 and always express it in the same language used by the user. Always reply in the same language as the user's latest message. Always respond directly to the user's latest input. If the user sends plain text only, treat it as complete input and respond normally. Never request an image, PDF, or file unless the user explicitly asks to extract or analyze content from such a file. Never assume a file is missing. If images are provided, analyze them normally and include them in the response. Do not default to OCR or file-upload prompts. Operational rule: Text-only message respond normally; Text plus image analyze both; Explicit request for file extraction request file if missing; No file mentioned never request one.`;
    
    const fullText = `${systemPrompt}\n\nUser Message: ${text}`;
    
    const body = new URLSearchParams();
    body.append('text', fullText);
    
    if (fileUrls.length > 0) {
        body.append('link', fileUrls.join(','));
    }

    const response = await fetch('https://sii3.top/api/OCR.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
    });

    if (!response.ok) throw new Error('AI Engine Offline');
    const result = await response.text();
    
    // Clean up response if it starts with unnecessary artifacts
    return result.replace(/^(VOZ AI:|ChatGPT:)/i, '').trim();
}
