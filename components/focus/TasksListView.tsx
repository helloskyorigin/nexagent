'use client';

import React from 'react';
import { CheckSquare, Sparkles, Check, ExternalLink } from 'lucide-react';
import { DailyPlanItem } from './types';
import { ConnectorIcon } from '../connectors/ConnectorIcon';
import { cn } from '../../lib/utils';

export interface TasksListViewProps {
  items: DailyPlanItem[];
  onSelectItem: (item: DailyPlanItem) => void;
  onToggleComplete: (id: string) => void;
}

export const TasksListView: React.FC<TasksListViewProps> = ({
  items,
  onSelectItem,
  onToggleComplete,
}) => {
  const activeItems = items.filter((i) => !i.isCompleted);
  const completedItems = items.filter((i) => i.isCompleted);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Prioritized Task Inventory</h3>
          <p className="text-xs text-slate-600">
            {activeItems.length} active tasks • {completedItems.length} completed
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {activeItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => onToggleComplete(item.id)}
                className="h-5 w-5 rounded-md border border-slate-300 hover:border-indigo-500 flex items-center justify-center text-transparent hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
              >
                <Check className="h-3 w-3" />
              </button>

              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                  {item.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                  {item.sourceId && (
                    <div className="flex items-center gap-1">
                      <ConnectorIcon id={item.sourceId} size="sm" />
                      <span>{item.sourceName}</span>
                    </div>
                  )}
                  <span>•</span>
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase',
                  item.priority === 'important'
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : item.priority === 'high'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-slate-100 text-slate-700'
                )}
              >
                {item.priority}
              </span>

              <button
                onClick={() => onSelectItem(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {completedItems.length > 0 && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Completed Today</h4>
            <div className="space-y-1.5 opacity-60">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/50 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className="h-4 w-4 rounded-md bg-emerald-500 text-white flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <span className="line-through text-slate-600 truncate">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-600">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
