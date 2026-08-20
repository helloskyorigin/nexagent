'use client';

import React from 'react';
import { HelpCircle, ShieldCheck, Sparkles, Layers, Link2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { SourceItem } from './types';
import { SourceCard } from './SourceCard';

export interface WhyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  whyExplanation: string;
  sources: SourceItem[];
  onSelectSource?: (source: SourceItem) => void;
}

export const WhyPanel: React.FC<WhyPanelProps> = ({
  isOpen,
  onClose,
  whyExplanation,
  sources,
  onSelectSource,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Why am I seeing this?"
      description="Nexorbit Context Reasoning & Transparency"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Core explanation box */}
        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-bold">
            <Sparkles className="h-4 w-4 text-indigo-600 fill-indigo-500" />
            <span>AI Reasoning Logic</span>
          </div>
          <p className="text-indigo-950 leading-relaxed">{whyExplanation}</p>
        </div>

        {/* Evidence Sources */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-indigo-500" />
              <span>Matching Connected Evidence</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{sources.length} sources</span>
          </div>

          <div className="space-y-2">
            {sources.map((src) => (
              <SourceCard
                key={src.id}
                source={src}
                onClick={(selected) => {
                  onSelectSource?.(selected);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>

        {/* Trust & Privacy Notice */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold text-slate-900 block">Private Workspace Context</span>
            Nexorbit uses zero-shot cross-app reasoning with strict privacy boundaries. Your personal credentials and documents are never shared externally.
          </div>
        </div>
      </div>
    </Modal>
  );
};
