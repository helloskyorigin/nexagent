'use client';

import React, { useState } from 'react';
import { Paperclip, Mic, Globe, ArrowUp, Sparkles, X, FileText, Zap, Brain, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './IconButton';
import { Badge } from './Badge';

export interface AICommandInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  selectedTask?: string;
  onTaskChange?: (task: string) => void;
  onSubmit?: (prompt: string) => void;
  onSend?: (prompt: string, options: { isDeepResearch: boolean; attachments: File[] }) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  suggestedPrompts?: string[];
}

export const AICommandInput: React.FC<AICommandInputProps> = ({
  placeholder = 'Ask Nexorbit anything, search across workspace context, or draft an action...',
  value: controlledValue,
  onChange: setControlledValue,
  selectedTask = 'ASK_MY_WORLD',
  onTaskChange,
  onSubmit,
  onSend,
  isLoading = false,
  disabled = false,
  className,
  suggestedPrompts = [
    'Connect the dots between my recent emails and Notion tasks',
    'Summarize my calendar schedule for tomorrow',
    'Prepare a briefing note on the Q3 product roadmap',
  ],
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ id: string; name: string }>>([]);

  const isControlled = controlledValue !== undefined;
  const textValue = isControlled ? controlledValue : internalValue;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isControlled && setControlledValue) {
      setControlledValue(e.target.value);
    } else {
      setInternalValue(e.target.value);
    }
  };

  const handleSend = () => {
    if ((!textValue.trim() && attachedFiles.length === 0) || isLoading || disabled) return;

    if (onSubmit) {
      onSubmit(textValue);
    }
    if (onSend) {
      onSend(textValue, { isDeepResearch, attachments: [] });
    }

    if (!isControlled) {
      setInternalValue('');
    }
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMockAttachment = () => {
    const mockFile = {
      id: `file_${Date.now()}`,
      name: `context_doc_${attachedFiles.length + 1}.pdf`,
    };
    setAttachedFiles((prev) => [...prev, mockFile]);
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const taskOptions = [
    { id: 'ASK_MY_WORLD', label: 'Ask My World', icon: <Brain className="h-3 w-3" /> },
    { id: 'CONNECT_THE_DOTS', label: 'Connect Dots', icon: <Zap className="h-3 w-3" /> },
    { id: 'DEEP_RESEARCH', label: 'Deep Research', icon: <Globe className="h-3 w-3" /> },
    { id: 'HEAVY_AGENT_TASK', label: 'Heavy Task', icon: <Shield className="h-3 w-3" /> },
  ];

  return (
    <div className={cn('w-full flex flex-col gap-2.5', className)}>
      {/* Task Selector Row */}
      {onTaskChange && (
        <div className="flex flex-wrap items-center gap-1.5 px-0.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Router Mode:</span>
          {taskOptions.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onTaskChange(task.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150',
                selectedTask === task.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'orbital-glass-interactive text-slate-600 hover:text-slate-900'
              )}
            >
              {task.icon}
              <span>{task.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="orbital-glass-elevated rounded-2xl w-full p-0.5 transition-all duration-200 hover:border-indigo-300/80 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20">
        <div className="w-full flex flex-col">
          {/* Active Options / Attachments Bar */}
          {(attachedFiles.length > 0 || isDeepResearch) && (
            <div className="px-4 pt-3 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2">
              {isDeepResearch && (
                <Badge variant="accent" size="sm" className="gap-1 animate-fadeIn">
                  <Globe className="h-3 w-3" />
                  <span>Deep Research Active</span>
                  <button
                    type="button"
                    onClick={() => setIsDeepResearch(false)}
                    className="ml-1 hover:text-indigo-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md border border-slate-200"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(file.id)}
                    className="text-slate-400 hover:text-slate-700 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea Surface */}
          <textarea
            value={textValue}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={2}
            className="w-full px-4 pt-3 pb-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none disabled:opacity-50 font-sans"
          />

          {/* Toolbar Controls */}
          <div className="px-3 pb-2 pt-1 flex items-center justify-between border-t border-slate-100/60">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleMockAttachment}
                disabled={disabled || isLoading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Paperclip className="h-3.5 w-3.5" />
                <span>Attach</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                disabled={disabled || isLoading}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                  isVoiceActive
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                )}
              >
                <Mic className={cn('h-3.5 w-3.5', isVoiceActive && 'animate-pulse')} />
                <span>Voice</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeepResearch(!isDeepResearch)}
                disabled={disabled || isLoading}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-150 border',
                  isDeepResearch
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                    : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Research</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                Press Enter ↵ to send
              </span>

              <button
                type="button"
                onClick={handleSend}
                disabled={(!textValue.trim() && attachedFiles.length === 0) || isLoading || disabled}
                aria-label="Send prompt to Nexorbit"
                className={cn(
                  'inline-flex items-center justify-center h-7.5 w-7.5 rounded-xl bg-slate-900 text-white transition-all duration-150 shadow-2xs',
                  'hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none'
                )}
              >
                {isLoading ? (
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-white" />
                ) : (
                  <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      {suggestedPrompts.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-0.5">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (isControlled && setControlledValue) {
                  setControlledValue(prompt);
                } else {
                  setInternalValue(prompt);
                }
              }}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-100/70 hover:bg-slate-200/60 px-2.5 py-0.5 rounded-full border border-slate-200/50 transition-all duration-150 truncate max-w-[280px] cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
