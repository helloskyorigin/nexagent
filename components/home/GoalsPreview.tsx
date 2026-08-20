'use client';

import React from 'react';
import { Target, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface GoalsPreviewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const GoalsPreview: React.FC<GoalsPreviewProps> = ({ onNavigate, className }) => {
  const goals = [
    {
      id: 'g1',
      title: 'Launch my startup',
      statusLabel: '2 things need attention',
      statusVariant: 'amber' as const,
      icon: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
    },
    {
      id: 'g2',
      title: 'Learn AI deeply',
      statusLabel: 'On track',
      statusVariant: 'emerald' as const,
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    },
  ];

  return (
    <Card
      title="Your goals"
      description="Personal milestones & alignment tracking"
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate?.('goals')}
          rightIcon={<ArrowRight className="h-3 w-3" />}
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          View goals
        </Button>
      }
      className={className}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => onNavigate?.('goals')}
            className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {goal.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-6">
                {goal.icon}
                <span className="text-[11px] font-medium text-slate-600">{goal.statusLabel}</span>
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    </Card>
  );
};
