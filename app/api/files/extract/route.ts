import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/file-processing';
import { AIGatewayService } from '@/services/ai/ai.gateway';

const aiGateway = new AIGatewayService();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string || 'anonymous';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // V1 Limits: 10MB per file
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const filename = file.name;

    let extractedContent = '';

    if (mimeType.startsWith('image/')) {
      // Process image using vision path
      const base64Data = buffer.toString('base64');
      const visionResponse = await aiGateway.processTask({
        userId,
        taskType: 'VISION',
        prompt: 'Describe this image in detail. If it contains text, perform OCR and provide the text. If it is a diagram, explain it.',
        images: [{ mimeType, data: base64Data }],
      });
      extractedContent = visionResponse.text;
    } else {
      extractedContent = await extractTextFromFile(buffer, mimeType, filename);
    }

    return NextResponse.json({
      success: true,
      data: {
        filename,
        mimeType,
        size: file.size,
        content: extractedContent,
      }
    });

  } catch (error: any) {
    console.error('File extraction error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to process file' 
    }, { status: 500 });
  }
}
