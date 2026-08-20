'use client';

import {
  TaskItem,
  TaskStatus as SharedTaskStatus,
  getStoredTasks as getUnifiedTasks,
  saveTasks as saveUnifiedTasks,
  createTask as createUnifiedTask,
  updateTaskStatus as updateUnifiedTaskStatus,
  renameTask as renameUnifiedTask,
  deleteTask as deleteUnifiedTask,
  subscribeToTasks as subscribeToUnifiedTasks,
  TaskApproval,
  TaskActivity,
  TaskTool,
  StepStatus as UnifiedStepStatus,
} from '../tasks/taskService';

export type TaskStatus =
  | 'running'
  | 'paused'
  | 'waiting_approval'
  | 'completed'
  | 'failed'
  | 'scheduled';

export type StepStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'waiting_approval';

export interface ExecutionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: StepStatus;
  tool?: string;
}

export type { TaskTool, TaskApproval, TaskActivity };

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number; // 0 to 100
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  toolsUsed: TaskTool[];
  executionPlan: ExecutionStep[];
  approvals: TaskApproval[];
  activityLog: TaskActivity[];
  connectedTools: string[];
}

function toAgentTask(t: TaskItem): AgentTask {
  let status: TaskStatus = 'running';
  if (t.status === 'in_progress' || t.status === 'running' || t.status === 'active') {
    status = 'running';
  } else if (t.status === 'paused') {
    status = 'paused';
  } else if (t.status === 'waiting_approval') {
    status = 'waiting_approval';
  } else if (t.status === 'completed') {
    status = 'completed';
  } else if (t.status === 'failed') {
    status = 'failed';
  } else if (t.status === 'scheduled') {
    status = 'scheduled';
  }

  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status,
    progress: typeof t.progress === 'number' ? t.progress : 0,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    createdBy: t.createdBy === 'you' ? 'You' : 'Agent',
    toolsUsed: t.toolsUsed || [],
    executionPlan: (t.executionPlan || []) as ExecutionStep[],
    approvals: t.approvals || [],
    activityLog: t.activityLog || [],
    connectedTools: t.connectedTools || [],
  };
}

export function getStoredTasks(): AgentTask[] {
  const unified = getUnifiedTasks();
  return unified.map(toAgentTask);
}

export function saveTasks(tasks: AgentTask[]): void {
  const currentUnified = getUnifiedTasks();
  const map = new Map(currentUnified.map((u) => [u.id, u]));

  const updatedUnified: TaskItem[] = tasks.map((at) => {
    const existing = map.get(at.id);
    return {
      ...(existing || {}),
      id: at.id,
      title: at.title,
      description: at.description,
      status: at.status === 'running' ? 'in_progress' : at.status,
      progress: at.progress,
      source: existing?.source || 'agent',
      createdAt: existing?.createdAt || at.createdAt || new Date().toISOString(),
      updatedAt: at.updatedAt || new Date().toISOString(),
      createdBy: at.createdBy.toLowerCase() === 'you' ? 'you' : 'agent',
      connectedTools: at.connectedTools,
      toolsUsed: at.toolsUsed,
      executionPlan: at.executionPlan as UnifiedStepStatus[],
      approvals: at.approvals,
      activityLog: at.activityLog,
    };
  });

  saveUnifiedTasks(updatedUnified);
}

export function createAgentTask(data: {
  title: string;
  description?: string;
  selectedTools?: string[];
  requireApproval?: boolean;
}): AgentTask {
  const created = createUnifiedTask({
    title: data.title,
    description: data.description,
    source: 'agent',
    status: 'in_progress',
    progress: 25,
    connectedTools: data.selectedTools || ['Web Search', 'Files'],
    requireApproval: data.requireApproval,
  });

  return toAgentTask(created);
}

export function updateAgentTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
  progress?: number
): void {
  const mappedStatus: SharedTaskStatus =
    newStatus === 'running' ? 'in_progress' : newStatus;
  updateUnifiedTaskStatus(taskId, mappedStatus, progress);
}

export function respondToApproval(
  taskId: string,
  approvalId: string,
  decision: 'approved' | 'rejected'
): void {
  const current = getUnifiedTasks();
  const updated = current.map((t) => {
    if (t.id === taskId) {
      const nextApprovals = (t.approvals || []).map((a) =>
        a.id === approvalId ? { ...a, status: decision } : a
      );

      const hasPendingLeft = nextApprovals.some((a) => a.status === 'pending');
      const nextStatus: SharedTaskStatus =
        decision === 'approved' && !hasPendingLeft ? 'in_progress' : decision === 'rejected' ? 'paused' : t.status;

      const nextPlan = (t.executionPlan || []).map((s) => {
        if (s.status === 'waiting_approval') {
          return {
            ...s,
            status: decision === 'approved' ? ('in_progress' as const) : ('failed' as const),
          };
        }
        return s;
      });

      const nowIso = new Date().toISOString();
      const newActivity: TaskActivity = {
        id: `act-${Date.now()}`,
        event: `Approval request ${decision}`,
        timestamp: nowIso,
        type: decision === 'approved' ? 'success' : 'warning',
      };

      return {
        ...t,
        status: nextStatus,
        approvals: nextApprovals,
        executionPlan: nextPlan,
        activityLog: [newActivity, ...(t.activityLog || [])],
        updatedAt: nowIso,
      };
    }
    return t;
  });

  saveUnifiedTasks(updated);
}

export function addInstructionToTask(taskId: string, instructionText: string): void {
  if (!instructionText.trim()) return;
  const current = getUnifiedTasks();
  const nowIso = new Date().toISOString();
  const updated = current.map((t) => {
    if (t.id === taskId) {
      const newActivity: TaskActivity = {
        id: `act-${Date.now()}`,
        event: `User instruction added: "${instructionText.trim()}"`,
        timestamp: nowIso,
        type: 'info',
      };
      return {
        ...t,
        activityLog: [newActivity, ...(t.activityLog || [])],
        updatedAt: nowIso,
      };
    }
    return t;
  });
  saveUnifiedTasks(updated);
}

export function renameAgentTask(taskId: string, newTitle: string): void {
  renameUnifiedTask(taskId, newTitle);
}

export function deleteAgentTask(taskId: string): void {
  deleteUnifiedTask(taskId);
}

export function subscribeToAgentTasks(callback: (tasks: AgentTask[]) => void): () => void {
  return subscribeToUnifiedTasks((unifiedList) => {
    callback(unifiedList.map(toAgentTask));
  });
}
