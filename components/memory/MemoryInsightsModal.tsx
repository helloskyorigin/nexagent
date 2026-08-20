'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Brain,
  Zap,
  Users,
  Folder,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface MemoryInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMemories?: number;
}

export const MemoryInsightsModal: React.FC<MemoryInsightsModalProps> = ({
  isOpen,
  onClose,
  totalMemories = 1248,
}) => {
  const { addToast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addToast({
        title: 'Synaptic Synthesis Complete',
        description: 'Refreshed 48 cross-workspace memory connections and optimized knowledge embeddings.',
        type: 'success',
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                <Sparkles className="h-4 w-4 fill-indigo-600/20" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Memory &amp; Context Insights
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  How Nexorbit synthesizes your connected universe into real-time reasoning.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 py-5 max-h-[72vh] overflow-y-auto pr-1">
            {/* Top Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Synapses
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {totalMemories.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +18% this month
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Context Recall Speed
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  12ms
                </div>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  Zero-latency vector cache
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Privacy Status
                </span>
                <div className="text-2xl font-black text-emerald-600 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span>100% E2E</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Encrypted locally in session
                </span>
              </div>
            </div>

            {/* Top Topics & Frequent Concepts */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Top Concepts in Active Memory
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Folder className="h-4 w-4 text-indigo-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Project Alpha</div>
                      <div className="text-[11px] text-slate-400">428 memories • High Priority</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    34%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Team Alignment &amp; Leads</div>
                      <div className="text-[11px] text-slate-400">245 memories • 3 key stakeholders</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    20%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">GTM &amp; Pricing Decisions</div>
                      <div className="text-[11px] text-slate-400">65 key decisions logged</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    12%
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Brain className="h-4 w-4 text-rose-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">User Workflow Preferences</div>
                      <div className="text-[11px] text-slate-400">312 personalized nuance tokens</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    25%
                  </span>
                </div>
              </div>
            </div>

            {/* AI Autonomous Synthesis Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white border border-indigo-100 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-indigo-900">
                  Continuous Synaptic Indexing
                </div>
                <p className="text-[11px] text-indigo-700/80 font-medium">
                  Nexorbit continuously connects dots across Gmail, Calendar, Drive, and Notion in the background.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleScan}
                disabled={isScanning}
                leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 px-3.5 rounded-xl shrink-0 cursor-pointer"
              >
                {isScanning ? 'Synthesizing...' : 'Rescan Context'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs h-9 px-5 rounded-xl cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
