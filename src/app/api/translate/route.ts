// app/api/translate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { text, targetLang } = await request.json();
    const deeplApiUrl = 'https://cors-anywhere.herokuapp.com/https://api-free.deepl.com/v2/translate';
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 500 });
    }

    try {
        const response = await fetch(deeplApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text,
                target_lang: targetLang,
            }).toString(),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to translate text' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ translatedText: data.translations[0].text });
    } catch (error: any) {
        console.error('Error translating text:', error.message || error);
        return NextResponse.json({ error: 'Server error', details: error.message || error }, { status: 500 });
    }
}
