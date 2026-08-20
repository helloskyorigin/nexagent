'use client';

export type TaskStatus =
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'scheduled'
  | 'failed'
  | 'paused'
  | 'waiting_approval'
  | 'running'; // backwards compatible with agent runner

export type TaskSource = 'agent' | 'chat' | 'scheduled' | 'manual';

export type TaskIconType =
  | 'document'
  | 'mail'
  | 'globe'
  | 'calendar'
  | 'folder'
  | 'code'
  | 'bot'
  | 'task';

export interface StepStatus {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'waiting_approval';
  tool?: string;
}

export interface TaskTool {
  name: string;
  status: 'active' | 'waiting' | 'idle' | 'connected';
  icon?: string;
}

export interface TaskApproval {
  id: string;
  action: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface TaskActivity {
  id: string;
  event: string;
  timestamp: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress?: number; // 0 to 100, undefined if not measurable
  source: TaskSource;
  createdAt: string; // ISO 8601 string
  updatedAt: string;
  scheduledFor?: string; // ISO 8601 string if scheduled
  createdBy: string; // "you" or "agent"
  conversationId?: string;
  connectedTools?: string[];
  toolsUsed?: TaskTool[];
  executionPlan?: StepStatus[];
  approvals?: TaskApproval[];
  activityLog?: TaskActivity[];
  iconType?: TaskIconType;
  tags?: string[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  source?: TaskSource;
  status?: TaskStatus;
  progress?: number;
  scheduledFor?: string;
  connectedTools?: string[];
  iconType?: TaskIconType;
  conversationId?: string;
  requireApproval?: boolean;
}

const STORAGE_KEY = 'nexorbit_tasks';
const LEGACY_STORAGE_KEY = 'nexorbit_agent_tasks';
const LISTENERS = new Set<() => void>();

function notifyListeners() {
  LISTENERS.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error notifying task listener:', e);
    }
  });
}

/**
 * Infer an appropriate icon type based on title and description keywords
 */
export function inferTaskIconType(title: string, description?: string): TaskIconType {
  const combined = `${title} ${description || ''}`.toLowerCase();
  if (combined.includes('email') || combined.includes('mail') || combined.includes('inbox') || combined.includes('message')) {
    return 'mail';
  }
  if (combined.includes('meeting') || combined.includes('calendar') || combined.includes('schedule') || combined.includes('event')) {
    return 'calendar';
  }
  if (combined.includes('web') || combined.includes('site') || combined.includes('competitor') || combined.includes('online') || combined.includes('url')) {
    return 'globe';
  }
  if (combined.includes('file') || combined.includes('drive') || combined.includes('folder') || combined.includes('organize') || combined.includes('docs')) {
    return 'folder';
  }
  if (combined.includes('code') || combined.includes('repo') || combined.includes('github') || combined.includes('pr') || combined.includes('bug')) {
    return 'code';
  }
  if (combined.includes('research') || combined.includes('report') || combined.includes('summarize') || combined.includes('paper') || combined.includes('content') || combined.includes('idea')) {
    return 'document';
  }
  return 'document';
}

/**
 * Retrieve all real stored tasks from local persistence.
 * If empty, returns [] — NO fake tasks are ever created.
 */
export function getStoredTasks(): TaskItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: TaskItem[] = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }

    // Check legacy agent tasks migration
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
        const migrated: TaskItem[] = legacyParsed.map((t: any) => ({
          id: t.id || `task-${Date.now()}`,
          title: t.title || 'Untitled Task',
          description: t.description || '',
          status: t.status === 'running' ? 'in_progress' : t.status || 'active',
          progress: typeof t.progress === 'number' ? t.progress : undefined,
          source: 'agent' as TaskSource,
          createdAt: t.createdAt && !isNaN(Date.parse(t.createdAt)) ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: t.updatedAt && !isNaN(Date.parse(t.updatedAt)) ? new Date(t.updatedAt).toISOString() : new Date().toISOString(),
          createdBy: t.createdBy === 'You' || t.createdBy === 'you' ? 'you' : 'agent',
          connectedTools: t.connectedTools || [],
          toolsUsed: t.toolsUsed || [],
          executionPlan: t.executionPlan || [],
          approvals: t.approvals || [],
          activityLog: t.activityLog || [],
          iconType: inferTaskIconType(t.title, t.description),
        }));
        saveTasks(migrated);
        return migrated;
      }
    }

    return [];
  } catch (e) {
    console.error('Error reading nexorbit tasks storage:', e);
    return [];
  }
}

