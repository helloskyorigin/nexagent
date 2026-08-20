import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, style, aspectRatio } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const cleanPrompt = prompt.trim();

    // Build final prompt with style if provided and not 'None'
    let finalPrompt = cleanPrompt;
    if (style && style !== 'None') {
      finalPrompt = `${cleanPrompt}, in ${style} style`;
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    // 1. Try Cloudflare Workers AI if credentials are fully configured
    if (accountId && apiToken) {
      try {
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
            }),
          }
        );

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString('base64');
          const mimeType = 'image/jpeg';
          const dataUrl = `data:${mimeType};base64,${base64Image}`;

          return NextResponse.json({ imageUrl: dataUrl, success: true, provider: 'cloudflare' });
        } else {
          const errorText = await response.text();
          console.warn('Cloudflare API returned error status:', response.status, errorText);
        }
      } catch (cfError) {
        console.warn('Cloudflare image generation request error:', cfError);
      }
    }

    // 2. Try Gemini Imagen if GEMINI_API_KEY is configured
    const ai = getGeminiClient();
    if (ai) {
      try {
        const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
        const chosenRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

        const imagenResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: finalPrompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: chosenRatio as any,
          },
        });

        if (imagenResponse.generatedImages && imagenResponse.generatedImages.length > 0) {
          const imgBytes = imagenResponse.generatedImages[0].image?.imageBytes;
          if (imgBytes) {
            const dataUrl = `data:image/jpeg;base64,${imgBytes}`;
            return NextResponse.json({ imageUrl: dataUrl, success: true, provider: 'gemini' });
          }
        }
      } catch (geminiError) {
        console.error('Gemini Imagen error:', geminiError);
      }
    }

    // If neither provider succeeded or credentials are missing
    if (!accountId && !apiToken && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Image generation service is not configured.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to generate image at this moment. Please try again.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Image API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

