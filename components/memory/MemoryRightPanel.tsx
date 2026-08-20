'use client';

import React from 'react';
import {
  Sparkles,
  Users,
  Sliders,
  Folder,
  BookOpen,
  Star,
  Lock,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
} from 'lucide-react';
import {
  CategoryStat,
  ConnectedSourceStat,
  RecentPersonItem,
  MemoryCategory,
  MemorySourceType,
} from './types';
import { MemorySourceIcon } from './MemorySourceIcon';
import { cn } from '../../lib/utils';

export interface MemoryRightPanelProps {
  totalMemories?: number;
  categoryStats: CategoryStat[];
  sourceStats: ConnectedSourceStat[];
  recentPeople: RecentPersonItem[];
  activeCategoryFilter?: string;
  activeSourceFilter?: string;
  activePersonFilter?: string;
  onSelectCategory: (category: MemoryCategory) => void;
  onSelectSource: (sourceType: MemorySourceType) => void;
  onSelectPerson: (personName: string) => void;
  onViewAllSources: () => void;
  onViewAllPeople: () => void;
  onOpenSettings: () => void;
}

export const MemoryRightPanel: React.FC<MemoryRightPanelProps> = ({
  totalMemories = 1248,
  categoryStats,
  sourceStats,
  recentPeople,
  activeCategoryFilter,
  activeSourceFilter,
  activePersonFilter,
  onSelectCategory,
  onSelectSource,
  onSelectPerson,
  onViewAllSources,
  onViewAllPeople,
  onOpenSettings,
}) => {
  const getCategoryIcon = (cat: MemoryCategory) => {
    switch (cat) {
      case 'People':
        return <Users className="h-4 w-4 text-indigo-500" />;
      case 'Preferences':
        return <Sliders className="h-4 w-4 text-purple-500" />;
      case 'Projects':
        return <Folder className="h-4 w-4 text-blue-500" />;
      case 'Knowledge':
        return <BookOpen className="h-4 w-4 text-rose-500" />;
      case 'Decisions':
        return <Star className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* 1. MEMORY AT A GLANCE CARD */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Memory at a Glance
          </h3>
          <Sparkles className="h-4 w-4 text-indigo-500" />
        </div>

        {/* Big Number & Velocity */}
        <div className="space-y-1">
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalMemories.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total memories</span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              ↑ 18% <span className="text-[11px] font-normal text-slate-400">vs last month</span>
            </span>
          </div>
        </div>

        {/* Distribution Progress Bar */}
        <div className="h-2 w-full rounded-full bg-slate-100 flex overflow-hidden">
          <div className="bg-indigo-600 h-full w-[28%]" title="Projects (428)" />
          <div className="bg-purple-500 h-full w-[25%]" title="Preferences (312)" />
          <div className="bg-blue-400 h-full w-[20%]" title="People (245)" />
          <div className="bg-rose-400 h-full w-[16%]" title="Knowledge (198)" />
          <div className="bg-amber-400 h-full w-[11%]" title="Decisions (65)" />
        </div>

        {/* Categories List */}
        <div className="space-y-2 pt-1">
          {categoryStats.map((item) => {
            const isSelected = activeCategoryFilter === item.category;
            return (
              <div
                key={item.category}
                onClick={() => onSelectCategory(item.category)}
                className={cn(
                  'flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer hover:bg-slate-50',
                  isSelected && 'bg-indigo-50/80 font-bold text-indigo-700'
                )}
              >
                <div className="flex items-center gap-2.5">
                  {getCategoryIcon(item.category)}
                  <span className="text-slate-700 font-medium">{item.category}</span>
                </div>
                <span className="text-slate-900 font-semibold font-mono">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TOP CONNECTED SOURCES CARD */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Top Connected Sources
        </h3>

        <div className="space-y-2">
          {sourceStats.map((src) => {
            const isSelected = activeSourceFilter === src.type;
            return (
              <div
                key={src.id}
                onClick={() => onSelectSource(src.type)}
                className={cn(
                  'flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer hover:bg-slate-50',
                  isSelected && 'bg-indigo-50/80 font-bold'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <MemorySourceIcon type={src.type} name={src.name} className="h-6 w-6 text-[10px]" />
                  <span className="text-slate-700 font-medium">{src.name}</span>
                </div>
                <span className="text-slate-900 font-semibold font-mono">
                  {src.count}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={onViewAllSources}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-1 cursor-pointer"
        >
          <span>View all sources</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 3. RECENT PEOPLE CARD */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent People
          </h3>
          <button
            onClick={onViewAllPeople}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="space-y-3">
          {recentPeople.map((person) => {
            const isSelected = activePersonFilter === person.name;
            return (
              <div
                key={person.id}
                onClick={() => onSelectPerson(person.name)}
                className={cn(
                  'flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-50',
                  isSelected && 'bg-indigo-50/80'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs',
                      person.avatarColor || 'bg-indigo-600'
                    )}
                  >
                    {person.initials}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {person.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {person.subtitle}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-2">
                  {person.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MEMORY SETTINGS CARD */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Memory Settings
          </h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Manage what Nexorbit remembers and forgets.
        </p>

        <button
          onClick={onOpenSettings}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors pt-1 cursor-pointer"
        >
          <span>Manage Settings</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
