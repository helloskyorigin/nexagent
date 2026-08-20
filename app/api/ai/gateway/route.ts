import { NextRequest, NextResponse } from 'next/server';
import { AIGatewayService } from '@/services/ai/ai.gateway';
import { CreditService } from '@/services/credits/credit.service';
import { TaskType } from '@/types/ai';
import { OperationType } from '@/config';
import { handleApiError } from '@/lib/errors';

const aiGateway = new AIGatewayService();
const creditService = new CreditService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user_demo_phase0';
    const taskType: TaskType = body.taskType || 'ASK_MY_WORLD';
    const prompt = body.prompt || 'Summarize the current system state for Nexorbit.';

    const operationMap: Record<TaskType, OperationType> = {
      ASK_MY_WORLD: 'ASK_MY_WORLD',
      CONNECT_THE_DOTS: 'CONNECT_THE_DOTS',
      REASONING: 'CONNECT_THE_DOTS',
      RESEARCH: 'DEEP_RESEARCH',
      VISION: 'DOCUMENT_ANALYSIS',
      VOICE: 'VOICE',
      AUDIO_BRIEFING: 'AUDIO_BRIEFING',
      IMAGE_GENERATION: 'IMAGE_GENERATION',
      DOCUMENT_ANALYSIS: 'DOCUMENT_ANALYSIS',
      HEAVY_AGENT_TASK: 'HEAVY_AGENT_TASK',
    };

    const operation = operationMap[taskType] || 'ASK_MY_WORLD';

    const creditResult = await creditService.consumeCredits(userId, operation, {
      taskType,
      promptSnippet: prompt.substring(0, 50),
    });

    const aiResponse = await aiGateway.processTask({
      userId,
      taskType,
      prompt,
      systemInstruction: body.systemInstruction,
      contextItems: body.contextItems,
    });

    return NextResponse.json({
      success: true,
      data: {
        aiResponse,
        creditsConsumed: creditResult.consumed,
        remainingCredits: creditResult.remainingBalance,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
