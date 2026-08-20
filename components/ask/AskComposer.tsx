'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Sparkles, ArrowRight, Info, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getRotatingPlaceholder } from '../chat/ChatComposer';

export interface AskComposerProps {
  onSend: (text: string) => void;
  onOpenAttachModal: () => void;
  onOpenVoiceModal: () => void;
  isDeepResearch: boolean;
  onToggleDeepResearch: () => void;
  isLoading?: boolean;
  className?: string;
}

export const AskComposer: React.FC<AskComposerProps> = ({
  onSend,
  onOpenAttachModal,
  onOpenVoiceModal,
  isDeepResearch,
  onToggleDeepResearch,
  isLoading = false,
  className,
}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className={cn('w-full select-none space-y-2', className)}>
      {/* Signature Animated Perimeter Command Box */}
      <div
        className={cn(
          'relative rounded-[26px] bg-white transition-all duration-300 p-3.5 sm:p-4 shadow-[0_8px_30px_rgba(99,102,241,0.06)]',
          isFocused
            ? 'border border-indigo-300 shadow-[0_0_24px_rgba(99,102,241,0.16)]'
            : 'border border-indigo-100/90 hover:border-indigo-200/90'
        )}
      >
        {/* Luminous blue-violet light perimeter animation on focus/hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-[25px] pointer-events-none p-[1.5px] overflow-hidden transition-opacity duration-300',
            isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
          )}
        >
          <div
            className="absolute inset-[-150%] animate-spin"
            style={{
              animationDuration: '6s',
              animationTimingFunction: 'linear',
              background:
                'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(99,102,241,0.1) 60deg, #6366f1 180deg, #a855f7 240deg, transparent 360deg)',
            }}
          />
          {/* Inner masking */}
          <div className="absolute inset-[1.5px] rounded-[24px] bg-white" />
        </div>

        {/* Inner Content Area */}
        <div className="relative z-10 space-y-2.5">
          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={getRotatingPlaceholder()}
            rows={1}
            className="w-full bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-sans leading-relaxed min-h-[36px] max-h-[120px] focus:ring-0 select-text"
          />

          {/* Bottom Action Controls Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
            {/* Left Controls: Attach, Voice, Research */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Attach Button */}
              <button
                type="button"
                onClick={onOpenAttachModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer shadow-2xs"
              >
                <Paperclip className="h-3.5 w-3.5" />
                <span>Attach</span>
              </button>

              {/* Voice Button */}
              <button
                type="button"
                onClick={onOpenVoiceModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer shadow-2xs"
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Voice</span>
              </button>

              {/* Research Toggle Button */}
              <button
                type="button"
                onClick={onToggleDeepResearch}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-2xs border',
                  isDeepResearch
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-indigo-200 hover:text-indigo-600'
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Research</span>
                {isDeepResearch && <Check className="h-3 w-3 ml-0.5" />}
              </button>
            </div>

            {/* Right Send Action Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className={cn(
                'h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0',
                text.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200'
                  : 'bg-indigo-600/90 text-white/90 hover:bg-indigo-600 opacity-90'
              )}
              title="Send message"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Centered Disclaimer */}
      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-normal pt-1">
        <span>Nexorbit may make mistakes. Verify important info.</span>
        <Info className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer inline" />
      </div>
    </div>
  );
};
