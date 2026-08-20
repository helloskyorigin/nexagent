import { ContextItem, ContextRelationship, Evidence, Memory, Goal, Project, Person, Document } from './models';

export interface ContextRetrievalQuery {
  userId: string;
  query: string;
  limit?: number;
  timeRange?: {
    start?: string;
    end?: string;
  };
  sources?: string[];
}

export interface RetrievalResult {
  items: ContextItem[];
  evidences: Evidence[];
  totalFound: number;
}

export interface ContextEngine {
  retrieveContext(query: ContextRetrievalQuery): Promise<RetrievalResult>;
  normalizeContext(rawData: unknown, sourceType: string): ContextItem;
  buildContextGraph(userId: string, items: ContextItem[]): Promise<ContextRelationship[]>;
}

export interface RetrievalService {
  searchSemantic(userId: string, query: string, limit?: number): Promise<ContextItem[]>;
  searchByEntities(userId: string, entityIds: string[]): Promise<ContextItem[]>;
}

export interface MemoryService {
  addMemory(userId: string, memory: Omit<Memory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Memory>;
  getMemories(userId: string, tags?: string[]): Promise<Memory[]>;
  deleteMemory(userId: string, memoryId: string): Promise<boolean>;
}

export interface RelationshipService {
  linkItems(
    userId: string,
    sourceId: string,
    targetId: string,
    type: ContextRelationship['relationshipType'],
    weight?: number
  ): Promise<ContextRelationship>;
  getRelationships(userId: string, itemId: string): Promise<ContextRelationship[]>;
}

export interface EvidenceService {
  gatherEvidence(userId: string, claim: string): Promise<Evidence[]>;
  verifyEvidence(userId: string, evidenceId: string): Promise<boolean>;
}
