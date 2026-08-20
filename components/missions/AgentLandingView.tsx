'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  Bot,
  ChevronRight,
} from 'lucide-react';
import {
  AgentTask,
  subscribeToAgentTasks,
} from '../../services/agent/storage';
import { IntegrationService } from '../../services/integrations/integration.service';
import { ConnectorId } from '../shell/ConnectorModal';
import { INITIAL_INTEGRATIONS } from './WorkspaceConnections';
import { ServiceIntegrationItem, IntegrationStatus } from './ConnectModal';

export interface AgentLandingViewProps {
  onOpenNewTask: () => void;
  onSelectTask: (taskId: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
  onNavigate: (pageId: string) => void;
}

export const AgentLandingView: React.FC<AgentLandingViewProps> = ({
  onOpenNewTask,
  onSelectTask,
  onOpenConnector,
  onNavigate,
}) => {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [integrations, setIntegrations] = useState<ServiceIntegrationItem[]>(INITIAL_INTEGRATIONS);

  // Subscribe to agent tasks from real storage state
  useEffect(() => {
    const unsubscribe = subscribeToAgentTasks((fetched) => {
      setTasks(fetched);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to IntegrationService for real workspace tools state
  useEffect(() => {
    const unsubscribe = IntegrationService.subscribe((pluginList) => {
      setIntegrations((prev) =>
        prev.map((item) => {
          const matched = pluginList.find((p) => p.id === item.id);
          if (matched) {
            let mappedStatus: IntegrationStatus = 'not_connected';
            if (matched.connectionStatus === 'CONNECTED') mappedStatus = 'connected';
            else if (matched.connectionStatus === 'NEEDS_REAUTH') mappedStatus = 'needs_attention';
            return {
              ...item,
              status: mappedStatus,
            };
          }
          return item;
        })
      );
    });
    return () => unsubscribe();
  }, []);

  const connectedTools = integrations.filter((i) => i.status === 'connected');

  const activeTasks = tasks.filter((t) =>
    ['running', 'paused', 'ready'].includes(t.status)
  );
  const isAgentWorking = activeTasks.some((t) => t.status === 'running');

  const allApprovals = tasks.flatMap((t) =>
    (t.approvals || [])
      .filter((a) => a.status === 'pending')
      .map((a) => ({ taskId: t.id, taskTitle: t.title, approval: a }))
  );

  const allActivities = tasks
    .flatMap((t) =>
      (t.activityLog || []).map((a) => ({ ...a, taskId: t.id }))
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 8);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-fadeIn pb-16">
      {/* 1. AGENT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282D34]/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Nexorbit Agent
            </h1>
            <div
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1.5 border ${
                isAgentWorking
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAgentWorking ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              {isAgentWorking ? 'Working' : 'Ready'}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Your connected workspace, working for you.
          </p>
        </div>
      </div>

      {/* 2. WORKSPACE — COMPACT TOOL STATUS */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Workspace
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tools Nexorbit can use to get work done.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('plugins')}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer group"
          >
            <span>Manage tools</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {connectedTools.length > 0 ? (
          <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-[#15181D] border border-[#282D34]/80">
            {connectedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#111317] border border-[#282D34] rounded-xl text-slate-200"
                >
                  <Icon className="h-4 w-4 text-white" />
                  <span className="text-xs font-medium">{tool.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#15181D] border border-[#282D34]/80">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">
                No tools connected
              </h3>
              <p className="text-xs text-slate-400">
                Connect tools in Plugins to let Nexorbit take action.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('plugins')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              Open Plugins
            </button>
          </div>
        )}
      </div>

      {/* 3. ACTIVE WORK — PRIMARY AGENT AREA */}
      <div className="space-y-3.5">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            Active work
          </h2>
        </div>

        {activeTasks.length > 0 ? (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="p-5 rounded-2xl bg-[#15181D] border border-[#282D34] hover:border-slate-700 transition-all cursor-pointer group flex flex-col gap-3 shadow-sm relative overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {task.steps?.find((s) => s.status === 'in_progress')?.description ||
                        task.description ||
                        'Processing agent step...'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-blue-400">
                      {task.progress}%
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {task.toolsUsed && task.toolsUsed.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-[#282D34]/60">
                    <Activity className="h-3.5 w-3.5 text-blue-400" />
                    <span>{task.toolsUsed.map((t) => t.name).join(' · ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 rounded-2xl bg-[#15181D] border border-[#282D34]/80 text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">
                No active work
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create a task and Nexorbit will work on it here.
              </p>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenNewTask}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <span>Create a task</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
        {/* 4. NEEDS YOUR APPROVAL */}
        <div className="space-y-3.5">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Needs your approval
            </h2>
          </div>

          {allApprovals.length > 0 ? (
            <div className="space-y-3">
              {allApprovals.map((item, idx) => (
                <div
                  key={`${item.taskId}-${idx}`}
                  className="p-4 rounded-2xl bg-[#15181D] border border-[#282D34] shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <AlertCircle className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {item.taskTitle}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.approval.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#282D34]/80 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Tool: {item.approval.type || 'Action'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectTask(item.taskId)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectTask(item.taskId)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#15181D] border border-[#282D34]/80 text-center">
              <p className="text-xs text-slate-400">Nothing needs your approval.</p>
            </div>
          )}
        </div>

        {/* 5. RECENT ACTIVITY */}
        <div className="space-y-3.5">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Recent activity
            </h2>
          </div>

          {allActivities.length > 0 ? (
            <div className="p-4 rounded-2xl bg-[#15181D] border border-[#282D34]/80 shadow-sm">
              <div className="space-y-3.5">
                {allActivities.map((act, idx) => (
                  <div key={`${act.taskId}-${idx}`} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {act.description}
                      </p>
                      <p className="text-[10px] text-slate-500">{act.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#15181D] border border-[#282D34]/80 text-center space-y-1">
              <p className="text-xs font-semibold text-slate-300">
                No recent activity
              </p>
              <p className="text-[11px] text-slate-400">
                Agent activity will appear here when Nexorbit starts working.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
