'use client';

import React from 'react';
import { Bot, Plus, ChevronRight } from 'lucide-react';
import { AgentTask } from '../../services/agent/storage';
import { StatusBadge } from './StatusBadge';
import { cn } from '../../lib/utils';

export interface ActiveWorkProps {
  tasks: AgentTask[];
  onSelectTask: (taskId: string) => void;
  onCreateTask: () => void;
}

export const ActiveWork: React.FC<ActiveWorkProps> = ({
  tasks,
  onSelectTask,
  onCreateTask,
}) => {
  return (
    <div id="active-work" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Active work
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tasks Nexorbit is currently handling.
          </p>
        </div>

        {tasks.length > 0 && (
          <button
            type="button"
            onClick={onCreateTask}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Create a task</span>
          </button>
        )}
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTask(t.id)}
              className="bg-[#15181D] border border-slate-800 hover:border-blue-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer group shadow-sm"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <StatusBadge status={t.status} />
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {t.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 truncate max-w-xl">
                  {t.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span>Tools: {t.toolsUsed.map((x) => x.name).join(', ')}</span>
                  <span>•</span>
                  <span>Created {t.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{t.progress}%</span>
                </div>

                <div className="h-8 w-8 rounded-xl bg-[#0D0F12] border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-blue-500/50 transition-all">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Intentional Empty State */
        <div className="p-8 text-center rounded-2xl bg-[#15181D] border border-dashed border-slate-800 space-y-3.5">
          <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-white tracking-tight">
              No active work yet.
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Create a task and Nexorbit will show its progress here.
            </p>
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={onCreateTask}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Create a task</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
