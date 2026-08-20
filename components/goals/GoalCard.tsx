'use client';

import React, { useState } from 'react';
import {
  Rocket,
  Users,
  Brain,
  Heart,
  BookOpen,
  Target,
  Code,
  Zap,
  MoreVertical,
  Calendar,
  Sparkles,
  CheckCircle2,
  Pause,
  Archive,
  Trash2,
  Edit3,
  ExternalLink,
} from 'lucide-react';
import { GoalItem, ConnectedSource } from './types';
import { GoalSourceIcon } from './GoalSourceIcon';
import { cn } from '../../lib/utils';

export interface GoalCardProps {
  goal: GoalItem;
  onClick: (goal: GoalItem) => void;
  onEdit: (goal: GoalItem) => void;
  onPause: (goalId: string) => void;
  onArchive: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onToggleComplete: (goalId: string) => void;
  onSourceClick: (goal: GoalItem, source: ConnectedSource) => void;
  isHighlighted?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onClick,
  onEdit,
  onPause,
  onArchive,
  onDelete,
  onToggleComplete,
  onSourceClick,
  isHighlighted = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pick leading icon based on iconType / theme
  const renderGoalIcon = () => {
    const iconClass = 'h-5 w-5';
    switch (goal.iconType) {
      case 'rocket':
        return (
          <div className="h-11 w-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Rocket className={iconClass} />
          </div>
        );
      case 'users':
        return (
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Users className={iconClass} />
          </div>
        );
      case 'brain':
        return (
          <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Brain className={iconClass} />
          </div>
        );
      case 'heart':
        return (
          <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Heart className={iconClass} />
          </div>
        );
      case 'book':
        return (
          <div className="h-11 w-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <BookOpen className={iconClass} />
          </div>
        );
      case 'code':
        return (
          <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Code className={iconClass} />
          </div>
        );
      case 'zap':
        return (
          <div className="h-11 w-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Zap className={iconClass} />
          </div>
        );
      default:
        return (
          <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Target className={iconClass} />
          </div>
        );
    }
  };

  // Progress Bar color matching theme
  const getProgressBarColor = () => {
    switch (goal.iconTheme) {
      case 'purple':
        return 'bg-indigo-600';
      case 'emerald':
        return 'bg-emerald-600';
      case 'amber':
        return 'bg-amber-500';
      case 'rose':
        return 'bg-emerald-500'; // matching reference high progress for health
      case 'blue':
        return 'bg-blue-600';
      case 'indigo':
        return 'bg-indigo-600';
      default:
        return 'bg-indigo-600';
    }
  };

  // Priority badge styling
  const renderPriorityText = () => {
    switch (goal.priority) {
      case 'High priority':
        return <span className="text-rose-600 font-medium">High priority</span>;
      case 'Medium priority':
        return <span className="text-amber-600 font-medium">Medium priority</span>;
      case 'Low priority':
        return <span className="text-emerald-600 font-medium">Low priority</span>;
      default:
        return <span className="text-slate-500 font-medium">{goal.priority}</span>;
    }
  };

  return (
    <div
      id={`goal-card-${goal.id}`}
      onClick={() => onClick(goal)}
      className={cn(
        'group relative bg-white rounded-2xl border transition-all duration-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300/90 cursor-pointer text-left flex flex-col justify-between gap-4',
        isHighlighted
          ? 'border-indigo-400 ring-2 ring-indigo-500/20 bg-indigo-50/20'
          : 'border-slate-200/80',
        goal.status === 'completed' && 'bg-slate-50/60 border-slate-200',
        goal.status === 'paused' && 'opacity-70 bg-slate-50/40'
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        {/* Left Info: Icon, Title, Category, Description, Progress & Meta */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {renderGoalIcon()}

          <div className="flex-1 min-w-0 space-y-2">
            {/* Title + Category Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                {goal.title}
              </h3>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                {goal.category}
              </span>
              {goal.status === 'paused' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Paused
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pr-2">
              {goal.description}
            </p>

            {/* Progress Bar & Percentage */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700 ease-out',
                    getProgressBarColor()
                  )}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-900 shrink-0 w-9 text-right font-mono">
                {goal.progress}%
              </span>
            </div>

            {/* Meta Row: Target Date & Priority */}
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
              <span>Target: {goal.targetDate}</span>
              <span>|</span>
              {renderPriorityText()}
            </div>
          </div>
        </div>

        {/* Right Info: Next action + Source Icons + Three-dot Menu */}
        <div className="flex items-start justify-between lg:justify-end gap-3 shrink-0 lg:w-64 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-medium text-slate-600 block">Next action</span>
            <div className="text-xs sm:text-[13px] font-semibold text-slate-900 truncate">
              {goal.nextAction.title}
            </div>

            {/* Next Action Time */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
              <Calendar className="h-3 w-3 text-slate-600" />
              <span>{goal.nextAction.time}</span>
            </div>

            {/* Connected Source Badges */}
            <div className="flex items-center gap-1.5 pt-2 flex-wrap">
              {goal.connectedSources.map((source) => (
                <GoalSourceIcon
                  key={source.id}
                  type={source.type}
                  name={source.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSourceClick(goal, source);
                  }}
                />
              ))}

              {goal.moreSourcesCount && goal.moreSourcesCount > 0 ? (
                <div
                  title={`${goal.moreSourcesCount} more connected sources`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(goal);
                  }}
                  className="h-6 px-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10.5px] font-semibold text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  +{goal.moreSourcesCount}
                </div>
              ) : null}
            </div>
          </div>

          {/* Three-dot Context Menu */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Goal options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200/80 p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 text-left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick(goal);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Open Workspace</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(goal);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit goal</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(goal.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{goal.status === 'completed' ? 'Mark active' : 'Mark complete'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPause(goal.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Pause className="h-3.5 w-3.5 text-amber-500" />
                    <span>{goal.status === 'paused' ? 'Resume goal' : 'Pause goal'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(goal.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Archive className="h-3.5 w-3.5 text-slate-500" />
                    <span>Archive goal</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    <span>Delete goal</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