/**
 * Save tasks to storage and sync legacy storage key for agent backwards-compatibility
 */
export function saveTasks(tasks: TaskItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    // Mirror to legacy storage for seamless Agent views
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(tasks));
    notifyListeners();
  } catch (e) {
    console.error('Error saving nexorbit tasks storage:', e);
  }
}

/**
 * Create a new real task
 */
export function createTask(data: CreateTaskInput): TaskItem {
  const now = new Date();
  const nowIso = now.toISOString();
  const source = data.source || 'manual';
  const iconType = data.iconType || inferTaskIconType(data.title, data.description);

  let initialStatus: TaskStatus = data.status || 'active';
  if (source === 'scheduled' || data.scheduledFor) {
    initialStatus = 'scheduled';
  } else if (source === 'agent') {
    initialStatus = 'in_progress';
  }

  const tools: TaskTool[] = (data.connectedTools || []).map((toolName) => ({
    name: toolName,
    status: 'active',
  }));

  const steps: StepStatus[] =
    source === 'agent'
      ? [
          {
            id: `step-1`,
            stepNumber: 1,
            title: 'Analyze Goal & Context',
            description: 'Decomposing task requirements and context.',
            status: 'completed',
          },
          {
            id: `step-2`,
            stepNumber: 2,
            title: 'Execute Actions & Gather Data',
            description: 'Working with connected workspace integrations.',
            status: 'in_progress',
            tool: data.connectedTools?.[0] || 'Web Search',
          },
          {
            id: `step-3`,
            stepNumber: 3,
            title: 'Review Findings & Finalize',
            description: 'Generating output and organizing deliverables.',
            status: 'pending',
          },
        ]
      : [];

  if (data.requireApproval && source === 'agent') {
    steps.push({
      id: `step-approval`,
      stepNumber: steps.length + 1,
      title: 'Awaiting User Authorization',
      description: 'Pending authorization before committing external changes.',
      status: 'waiting_approval',
    });
  }

  const approvals: TaskApproval[] = data.requireApproval
    ? [
        {
          id: `appr-${Date.now()}`,
          action: 'Authorize workspace changes',
          details: 'Nexorbit is ready to apply updates to your connected workspace tools.',
          status: 'pending',
          requestedAt: nowIso,
        },
      ]
    : [];

  const activityLog: TaskActivity[] = [
    {
      id: `act-${Date.now()}-1`,
      event: `Task created: "${data.title}"`,
      timestamp: nowIso,
      type: 'info',
    },
  ];

  if (source === 'agent') {
    activityLog.push({
      id: `act-${Date.now()}-2`,
      event: 'Nexorbit Agent initialized execution plan',
      timestamp: nowIso,
      type: 'info',
    });
  }

  const newTask: TaskItem = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: data.title.trim(),
    description: (data.description || '').trim(),
    status: initialStatus,
    progress: data.progress,
    source,
    createdAt: nowIso,
    updatedAt: nowIso,
    scheduledFor: data.scheduledFor,
    createdBy: source === 'agent' ? 'agent' : 'you',
    conversationId: data.conversationId,
    connectedTools: data.connectedTools || [],
    toolsUsed: tools,
    executionPlan: steps,
    approvals,
    activityLog,
    iconType,
  };

  const current = getStoredTasks();
  saveTasks([newTask, ...current]);
  return newTask;
}

/**
 * Update an existing task
 */
export function updateTask(taskId: string, partial: Partial<TaskItem>): TaskItem | null {
  const current = getStoredTasks();
  let updatedItem: TaskItem | null = null;

  const next = current.map((t) => {
    if (t.id === taskId) {
      const nowIso = new Date().toISOString();
      const updated: TaskItem = {
        ...t,
        ...partial,
        updatedAt: nowIso,
      };
      updatedItem = updated;
      return updated;
    }
    return t;
  });

  if (updatedItem) {
    saveTasks(next);
  }
  return updatedItem;
}

