'use client';

import React from 'react';
import { History, Calendar, Sparkles, ArrowRight, Clock, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { ConnectorId } from '../shell/ConnectorModal';

export interface RightRailProps {
  onSelectPrompt?: (promptText: string) => void;
  onNavigate?: (pageId: string) => void;
  onOpenConnector?: (id: ConnectorId) => void;
  className?: string;
}

export const RightRail: React.FC<RightRailProps> = ({
  onSelectPrompt,
  onNavigate,
  onOpenConnector,
  className,
}) => {
  const quickAskSuggestions = [
    'What changed since yesterday?',
    'Find deadline conflicts',
    'What should I focus on?',
    'Summarize recent emails',
  ];

  return (
    <div className={cn('space-y-5', className)}>
      {/* CARD 1: What Changed */}
      <Card
        title="What changed"
        description="Workspace updates since last login"
        action={
          <Badge variant="indigo" size="sm">
            Live Context
          </Badge>
        }
      >
        <div className="space-y-2.5 mt-2 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <MessageSquare className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="font-medium text-slate-800">3 important conversations</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="font-medium text-slate-800">1 meeting rescheduled</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <FileText className="h-4 w-4 text-sky-500 shrink-0" />
            <span className="font-medium text-slate-800">2 files updated</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.('what-changed')}
            rightIcon={<ArrowRight className="h-3 w-3" />}
            className="w-full mt-1 text-xs"
          >
            View all changes
          </Button>
        </div>
      </Card>

      {/* CARD 2: Today's Agenda */}
      <Card
        title="Today's agenda"
        description="3 events scheduled"
        action={
          <Badge variant="outline" size="sm">
            Calendar
          </Badge>
        }
      >
        <div className="space-y-2 mt-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">Project Alpha Sync</span>
              <span className="text-[10px] text-slate-500">Google Meet • 4 participants</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              10:00
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">Product Review</span>
              <span className="text-[10px] text-slate-500">Design Systems Sync</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              13:30
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">Planning</span>
              <span className="text-[10px] text-slate-500">Q3 Roadmap Alignment</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              16:00
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenConnector?.('calendar')}
            rightIcon={<ArrowRight className="h-3 w-3" />}
            className="w-full mt-1 text-xs"
          >
            View calendar
          </Button>
        </div>
      </Card>

      {/* CARD 3: Quick Ask */}
      <Card
        title="Quick ask"
        description="Click any prompt to ask Nexorbit AI"
        action={<Sparkles className="h-4 w-4 text-indigo-500" />}
      >
        <div className="space-y-1.5 mt-2">
          {quickAskSuggestions.map((promptText, i) => (
            <button
              key={i}
              onClick={() => onSelectPrompt?.(promptText)}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/60 hover:border-indigo-200 transition-colors text-xs text-slate-700 hover:text-indigo-900 font-medium flex items-center justify-between group"
            >
              <span className="truncate">{promptText}</span>
              <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};
