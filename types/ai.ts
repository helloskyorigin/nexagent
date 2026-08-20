export type TaskType =
  | 'ASK_MY_WORLD'
  | 'CONNECT_THE_DOTS'
  | 'REASONING'
  | 'RESEARCH'
  | 'VISION'
  | 'VOICE'
  | 'AUDIO_BRIEFING'
  | 'IMAGE_GENERATION'
  | 'DOCUMENT_ANALYSIS'
  | 'HEAVY_AGENT_TASK';

export interface AIRequest {
  userId: string;
  taskType: TaskType;
  prompt: string;
  systemInstruction?: string;
  contextItems?: string[];
  images?: Array<{ mimeType: string; data: string }>;
  temperature?: number;
}

export interface AIResponse {
  text: string;
  taskType: TaskType;
  modelUsed: string;
  usageMetadata?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
  durationMs: number;
}

export interface ModelRouter {
  routeTask(taskType: TaskType): string;
}

export interface AIService {
  processTask(request: AIRequest): Promise<AIResponse>;
}
