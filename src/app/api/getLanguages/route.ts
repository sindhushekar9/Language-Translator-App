// app/api/getLanguages/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const deeplApiUrl = 'https://api-free.deepl.com/v2/languages?type=target';
    const apiKey = "03a9456b-2f23-4dd3-b4cb-957077270a62:fx";

    if (!apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 500 });
    }

    try {
        const response = await fetch(deeplApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'User-Agent': 'YourApp/1.2.3',
            },
        });

        if (!response.ok) {
            console.error("Failed response:", response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to fetch languages' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching languages:', error.message || error);
        return NextResponse.json({ error: 'Server error', details: error.message || error }, { status: 500 });
    }
}
