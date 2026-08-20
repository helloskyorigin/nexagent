import {
  ContextEngine,
  RetrievalService,
  MemoryService,
  RelationshipService,
  EvidenceService,
  ContextRetrievalQuery,
  RetrievalResult,
} from '../../types/brain';
import {
  ContextItem,
  ContextRelationship,
  Evidence,
  Memory,
} from '../../types/models';
import { inMemoryStore } from '../../lib/firebase';
import { UserIsolationService } from '../security/user-isolation.service';

export class BrainContextService
  implements ContextEngine, RetrievalService, MemoryService, RelationshipService, EvidenceService
{
  // 1. Context Engine
  async retrieveContext(query: ContextRetrievalQuery): Promise<RetrievalResult> {
    const validUserId = UserIsolationService.sanitizeUserId(query.userId);
    const items = inMemoryStore.queryCollection('contextItems', 'userId', validUserId) as unknown as ContextItem[];
    const evidences = inMemoryStore.queryCollection('evidences', 'userId', validUserId) as unknown as Evidence[];

    const filteredItems = items.filter((item) =>
      item.content.toLowerCase().includes(query.query.toLowerCase())
    );

    return {
      items: filteredItems.slice(0, query.limit || 10),
      evidences: evidences.slice(0, 5),
      totalFound: filteredItems.length,
    };
  }

  normalizeContext(rawData: unknown, sourceType: string): ContextItem {
    return {
      id: `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: (rawData as Record<string, unknown>)?.userId as string || 'system',
      sourceType: sourceType as ContextItem['sourceType'],
      sourceId: (rawData as Record<string, unknown>)?.id as string || 'external',
      content: typeof rawData === 'string' ? rawData : JSON.stringify(rawData),
      metadata: typeof rawData === 'object' && rawData !== null ? (rawData as Record<string, unknown>) : {},
      timestamp: new Date().toISOString(),
    };
  }

  async buildContextGraph(userId: string, items: ContextItem[]): Promise<ContextRelationship[]> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const relationships: ContextRelationship[] = [];

    for (let i = 0; i < items.length - 1; i++) {
      const rel = await this.linkItems(
        validUserId,
        items[i].id,
        items[i + 1].id,
        'REFERENCES',
        0.8
      );
      relationships.push(rel);
    }

    return relationships;
  }

  // 2. Retrieval Service
  async searchSemantic(userId: string, query: string, limit = 10): Promise<ContextItem[]> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const result = await this.retrieveContext({ userId: validUserId, query, limit });
    return result.items;
  }

  async searchByEntities(userId: string, entityIds: string[]): Promise<ContextItem[]> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const all = inMemoryStore.queryCollection('contextItems', 'userId', validUserId) as unknown as ContextItem[];
    return all.filter((item) => entityIds.includes(item.sourceId));
  }

  // 3. Memory Service
  async addMemory(
    userId: string,
    memory: Omit<Memory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Memory> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const memoryId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newMemory: Memory = {
      ...memory,
      id: memoryId,
      userId: validUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc('memories', memoryId, newMemory as unknown as Record<string, unknown>);
    return newMemory;
  }

  async getMemories(userId: string, tags?: string[]): Promise<Memory[]> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const memories = inMemoryStore.queryCollection('memories', 'userId', validUserId) as unknown as Memory[];

    if (!tags || tags.length === 0) return memories;
    return memories.filter((m) => m.tags.some((t) => tags.includes(t)));
  }

  async deleteMemory(userId: string, memoryId: string): Promise<boolean> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const memory = inMemoryStore.getDoc('memories', memoryId) as Memory | null;

    if (!memory) return false;
    UserIsolationService.validateOwnership(memory.userId, validUserId);

    return inMemoryStore.deleteDoc('memories', memoryId);
  }

  // 4. Relationship Service
  async linkItems(
    userId: string,
    sourceId: string,
    targetId: string,
    type: ContextRelationship['relationshipType'],
    weight = 1.0
  ): Promise<ContextRelationship> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const relId = `rel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const relationship: ContextRelationship = {
      id: relId,
      userId: validUserId,
      sourceItemId: sourceId,
      targetItemId: targetId,
      relationshipType: type,
      weight,
      createdAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc('contextRelationships', relId, relationship as unknown as Record<string, unknown>);
    return relationship;
  }

  async getRelationships(userId: string, itemId: string): Promise<ContextRelationship[]> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const all = inMemoryStore.queryCollection('contextRelationships', 'userId', validUserId) as unknown as ContextRelationship[];
    return all.filter((r) => r.sourceItemId === itemId || r.targetItemId === itemId);
  }

  // 5. Evidence Service
  async gatherEvidence(userId: string, claim: string): Promise<Evidence[]> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const evidences = inMemoryStore.queryCollection('evidences', 'userId', validUserId) as unknown as Evidence[];
    return evidences.filter((e) => e.snippet.toLowerCase().includes(claim.toLowerCase()));
  }

  async verifyEvidence(userId: string, evidenceId: string): Promise<boolean> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const evidence = inMemoryStore.getDoc('evidences', evidenceId) as Evidence | null;
    if (!evidence) return false;

    UserIsolationService.validateOwnership(evidence.userId, validUserId);
    return evidence.confidenceScore >= 0.7;
  }
}
