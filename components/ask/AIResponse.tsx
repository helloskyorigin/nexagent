'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { AskResponseData, FindingItem, SourceItem } from './types';
import { FindingCard } from './FindingCard';
import { RecommendedNextStep } from './RecommendedNextStep';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface AIResponseProps {
  data: AskResponseData;
  onSelectFindingAction: (finding: FindingItem) => void;
  onSelectSource: (source: SourceItem) => void;
  onPrepareResponse: () => void;
  className?: string;
}

export const AIResponse: React.FC<AIResponseProps> = ({
  data,
  onSelectFindingAction,
  onSelectSource,
  onPrepareResponse,
  className,
}) => {
  const { addToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExpandedFocus, setIsExpandedFocus] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${data.summaryText}\n\n` +
      data.findings.map((f, i) => `${i + 1}. ${f.title}: ${f.description}`).join('\n') +
      (data.recommendedNextStep ? `\n\nNext Step: ${data.recommendedNextStep.text}` : '');

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      description: 'Nexorbit findings copied successfully.',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      addToast({
        type: 'info',
        title: 'Voice Briefing Active',
        description: 'Simulating audio summary of key insights.',
      });
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 4000);
    }
  };

  return (
    <div className={cn('space-y-4 my-2 animate-fadeIn', className)}>
      {/* Top Header Row with Identity and Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Left Identity: Celestial Orb + Name + Badge + Timestamp */}
        <div className="flex items-center gap-3">
          {/* Orbital Celestial Sphere */}
          <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-900 via-indigo-700 to-violet-500 p-[2px] shadow-[0_0_15px_rgba(99,102,241,0.25)] shrink-0 flex items-center justify-center">
            {/* Ambient inner sphere glow */}
            <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#818cf8_0%,transparent_60%)] opacity-80" />
              {/* Orbital rings SVG */}
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-200 animate-spin" style={{ animationDuration: '12s' }}>
                <circle cx="12" cy="12" r="3" fill="#ffffff" />
                <ellipse cx="12" cy="12" rx="8" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-30 12 12)" />
              </svg>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-950 tracking-tight">
                Nexorbit
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/60 shadow-2xs">
                AI Brain
              </span>
            </div>
            <span className="text-xs text-slate-400 font-normal block">
              {data.timestamp || 'Today, 9:24 AM'}
            </span>
          </div>
        </div>

        {/* Right Response Actions: Audio, Copy, Expand */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={cn(
              'p-2 rounded-xl transition-colors cursor-pointer',
              isPlayingAudio ? 'text-indigo-600 bg-indigo-50 animate-pulse' : 'hover:text-slate-700 hover:bg-slate-100/70'
            )}
            title={isPlayingAudio ? 'Mute briefing' : 'Play voice briefing'}
          >
            {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl hover:text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
            title="Copy response"
          >
            {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsExpandedFocus(!isExpandedFocus);
              addToast({
                type: 'info',
                title: isExpandedFocus ? 'Standard View' : 'Focus Mode',
                description: isExpandedFocus ? 'Returned to normal layout.' : 'Focused on AI insights.',
              });
            }}
            className="p-2 rounded-xl hover:text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer hidden sm:inline-flex"
            title={isExpandedFocus ? 'Exit focus mode' : 'Expand focus view'}
          >
            {isExpandedFocus ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Dominant Headline */}
      <h2 className="text-base sm:text-lg lg:text-[19px] font-bold text-slate-950 tracking-tight leading-snug pt-1">
        {data.summaryText}
      </h2>

      {/* Finding Cards List */}
      <div className="space-y-3 pt-1">
        {data.findings.map((finding) => (
          <FindingCard
            key={finding.id}
            finding={finding}
            onActionClick={onSelectFindingAction}
            onSourceClick={onSelectSource}
          />
        ))}
      </div>

      {/* Recommended Next Step Banner */}
      {data.recommendedNextStep && (
        <RecommendedNextStep
          text={data.recommendedNextStep.text}
          actionLabel={data.recommendedNextStep.actionLabel}
          onPrepareResponse={onPrepareResponse}
        />
      )}
    </div>
  );
};
