'use client';

import React from 'react';
import { X, Sparkles, Calendar, Mail, FileText, Target, Activity, ArrowRight } from 'lucide-react';
import { MOCK_WHY_THIS_PLAN } from './mockData';

export interface PlanExplanationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskNexorbit: (query?: string) => void;
}

export const PlanExplanationDrawer: React.FC<PlanExplanationDrawerProps> = ({
  isOpen,
  onClose,
  onAskNexorbit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200/80 p-6 flex flex-col z-10 animate-in slide-in-from-right duration-250 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Why this daily plan?</h2>
              <p className="text-xs text-slate-600">Synthesized by Nexorbit AI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Synthesis Summary */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/30 border border-indigo-100/70">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {MOCK_WHY_THIS_PLAN.summary}
          </p>
        </div>

        {/* Key Drivers */}
        <div className="space-y-4 flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Core Prioritization Signals
          </h3>

          <div className="space-y-3">
            {MOCK_WHY_THIS_PLAN.drivers.map((driver, index) => {
              const getIcon = () => {
                switch (driver.iconName) {
                  case 'calendar':
                    return <Calendar className="h-4 w-4 text-blue-600" />;
                  case 'mail':
                    return <Mail className="h-4 w-4 text-rose-500" />;
                  case 'sparkles':
                    return <Sparkles className="h-4 w-4 text-indigo-600" />;
                  case 'target':
                    return <Target className="h-4 w-4 text-emerald-600" />;
                  default:
                    return <Activity className="h-4 w-4 text-slate-600" />;
                }
              };

              return (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-white border border-slate-200/60 shadow-2xs">
                        {getIcon()}
                      </div>
                      <span className="text-xs font-semibold text-slate-900">{driver.title}</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {driver.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">{driver.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-100 flex flex-col gap-2.5">
          <button
            onClick={() => {
              onClose();
              onAskNexorbit('Explain how you prioritized my morning schedule and what potential conflicts exist.');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Ask Nexorbit about this plan</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors text-center cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
