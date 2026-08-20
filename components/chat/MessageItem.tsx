'use client';

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Paperclip,
  MoreVertical,
  Globe,
} from 'lucide-react';
import { ChatMessage } from './types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';
import Image from 'next/image';

export interface UserMessageProps {
  message: ChatMessage;
  userInitial?: string;
  userName?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 md:mt-10 first:mt-2 mb-4 md:mb-5 animate-fadeIn flex flex-col items-end">
      {/* User Speech Bubble */}
      <div className="w-fit max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-3xl bg-[#5486E9] px-4.5 py-2.5 sm:px-5 sm:py-2.5 text-white text-[16px] md:text-[17.5px] font-normal leading-[1.6] whitespace-pre-wrap break-words">
        {message.text}
      </div>

      {/* User Attachments if any */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex flex-wrap justify-end gap-2 pt-2 max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
          {message.attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl bg-[#171717] border border-[#444654] text-xs text-[#ECECF1]"
            >
              <Paperclip className="h-3.5 w-3.5 text-[#5486E9]" />
              <span className="truncate max-w-[160px] font-medium">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export interface AssistantMessageProps {
  message: ChatMessage;
  onRegenerate?: () => void;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  message,
  onRegenerate,
}) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (!showMoreMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMoreMenu(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.more-menu-container')) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const isError =
    message.text.includes('Something went wrong') ||
    message.text.includes('Failed to generate') ||
    message.text.includes('I ran into an issue');

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.text);
    }
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Copied',
      description: 'Response copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (isPositive: boolean | null) => {
    setLiked(isPositive);
    if (isPositive !== null) {
      addToast({
        type: 'info',
        title: 'Feedback',
        description: isPositive ? 'Response marked as helpful.' : 'Feedback recorded.',
      });
    }
  };

  const handleRegenerateClick = () => {
    if (isRegenerating || !onRegenerate) return;
    setIsRegenerating(true);
    onRegenerate();
    setTimeout(() => setIsRegenerating(false), 3000);
  };

  const uniqueSources = React.useMemo(() => {
    if (!message.sourcesUsed || message.sourcesUsed.length === 0) return [];
    const seenUrls = new Set<string>();
    const list: typeof message.sourcesUsed = [];

    for (const item of message.sourcesUsed) {
      if (!item.url) {
        list.push(item);
        continue;
      }
      const normalizedUrl = item.url.trim().toLowerCase().replace(/\/$/, '');
      if (!seenUrls.has(normalizedUrl)) {
        seenUrls.add(normalizedUrl);
        list.push(item);
      }
    }
    return list;
  }, [message]);

  const hasSources = uniqueSources.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto mt-0 mb-2 animate-fadeIn group/msg">
      <div className="space-y-2 text-[#ECECF1]">
        {/* Content */}
        <div className="text-[16px] md:text-[18px] leading-[1.65] md:leading-[1.7] text-[#ECECF1] font-normal max-w-none tracking-normal">
          {isError ? (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm space-y-2.5 max-w-xl">
              <p className="font-medium">Something went wrong while generating this response.</p>
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 border border-rose-500/30"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Try again</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {message.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden border border-[#444654] bg-[#0D0D0D] max-w-lg shadow-md group relative">
                  <img src={message.imageUrl} alt="Generated visual" className="w-full h-auto object-cover" />
                  <div className="flex items-center justify-end gap-2 p-2 bg-[#171717]/90 backdrop-blur-sm border-t border-[#444654] opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 left-0 right-0">
                    {onRegenerate && (
                      <button
                        type="button"
                        onClick={onRegenerate}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ECECF1] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-all active:scale-95"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>Regenerate</span>
                      </button>
                    )}
                    <a
                      href={message.imageUrl}
                      download="nexorbit-gen.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ECECF1] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-all active:scale-95"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              )}
              <MarkdownRenderer content={message.text} sourcesUsed={message.sourcesUsed} />

