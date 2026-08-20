'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TaskItem,
  TaskStatus,
  TaskSource,
  subscribeToTasks,
  updateTaskStatus,
  deleteTask,
  duplicateTask,
  calculateTaskFilterCounts,
} from '../../services/tasks/taskService';
import { TasksHeader } from './TasksHeader';
import { TaskFilters, TaskFilterTab } from './TaskFilters';
import { TaskRow } from './TaskRow';
import { TasksEmptyState } from './TasksEmptyState';
import { TasksBottomHelper } from './TasksBottomHelper';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import { RenameTaskModal } from './RenameTaskModal';

interface TasksPageProps {
  onNavigate: (pageId: string) => void;
  onOpenNewTaskModal?: () => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  onNavigate,
  onOpenNewTaskModal,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TaskFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<TaskSource | 'all'>('all');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [renamingTask, setRenamingTask] = useState<TaskItem | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);

  // Subscribe to real task store
  useEffect(() => {
    const unsubscribe = subscribeToTasks((fetched) => {
      setTasks(fetched);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Dynamically calculate filter counts from real tasks state
  const filterCounts = useMemo(() => {
    return calculateTaskFilterCounts(tasks);
  }, [tasks]);

  // Filter tasks based on current tab, search query, and source filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Tab filter
      if (currentTab === 'active' && !(task.status === 'active' || task.status === 'running')) {
        return false;
      }
      if (currentTab === 'in_progress' && task.status !== 'in_progress') {
        return false;
      }
      if (currentTab === 'completed' && task.status !== 'completed') {
        return false;
      }
      if (currentTab === 'scheduled' && task.status !== 'scheduled') {
        return false;
      }

      // 2. Source filter
      if (selectedSourceFilter !== 'all' && task.source !== selectedSourceFilter) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description.toLowerCase().includes(query);
        const sourceMatch = task.source.toLowerCase().includes(query);
        const statusMatch = task.status.toLowerCase().includes(query);
        const toolsMatch = (task.connectedTools || []).some((t) =>
          t.toLowerCase().includes(query)
        );

        if (!titleMatch && !descMatch && !sourceMatch && !statusMatch && !toolsMatch) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, currentTab, selectedSourceFilter, searchQuery]);

  // Action handlers
  const handleOpenTask = (task: TaskItem) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleRenameTask = (task: TaskItem) => {
    setRenamingTask(task);
    setRenameModalOpen(true);
  };

  const handleUpdateStatus = (task: TaskItem, newStatus: TaskStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleDuplicateTask = (task: TaskItem) => {
    duplicateTask(task.id);
  };

  const handleDeleteTask = (task: TaskItem) => {
    deleteTask(task.id);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSourceFilter('all');
    setCurrentTab('all');
  };

  const isFilteredView =
    searchQuery.trim() !== '' ||
    selectedSourceFilter !== 'all' ||
    currentTab !== 'all';

  return (
    <div className="flex-1 min-h-screen bg-[#0D0F12] text-slate-100 flex flex-col">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header with Title, Search, Filter Dropdown & + New Task */}
        <TasksHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSourceFilter={selectedSourceFilter}
          onSelectSourceFilter={setSelectedSourceFilter}
          onOpenNewTask={() => setCreateModalOpen(true)}
        />

        {/* Dynamic Horizontal Filter Tabs */}
        <TaskFilters
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          counts={filterCounts}
        />

        {/* Task List / Workspace Container */}
        <div className="space-y-3 pt-1">
          {isLoading ? (
            /* Loading Skeleton Rows */
            <div className="space-y-3">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="bg-[#121520]/60 border border-white/[0.04] rounded-2xl p-5 flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.06]" />
                    <div className="space-y-2 flex-1 max-w-md">
                      <div className="h-4 bg-white/[0.08] rounded w-3/4" />
                      <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-6 w-24 bg-white/[0.06] rounded-full" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            /* Intentional Empty State (0 tasks in workspace) */
            <TasksEmptyState
              onCreateTask={() => setCreateModalOpen(true)}
              onStartChat={() => onNavigate('chat')}
            />
          ) : filteredTasks.length === 0 ? (
            /* Filtered Empty State (search/filters produced 0 results) */
            <TasksEmptyState
              isFiltered
              searchQuery={searchQuery}
              onClearFilters={handleClearFilters}
              onCreateTask={() => setCreateModalOpen(true)}
              onStartChat={() => onNavigate('chat')}
            />
          ) : (
            /* Populated Tasks Table / Card List */
            <div className="space-y-3">
              {/* Optional Column Header Bar matching reference */}
              <div className="hidden md:flex items-center justify-between px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
                <div className="flex-1">Task</div>
                <div className="flex items-center justify-end gap-8 flex-shrink-0">
                  <div className="min-w-[130px] text-right">Status</div>
                  <div className="min-w-[110px]">Created</div>
                  <div className="w-8 text-center">Actions</div>
                </div>
              </div>

              {/* Task Rows */}
              <div className="space-y-2.5">
                {filteredTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onOpen={handleOpenTask}
                    onRename={handleRenameTask}
                    onUpdateStatus={handleUpdateStatus}
                    onDuplicate={handleDuplicateTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Helper Bar */}
        <TasksBottomHelper
          onLearnMore={() => onNavigate('agent')}
        />
      </main>

      {/* Modal Workspaces */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTaskCreated={(newTask) => {
          setSelectedTask(newTask);
        }}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedTask(null);
        }}
        onNavigateToAgent={(taskId) => {
          setDetailModalOpen(false);
          onNavigate('agent');
        }}
      />

      <RenameTaskModal
        task={renamingTask}
        isOpen={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setRenamingTask(null);
        }}
      />
    </div>
  );
};
