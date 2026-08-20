'use client';

import React from 'react';
import {
  X,
  Edit3,
  Trash2,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Scale,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from './types';
import { MemorySourceIcon } from './MemorySourceIcon';
import { cn } from '../../lib/utils';

export interface MemoryDetailPanelProps {
  memory: MemoryItem | null;
  onClose?: () => void;
  onEdit: (memory: MemoryItem) => void;
  onForget: (memory: MemoryItem) => void;
  onSelectRelated?: (relatedIdOrTitle: string) => void;
}

export const MemoryDetailPanel: React.FC<MemoryDetailPanelProps> = ({
  memory,
  onClose,
  onEdit,
  onForget,
  onSelectRelated,
}) => {
  if (!memory) {
    return null;
  }

  const getCategoryStyles = (category: MemoryCategory) => {
    switch (category) {
      case 'Projects':
        return {
          iconBox: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
          badge: 'bg-indigo-50 text-indigo-700 border border-indigo-100/80',
          icon: Calendar,
        };
      case 'People':
        return {
          iconBox: 'bg-purple-50 text-purple-700 border border-purple-100',
          badge: 'bg-purple-50 text-purple-700 border border-purple-100/80',
          icon: Users,
        };
      case 'Preferences':
        return {
          iconBox: 'bg-rose-50 text-rose-700 border border-rose-100',
          badge: 'bg-rose-50 text-rose-700 border border-rose-100/80',
          icon: Heart,
        };
      case 'Knowledge':
        return {
          iconBox: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
          badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80',
          icon: BookOpen,
        };
      case 'Decisions':
        return {
          iconBox: 'bg-amber-50 text-amber-700 border border-amber-100',
          badge: 'bg-amber-50 text-amber-700 border border-amber-100/80',
          icon: Scale,
        };
      default:
        return {
          iconBox: 'bg-slate-100 text-slate-700 border border-slate-200',
          badge: 'bg-slate-100 text-slate-700 border border-slate-200/80',
          icon: FileText,
        };
    }
  };

  const style = getCategoryStyles(memory.category);
  const IconComponent = style.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5 text-left relative animate-in fade-in slide-in-from-right-2 duration-200">
      {/* Top Header Row with Category, Title, Close X */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-start gap-3 min-w-0">
          <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5', style.iconBox)}>
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider', style.badge)}>
              {memory.category}
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
              {memory.title}
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close detail panel"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Action Buttons: Edit & Forget */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(memory)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onForget(memory)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Forget</span>
        </button>
      </div>

      {/* Section: Explanation */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
          About this memory
        </h4>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {memory.aboutText || memory.description}
        </p>
      </div>

      {/* Section: Key Details */}
      {memory.keyDetails && memory.keyDetails.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
            Key details
          </h4>
          <ul className="space-y-1.5 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
            {memory.keyDetails.map((kd, idx) => (
              <li key={idx} className="flex items-center justify-between gap-2 text-slate-600">
                <span className="font-semibold text-slate-700">{kd.label}</span>
                <span className="text-slate-900 font-medium">{kd.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section: Related Memories */}
      {memory.relatedMemories && memory.relatedMemories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
            Related Memories
          </h4>
          <div className="space-y-1.5">
            {memory.relatedMemories.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectRelated && onSelectRelated(rel.id)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                    {rel.title}
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section: Source */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
          Source
        </h4>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <MemorySourceIcon type={memory.source.type} name={memory.source.name} className="h-7 w-7" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 truncate">
              {memory.source.fileName || memory.source.email || memory.source.detail || memory.source.name}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Recorded {memory.updatedAt || memory.timestamp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