              {/* Sources Section */}
              {hasSources && (
                <div className="mt-4 pt-3 border-t border-white/[0.08]">
                  <div className="flex items-center select-none">
                    <button
                      type="button"
                      onClick={() => setSourcesOpen(!sourcesOpen)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-[12px] font-medium text-[#A1A1AA] hover:text-[#ECECF1] transition-all cursor-pointer active:scale-95"
                    >
                      <Globe className="h-3.5 w-3.5 text-[#5486E9]" />
                      <span>Sources</span>
                      <span className="inline-flex items-center justify-center bg-[#5486E9]/15 text-[11px] font-mono font-bold text-[#5486E9] h-4.5 min-w-[18px] px-1 rounded">
                        {uniqueSources.length}
                      </span>
                      {sourcesOpen ? (
                        <ChevronUp className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
                      )}
                    </button>
                  </div>

                  {sourcesOpen && (
                    <div className="mt-2.5 space-y-1.5 max-w-xl animate-fadeIn">
                      {uniqueSources.map((source, idx) => {
                        const originalIndex = message.sourcesUsed?.findIndex((s) => s.url === source.url) ?? idx;
                        const citationNum = originalIndex + 1;

                        return (
                          <a
                            key={source.id || source.url || idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 p-2 px-3 rounded-xl bg-[#171717]/40 hover:bg-[#1E1E22]/60 border border-white/[0.04] hover:border-[#5486E9]/30 transition-all cursor-pointer group text-left min-w-0"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {/* Citation Badge */}
                              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded text-[11px] font-mono font-bold text-[#5486E9] bg-[#5486E9]/10 border border-[#5486E9]/20 shrink-0 select-none">
                                {citationNum}
                              </span>

                              {/* Favicon */}
                              <div className="h-4.5 w-4.5 shrink-0 rounded-[3px] overflow-hidden flex items-center justify-center bg-[#24242A] relative">
                                {source.domain ? (
                                  <img
                                    src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
                                    alt=""
                                    className="w-3.5 h-3.5 object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <Globe className="h-3 w-3 text-[#A1A1AA]" />
                                )}
                              </div>

                              {/* Title / Domain */}
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-medium text-[#ECECF1] truncate group-hover:text-[#5486E9] transition-colors leading-snug">
                                  {source.title || 'Web Source'}
                                </span>
                                <span className="text-[11px] text-[#8E8EA0] truncate font-normal leading-normal">
                                  {source.domain || source.connectorName || 'Web page'}
                                </span>
                              </div>
                            </div>

                            {/* External action icon */}
                            <ExternalLink className="h-3.5 w-3.5 text-[#8E8EA0] group-hover:text-[#5486E9] shrink-0 opacity-40 group-hover:opacity-100 transition-all" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions Row */}
        {!isError && (
          <div className="flex items-center gap-1 text-[#A1A1AA] pt-2 opacity-100 md:opacity-0 md:group-hover/msg:opacity-100 md:focus-within:opacity-100 transition-opacity duration-150">
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:text-[#ECECF1] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9] transition-all duration-150 cursor-pointer"
              title="Copy"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[#10A37F]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleFeedback(liked === true ? null : true)}
              className={cn(
                'p-1.5 rounded-lg hover:text-[#ECECF1] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9] transition-all duration-150 cursor-pointer',
                liked === true && 'text-[#5486E9] bg-[#5486E9]/10 hover:text-[#5486E9] hover:bg-[#5486E9]/15'
              )}
              title="Helpful"
              aria-label="Thumbs up"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleFeedback(liked === false ? null : false)}
              className={cn(
                'p-1.5 rounded-lg hover:text-[#ECECF1] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9] transition-all duration-150 cursor-pointer',
                liked === false && 'text-rose-400 bg-rose-500/10 hover:text-rose-400 hover:bg-rose-500/15'
              )}
              title="Not helpful"
              aria-label="Thumbs down"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>

            {onRegenerate && (
              <button
                type="button"
                onClick={handleRegenerateClick}
                disabled={isRegenerating}
                className={cn(
                  'p-1.5 rounded-lg hover:text-[#ECECF1] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9] transition-all duration-150 cursor-pointer',
                  isRegenerating && 'opacity-50 cursor-not-allowed animate-spin'
                )}
                title="Regenerate"
                aria-label="Regenerate message"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            )}

            <div className="relative more-menu-container">
              <button
                type="button"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={cn(
                  'p-1.5 rounded-lg hover:text-[#ECECF1] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9] transition-all duration-150 cursor-pointer',
                  showMoreMenu && 'text-[#ECECF1] bg-white/[0.06]'
                )}
                title="More options"
                aria-label="More options"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>

              {showMoreMenu && (
                <div
                  className="absolute left-0 bottom-full mb-1.5 w-36 rounded-xl bg-[#171717] border border-white/[0.08] shadow-xl p-1 z-30 text-xs animate-fadeIn"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleCopy();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[#ECECF1] hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    Copy raw Markdown
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sources Section - ONLY if real sources exist */}
        {hasSources && (
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-[#C5C5D2] hover:text-white transition-colors cursor-pointer select-none"
            >
              <span>Sources ({message.sourcesUsed!.length})</span>
              {sourcesOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {sourcesOpen && (
              <div className="space-y-1.5 pt-1">
                {message.sourcesUsed!.map((src, index) => (
                  <a
                    key={src.id || index}
                    href={src.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-[#171717] hover:bg-[#212121] border border-[#444654] text-xs transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="text-[#5486E9] font-mono font-medium">
                        ({index + 1})
                      </span>
                      <span className="font-medium text-[#ECECF1] group-hover:text-white truncate">
                        {src.title}
                      </span>
                      {src.domain && (
                        <span className="text-[#C5C5D2] text-[11px] shrink-0">
                          ({src.domain})
                        </span>
                      )}
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-[#C5C5D2] group-hover:text-white shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export interface TypingIndicatorProps {
  status?: string | null;
  isStreaming?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ status, isStreaming = false }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-2 mb-4 flex items-center gap-2.5 h-6 select-none animate-fadeIn">
      <div
        className="relative flex items-center justify-center w-5 h-5 shrink-0"
        title={status || (isStreaming ? "Nexorbit AI is active" : "Nexorbit AI is thinking...")}
      >
        {/* Subtle Orbital Ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border transition-all duration-500 ease-in-out motion-reduce:animate-none",
            isStreaming
              ? "border-[#5486E9]/35 shadow-[0_0_8px_rgba(84,134,233,0.15)] animate-[spin_8s_linear_infinite]"
              : "border-white/20 animate-[spin_12s_linear_infinite]"
          )}
        >
          {/* Orbital Node */}
          <div
            className={cn(
              "absolute -top-[1.5px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-500",
              isStreaming ? "bg-[#5486E9]" : "bg-white/60"
            )}
          />
        </div>

        {/* Central Core */}
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-500 ease-in-out motion-reduce:animate-none",
            isStreaming
              ? "bg-[#5486E9] shadow-[0_0_10px_rgba(84,134,233,0.8)] animate-pulse"
              : "bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.4)] animate-pulse"
          )}
        />
      </div>

      {status && (
        <span className="text-xs text-[#8E8EA0] font-medium tracking-wide animate-pulse">
          {status}
        </span>
      )}
    </div>
  );
};

