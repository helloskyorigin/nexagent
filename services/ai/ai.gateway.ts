import { GoogleGenAI } from '@google/genai';
import { Nexorbit_CONFIG } from '../../config';
import { AIService, ModelRouter, AIRequest, AIResponse, TaskType } from '../../types/ai';
import { ErrorCode, NexorbitError } from '../../types/errors';
import { logger } from '../../lib/logger';
import { UserIsolationService } from '../security/user-isolation.service';

export class NexorbitModelRouter implements ModelRouter {
  public routeTask(taskType: TaskType): string {
    switch (taskType) {
      case 'HEAVY_AGENT_TASK':
      case 'REASONING':
      case 'RESEARCH':
        return Nexorbit_CONFIG.ai.heavyReasoningModel;

      case 'VISION':
      case 'DOCUMENT_ANALYSIS':
        return Nexorbit_CONFIG.ai.visionModel;

      case 'ASK_MY_WORLD':
      case 'CONNECT_THE_DOTS':
      case 'VOICE':
      case 'AUDIO_BRIEFING':
      case 'IMAGE_GENERATION':
      default:
        return Nexorbit_CONFIG.ai.defaultModel;
    }
  }
}

export class AIGatewayService implements AIService {
  private readonly router: ModelRouter;

  constructor(router?: ModelRouter) {
    this.router = router || new NexorbitModelRouter();
  }

  public async processTask(request: AIRequest): Promise<AIResponse> {
    const validUserId = UserIsolationService.sanitizeUserId(request.userId);
    const startTime = Date.now();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn('GEMINI_API_KEY process variable not detected', {
        userId: validUserId,
        operation: 'processTask',
        status: 'ERROR',
      });
      throw new NexorbitError(
        ErrorCode.AI_GATEWAY_ERROR,
        'Server AI API Key is not configured. Please add GEMINI_API_KEY in environment variables.',
        500
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const selectedModel = this.router.routeTask(request.taskType);

    try {
      let promptText = request.prompt;
      if (request.systemInstruction) {
        promptText = `${request.systemInstruction}\n\nUser Request: ${request.prompt}`;
      }

      if (request.contextItems && request.contextItems.length > 0) {
        promptText += `\n\n[Context Data]:\n${request.contextItems.join('\n---\n')}`;
      }

      const contents: any[] = [{ role: 'user', parts: [{ text: promptText }] }];
      
      if (request.images && request.images.length > 0) {
        request.images.forEach(img => {
          contents[0].parts.push({
            inlineData: {
              mimeType: img.mimeType,
              data: img.data,
            },
          });
        });
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
      });

      const durationMs = Date.now() - startTime;

      logger.info(`AI Gateway task completed: ${request.taskType}`, {
        userId: validUserId,
        operation: 'processTask',
        status: 'SUCCESS',
        modelUsed: selectedModel,
        durationMs,
      });

      return {
        text: response.text || 'No response generated.',
        taskType: request.taskType,
        modelUsed: selectedModel,
        durationMs,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      logger.error(`AI Gateway error during ${request.taskType}`, {
        userId: validUserId,
        operation: 'processTask',
        status: 'ERROR',
        durationMs,
        error,
      });

      throw new NexorbitError(
        ErrorCode.AI_GATEWAY_ERROR,
        `AI Gateway operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }
}