/**
 * Update task status and optional progress
 */
export function updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
  progress?: number
): void {
  const current = getStoredTasks();
  const nowIso = new Date().toISOString();

  const next = current.map((t) => {
    if (t.id === taskId) {
      const nextProgress =
        progress !== undefined
          ? progress
          : newStatus === 'completed'
          ? 100
          : t.progress;

      const newActivity: TaskActivity = {
        id: `act-${Date.now()}`,
        event: `Status updated to ${formatStatusLabel(newStatus)}`,
        timestamp: nowIso,
        type: newStatus === 'completed' ? 'success' : newStatus === 'failed' ? 'error' : 'info',
      };

      return {
        ...t,
        status: newStatus,
        progress: nextProgress,
        updatedAt: nowIso,
        activityLog: [newActivity, ...(t.activityLog || [])],
      };
    }
    return t;
  });

  saveTasks(next);
}

/**
 * Duplicate a task
 */
export function duplicateTask(taskId: string): TaskItem | null {
  const current = getStoredTasks();
  const target = current.find((t) => t.id === taskId);
  if (!target) return null;

  const nowIso = new Date().toISOString();
  const duplicated: TaskItem = {
    ...target,
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${target.title} (Copy)`,
    createdAt: nowIso,
    updatedAt: nowIso,
    status: target.status === 'completed' ? 'active' : target.status,
    activityLog: [
      {
        id: `act-${Date.now()}`,
        event: `Duplicated from "${target.title}"`,
        timestamp: nowIso,
        type: 'info',
      },
    ],
  };

  saveTasks([duplicated, ...current]);
  return duplicated;
}

/**
 * Rename task
 */
export function renameTask(taskId: string, newTitle: string): void {
  if (!newTitle.trim()) return;
  updateTask(taskId, { title: newTitle.trim() });
}

/**
 * Delete task
 */
export function deleteTask(taskId: string): void {
  const current = getStoredTasks();
  const next = current.filter((t) => t.id !== taskId);
  saveTasks(next);
}

/**
 * Subscribe to real task updates
 */
export function subscribeToTasks(callback: (tasks: TaskItem[]) => void): () => void {
  const listener = () => {
    callback(getStoredTasks());
  };
  LISTENERS.add(listener);
  // Immediate trigger
  callback(getStoredTasks());

  return () => {
    LISTENERS.delete(listener);
  };
}

/**
 * Format real timestamp to human-friendly display
 * e.g., "Today, 10:42 AM", "Yesterday, 06:30 PM", "Aug 16, 11:20 AM"
 */
export function formatTaskDate(isoDateString?: string): { displayDate: string; creator: string } {
  if (!isoDateString) {
    return { displayDate: 'Recently', creator: 'by you' };
  }

  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) {
    return { displayDate: isoDateString, creator: 'by you' };
  }

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timePart = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  let displayDate: string;
  if (isToday) {
    displayDate = `Today, ${timePart}`;
  } else if (isYesterday) {
    displayDate = `Yesterday, ${timePart}`;
  } else {
    const monthPart = date.toLocaleDateString([], { month: 'short' });
    const dayPart = date.getDate();
    displayDate = `${monthPart} ${dayPart}, ${timePart}`;
  }

  return { displayDate, creator: 'by you' };
}

/**
 * Calculate dynamic counts for filter navigation row
 */
export function calculateTaskFilterCounts(tasks: TaskItem[]) {
  const counts = {
    all: tasks.length,
    active: 0,
    inProgress: 0,
    completed: 0,
    scheduled: 0,
  };

  for (const t of tasks) {
    const s = t.status;
    if (s === 'active' || s === 'running') {
      counts.active++;
    } else if (s === 'in_progress') {
      counts.inProgress++;
    } else if (s === 'completed') {
      counts.completed++;
    } else if (s === 'scheduled') {
      counts.scheduled++;
    }
  }

  return counts;
}

/**
 * Formats a status string for display
 */
export function formatStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'in_progress':
    case 'running':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'scheduled':
      return 'Scheduled';
    case 'failed':
      return 'Failed';
    case 'paused':
      return 'Paused';
    case 'waiting_approval':
      return 'Awaiting Approval';
    default:
      return status;
  }
}
