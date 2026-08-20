'use client';

import React, { useState } from 'react';
import { X, Sliders, Check, Sparkles, Clock, Users, Briefcase, Zap, Brain } from 'lucide-react';
import { PrioritySettings } from './types';
import { cn } from '../../lib/utils';

export interface AdjustPrioritiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrioritySettings;
  onApplySettings: (settings: PrioritySettings) => void;
}

export const AdjustPrioritiesModal: React.FC<AdjustPrioritiesModalProps> = ({
  isOpen,
  onClose,
  settings,
  onApplySettings,
}) => {
  const [localSettings, setLocalSettings] = useState<PrioritySettings>(settings);

  if (!isOpen) return null;

  const toggleSetting = (key: keyof PrioritySettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApply = () => {
    onApplySettings(localSettings);
    onClose();
  };

  const options: {
    key: keyof PrioritySettings;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'deadlineSensitive',
      title: 'Deadline Sensitive Bias',
      description: 'Prioritize tasks with approaching delivery dates and explicit client deadlines.',
      icon: <Clock className="h-4 w-4 text-rose-500" />,
    },
    {
      key: 'clientWork',
      title: 'Client & Stakeholder Communications',
      description: 'Elevate unresolved client email threads and external approval requests.',
      icon: <Briefcase className="h-4 w-4 text-blue-500" />,
    },
    {
      key: 'deepWorkBias',
      title: 'Protect Deep Work Blocks',
      description: 'Reserve consecutive 60–90 min focus blocks during peak cognitive windows.',
      icon: <Brain className="h-4 w-4 text-indigo-500" />,
    },
    {
      key: 'meetingsAndCollab',
      title: 'Meeting Preparation Buffer',
      description: 'Schedule 15m preparation intervals before synchronous team syncs.',
      icon: <Users className="h-4 w-4 text-purple-500" />,
    },
    {
      key: 'quickWins',
      title: 'Quick Wins First (<15m)',
      description: 'Cluster brief approvals and replies early in the morning schedule.',
      icon: <Zap className="h-4 w-4 text-amber-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Adjust AI Priorities</h2>
              <p className="text-xs text-slate-600">Configure how Nexorbit ranks your day</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 my-4">
          {options.map((opt) => {
            const isEnabled = localSettings[opt.key];
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleSetting(opt.key)}
                className={cn(
                  'w-full flex items-start justify-between gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer',
                  isEnabled
                    ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                    : 'bg-white border-slate-200/70 hover:bg-slate-50/80'
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-white border border-slate-200/80 shadow-2xs mt-0.5">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{opt.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                      {opt.description}
                    </div>
                  </div>
                </div>

                {/* Switch indicator */}
                <div
                  className={cn(
                    'h-5 w-9 rounded-full transition-colors relative shrink-0 mt-0.5 p-0.5',
                    isEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                  )}
                >
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full bg-white transition-transform shadow-2xs',
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Apply &amp; Rebalance Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
