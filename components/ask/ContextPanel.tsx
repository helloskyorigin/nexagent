'use client';
 
import React, { useState } from 'react';
import { Layers, Folder, User, Mail, Calendar, FileText, ChevronRight, X } from 'lucide-react';
import { CONTEXT_ENTITIES } from './mockData';
import { ContextEntity } from './types';
import { cn } from '../../lib/utils';
 
export interface ContextPanelProps {
  onClose?: () => void;
  className?: string;
}
 
export const ContextPanel: React.FC<ContextPanelProps> = ({ onClose, className }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'entity-1': true, // Project Alpha
    'entity-2': true, // Rahul
    'entity-3': false,
    'entity-4': false,
    'entity-5': false,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
 
  const getEntityIcon = (type: ContextEntity['type']) => {
    switch (type) {
      case 'project':
        return <Folder className="h-3.5 w-3.5 text-indigo-600" />;
      case 'person':
        return <User className="h-3.5 w-3.5 text-slate-600" />;
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-slate-500" />;
      case 'event':
        return <Calendar className="h-3.5 w-3.5 text-slate-500" />;
      case 'doc':
        return <FileText className="h-3.5 w-3.5 text-slate-500" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const projectEntity = CONTEXT_ENTITIES.find(e => e.type === 'project');
  const otherEntities = CONTEXT_ENTITIES.filter(e => e.type !== 'project');
 
  return (
    <div className={cn('p-4 space-y-6 text-xs select-none font-sans', className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-[11px] font-bold text-slate-900 tracking-tight">
            Context
          </h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">
            What Nexorbit used to understand this
          </p>
        </div>
 
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Subtle relationship lines / orbital curves diagram (Ambient Connection Graph) */}
      <div className="py-3 px-3 rounded-xl bg-slate-50/50 border border-slate-100/50 flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">
          Relationship Web
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 select-none">
          <span className="text-slate-700 font-semibold">Project Alpha</span>
          <span>↘</span>
          <span className="text-slate-600 font-medium">Rahul</span>
          <span>↙</span>
          <span className="text-slate-500">Emails</span>
        </div>
      </div>

      {/* Main Context - Active Focus */}
      {projectEntity && (
        <div className="space-y-2.5">
          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block">
            Workspace Focus
          </span>
          <div className="group space-y-1.5">
            <button
              onClick={() => toggleExpand(projectEntity.id)}
              className="w-full text-left flex items-start justify-between gap-2.5 hover:text-indigo-600 transition-colors"
            >
              <div className="flex gap-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {getEntityIcon(projectEntity.type)}
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-slate-950 text-xs group-hover:text-indigo-600 transition-colors">
                    {projectEntity.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                    {projectEntity.countText}
                  </span>
                </div>
              </div>
              <ChevronRight
                className={cn(
                  'h-3 w-3 text-slate-400 mt-0.5 shrink-0 transition-transform',
                  expandedIds[projectEntity.id] && 'rotate-90 text-indigo-600'
                )}
              />
            </button>

            {expandedIds[projectEntity.id] && projectEntity.details && (
              <div className="pl-6 pt-0.5 space-y-1.5 text-[11px] text-slate-500 animate-fadeIn font-normal">
                {projectEntity.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 leading-relaxed">
                    <span className="h-1 w-1 rounded-full bg-indigo-400 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related People & Content */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
          Related Context
        </span>
        
        <div className="space-y-4">
          {otherEntities.map((entity) => {
            const isExpanded = !!expandedIds[entity.id];
            return (
              <div key={entity.id} className="group space-y-1.5">
                <button
                  onClick={() => toggleExpand(entity.id)}
                  className="w-full text-left flex items-start justify-between gap-2.5 hover:text-indigo-600 transition-colors"
                >
                  <div className="flex gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {getEntityIcon(entity.type)}
                    </div>
                    <div className="min-w-0">
                      <span className="block font-semibold text-slate-800 text-xs group-hover:text-indigo-600 transition-colors">
                        {entity.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                        {entity.countText}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      'h-3 w-3 text-slate-400 mt-0.5 shrink-0 transition-transform',
                      isExpanded && 'rotate-90 text-indigo-600'
                    )}
                  />
                </button>

                {isExpanded && entity.details && (
                  <div className="pl-6 pt-0.5 space-y-1.5 text-[11px] text-slate-500 animate-fadeIn font-normal">
                    {entity.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 leading-relaxed">
                        <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                        <span className="truncate">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


