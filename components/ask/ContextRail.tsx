'use client';

import React from 'react';
import {
  Folder,
  User,
  Mail,
  Calendar,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CONTEXT_ENTITIES, RELATED_ITEMS, FOLLOW_UP_SUGGESTIONS } from './mockData';
import { ContextEntity, RelatedItem } from './types';
import { SourceIcon } from './SourceIcons';
import { cn } from '../../lib/utils';

export interface ContextRailProps {
  onSelectEntity: (entity: ContextEntity) => void;
  onSelectRelated: (item: RelatedItem) => void;
  onSelectFollowUp: (prompt: string) => void;
  className?: string;
}

export const ContextRail: React.FC<ContextRailProps> = ({
  onSelectEntity,
  onSelectRelated,
  onSelectFollowUp,
  className,
}) => {
  const projectEntity = CONTEXT_ENTITIES.find((e) => e.id === 'ctx-project-alpha');
  const personEntity = CONTEXT_ENTITIES.find((e) => e.id === 'ctx-rahul');
  const otherEntities = CONTEXT_ENTITIES.filter(
    (e) => e.id !== 'ctx-project-alpha' && e.id !== 'ctx-rahul'
  );

  return (
    <aside className={cn('w-full space-y-4 select-none', className)}>
      {/* 1. Context Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-950 tracking-tight">
            Context
          </h3>
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600/20" />
        </div>

        <div className="space-y-1.5 pt-0.5">
          {/* Project Alpha Item */}
          {projectEntity && (
            <button
              type="button"
              onClick={() => onSelectEntity(projectEntity)}
              className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <Folder className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[13px] font-bold text-slate-950 group-hover:text-indigo-600 transition-colors truncate">
                    {projectEntity.title}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-normal">
                    {projectEntity.subtitle}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          )}

          {/* Rahul Person Item */}
          {personEntity && (
            <button
              type="button"
              onClick={() => onSelectEntity(personEntity)}
              className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[13px] font-bold text-slate-950 group-hover:text-indigo-600 transition-colors truncate">
                    {personEntity.title}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-normal">
                    {personEntity.subtitle}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          )}

          {/* Aggregated Counts */}
          <div className="pt-2 border-t border-slate-50 space-y-1">
            {otherEntities.map((ent) => {
              const renderEntIcon = () => {
                if (ent.type === 'email') return <Mail className="h-4 w-4 text-indigo-500" />;
                if (ent.type === 'event') return <Calendar className="h-4 w-4 text-indigo-500" />;
                return <FileText className="h-4 w-4 text-indigo-500" />;
              };

              return (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => onSelectEntity(ent)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs text-slate-700 hover:text-indigo-600 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{renderEntIcon()}</span>
                    <span className="font-medium text-[12.5px] truncate">{ent.title}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Related Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
        <h3 className="text-sm font-bold text-slate-950 tracking-tight">
          Related
        </h3>

        <div className="space-y-1.5">
          {RELATED_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectRelated(item)}
              className="w-full flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-indigo-200 transition-colors">
                  <SourceIcon type={item.connector} className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {item.title}
                  </span>
                  <span className="block text-[10.5px] text-slate-400 font-normal">
                    {item.connectorName}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Follow-up suggestions Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-3">
        <h3 className="text-sm font-bold text-slate-950 tracking-tight">
          Follow-up suggestions
        </h3>

        <div className="space-y-2">
          {FOLLOW_UP_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectFollowUp(suggestion)}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-950 text-xs font-semibold transition-all cursor-pointer text-left group shadow-2xs"
            >
              <span className="truncate">{suggestion}</span>
              <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
