import { NextRequest, NextResponse } from 'next/server';
import { BrainContextService } from '@/services/brain/context.service';
import { handleApiError } from '@/lib/errors';
import { requireAuthenticatedUser } from '@/lib/firebase-admin';

const brainService = new BrainContextService();

export async function GET(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const { searchParams } = new URL(req.url);

    const memories = await brainService.getMemories(userId);
    const contextResult = await brainService.retrieveContext({
      userId,
      query: searchParams.get('query') || '',
    });

    return NextResponse.json({
      success: true,
      data: {
        userId,
        memoriesCount: memories.length,
        memories,
        contextFound: contextResult.totalFound,
        contextItems: contextResult.items,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const decodedToken = await requireAuthenticatedUser(req);
    const userId = decodedToken.uid;

    const body = await req.json();

    if (body.type === 'ADD_MEMORY') {
      const memory = await brainService.addMemory(userId, {
        content: body.content || 'User prefers detailed executive summaries.',
        category: body.category || 'PREFERENCE',
        tags: body.tags || ['summary', 'format'],
        confidenceScore: body.confidenceScore || 0.95,
      });

      return NextResponse.json({ success: true, data: memory });
    }

    return NextResponse.json({
      success: true,
      message: 'Brain service boundary active.',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
