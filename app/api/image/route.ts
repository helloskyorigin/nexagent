import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, style, aspectRatio } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json({ error: 'Cloudflare credentials not configured' }, { status: 500 });
    }

    // Build final prompt with style if provided
    let finalPrompt = prompt;
    if (style && style !== 'None') {
      finalPrompt = `${prompt}, in ${style} style`;
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-2-klein-4b`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          // Note: Cloudflare's Flux model might take specific dimensions instead of aspect ratio
          // We can map aspect ratios to dimensions if needed, but for now we'll focus on the prompt.
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudflare API Error:', errorText);
      return NextResponse.json({ error: 'Image generation failed' }, { status: response.status });
    }

    // The response from Cloudflare AI image models is usually binary image data
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    
    const mimeType = 'image/jpeg'; // or image/png based on the response
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    return NextResponse.json({ imageUrl: dataUrl, success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
