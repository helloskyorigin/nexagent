'use client';

import React, { useState, useEffect } from 'react';
import { AgentLandingView } from './AgentLandingView';
import { AgentExecutionView } from './AgentExecutionView';
import { NewAgentTaskModal } from './NewAgentTaskModal';
import {
  AgentTask,
  subscribeToAgentTasks,
  getStoredTasks,
} from '../../services/agent/storage';
import { ConnectorId } from '../shell/ConnectorModal';

export interface MissionsViewProps {
  onNavigate?: (pageId: string) => void;
  onOpenConnector?: (connectorId: ConnectorId) => void;
  className?: string;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  onNavigate = () => {},
  onOpenConnector = () => {},
  className,
}) => {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Subscribe to real agent tasks
  useEffect(() => {
    const unsubscribe = subscribeToAgentTasks((fetched) => {
      setTasks(fetched);
    });
    return () => unsubscribe();
  }, []);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className={className}>
      {selectedTask ? (
        <AgentExecutionView
          task={selectedTask}
          onBack={() => setSelectedTaskId(null)}
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        />
      ) : (
        <AgentLandingView
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          onSelectTask={(id) => setSelectedTaskId(id)}
          onOpenConnector={onOpenConnector}
          onNavigate={onNavigate}
        />
      )}

      {/* New Agent Task Creation Modal */}
      <NewAgentTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onTaskCreated={(taskId) => {
          setSelectedTaskId(taskId);
        }}
      />
    </div>
  );
};
