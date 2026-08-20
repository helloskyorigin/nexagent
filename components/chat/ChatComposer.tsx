'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Paperclip,
  Mic,
  ArrowUp,
  Image as ImageIcon,
  X,
  Sparkles,
  Search,
  Library,
  Mail,
  HardDrive,
  Calendar,
  MessageSquare,
  Github,
  CheckCircle2,
  Settings,
  Plus,
  Square,
  Loader2
} from 'lucide-react';
import { ChatAttachment } from './types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { IntegrationService } from '../../services/integrations/integration.service';
import { PluginItem } from '../../services/integrations/types';

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export interface ChatComposerProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSubmit: (e?: React.FormEvent, attachments?: ChatAttachment[], webSearchEnabled?: boolean) => void;
  attachments?: ChatAttachment[];
  onAddAttachments?: (files: ChatAttachment[]) => void;
  onRemoveAttachment?: (id: string) => void;
  isThinking?: boolean;
  onStop?: () => void;
  placeholder?: string;
  webSearchEnabled?: boolean;
  onToggleWebSearch?: () => void;
  className?: string;
  onGenerateImage?: (prompt: string, options: { style?: string; aspectRatio?: string }) => void;
}

// Visual styles for the Image panel
const IMAGE_STYLES = [
  { id: 'None', label: 'No Style', bg: 'bg-slate-800' },
  { id: 'Photorealistic', label: 'Realistic', bg: 'bg-blue-900/50' },
  { id: 'Digital Art', label: 'Digital', bg: 'bg-purple-900/50' },
  { id: 'Cinematic', label: 'Cinematic', bg: 'bg-amber-900/50' },
  { id: 'Anime', label: 'Anime', bg: 'bg-pink-900/50' },
  { id: '3D Render', label: '3D Render', bg: 'bg-emerald-900/50' },
  { id: 'Sketch', label: 'Sketch', bg: 'bg-slate-700' }
];

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square', icon: '◻️' },
  { id: '16:9', label: 'Wide', icon: '▭' },
  { id: '9:16', label: 'Tall', icon: '▯' },
  { id: '4:3', label: 'Standard', icon: '▭' },
  { id: '3:2', label: 'Classic', icon: '▭' }
];

// Helper to get Connector Icon based on ID with colorful styling
const getConnectorIcon = (id: string, className: string = "h-5 w-5") => {
  switch (id) {
    case 'gmail': return <Mail className={cn(className, "text-[#EA4335]")} />;
    case 'drive': return <HardDrive className={cn(className, "text-[#34A853]")} />;
    case 'calendar': return <Calendar className={cn(className, "text-[#4285F4]")} />;
    case 'slack': return <MessageSquare className={cn(className, "text-[#E01E5A]")} />;
    case 'github': return <Github className={cn(className, "text-[#ECECF1]")} />;
    case 'notion': return <Settings className={cn(className, "text-[#ECECF1]")} />;
    default: return <Settings className={cn(className, "text-[#5486E9]")} />;
  }
};

// Curated set of short, work-oriented Nexorbit placeholders
const WORK_PLACEHOLDERS = [
  'What are we working on today?',
  'What should we tackle?',
  'What do you want to get done?',
  'What can we build together?',
  "What's the next move?",
  "Let's get to work.",
  'What project are we advancing?',
  'How can Nexorbit assist you now?',
  'What task should we solve next?',
  'Where shall we begin?'
];

export const getRotatingPlaceholder = (): string => {
  const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
  const index = Math.floor(Date.now() / FIVE_HOURS_MS) % WORK_PLACEHOLDERS.length;
  return WORK_PLACEHOLDERS[index];
};

export const ChatComposer: React.FC<ChatComposerProps> = ({
  inputText,
  onChangeText,
  onSubmit,
  attachments = [],
  onAddAttachments,
  onRemoveAttachment,
  isThinking = false,
  onStop,
  placeholder,
  webSearchEnabled = false,
  onToggleWebSearch,
  className,
  onGenerateImage,
}) => {
  const { addToast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [tempMode, setTempMode] = useState<'normal' | 'image' | 'library'>('normal');

  const [showPlusMenu, setShowPlusMenu] = useState(false);
  
  // Image generation options
  const [imageStyle, setImageStyle] = useState('None');
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');

  // Connector state - only show CONNECTED plugins
  const [activePlugins, setActivePlugins] = useState<PluginItem[]>(() => {
    return IntegrationService.getPlugins().filter(p => p.connectionStatus === 'CONNECTED');
  });
  const [selectedConnectors, setSelectedConnectors] = useState<Set<string>>(new Set());

  // Derived activeMode based on reactive props and user tool selection
  const activeMode = useMemo(() => {
    if (webSearchEnabled) {
      return 'search';
    }
    if (selectedConnectors.size > 0) {
      return 'connectors';
    }
    return tempMode;
  }, [webSearchEnabled, selectedConnectors.size, tempMode]);

  const activePlaceholder = useMemo(() => {
    if (activeMode === 'search') {
      return 'What should we search for?';
    }
    if (activeMode === 'image') {
      return 'Describe the image you want to create...';
    }
    if (activeMode === 'library') {
      return 'Ask about your selected files...';
    }
    if (activeMode === 'connectors') {
      return 'Ask about your connected apps...';
    }
    if (attachments.length > 0) {
      return 'selected attachments...';
    }
    return 'What task should we solve next?';
  }, [activeMode, attachments.length]);

  // Handle escape to close plus menu
  useEffect(() => {
    const handleKeyDownGlobal = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => document.removeEventListener('keydown', handleKeyDownGlobal);
  }, []);

  const handleSelectMode = (mode: 'search' | 'image' | 'library' | 'connectors') => {
    if (mode === 'search') {
      setSelectedConnectors(new Set());
      setTempMode('normal');
      if (!webSearchEnabled && onToggleWebSearch) {
        onToggleWebSearch();
      }
    } else if (mode === 'connectors') {
      if (webSearchEnabled && onToggleWebSearch) {
        onToggleWebSearch();
      }
      setTempMode('normal');
    } else {
      if (webSearchEnabled && onToggleWebSearch) {
        onToggleWebSearch();
      }
      setSelectedConnectors(new Set());
      setTempMode(mode as 'image' | 'library');
    }
    setShowPlusMenu(false);
  };

  const handleClearMode = () => {
    if (activeMode === 'search') {
      if (webSearchEnabled && onToggleWebSearch) {
        onToggleWebSearch();
      }
    } else if (activeMode === 'connectors') {
      setSelectedConnectors(new Set());
    } else {
      setTempMode('normal');
    }
  };

  // Load connected plugins
  useEffect(() => {
    const unsubscribe = IntegrationService.subscribe(() => {
      const updatedPlugins = IntegrationService.getPlugins();
      setActivePlugins(updatedPlugins.filter(p => p.connectionStatus === 'CONNECTED'));
    });
    return () => unsubscribe();
  }, []);

  // Handle click outside to close plus menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPlusMenu(false);
      }
    };
    if (showPlusMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [inputText]);

  const handleSubmitForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (activeMode === 'image') {
      if (!inputText.trim() || isThinking) return;
      if (onGenerateImage) {
        onGenerateImage(inputText.trim(), { style: imageStyle, aspectRatio: imageAspectRatio });
        setInputText('');
        handleClearMode();
      }
      return;
    }

    if ((!inputText.trim() && attachments.length === 0) || isThinking) return;
    onSubmit(e, attachments, webSearchEnabled);

    // Clear temporary modes after submission
    if (activeMode === 'library') {
      handleClearMode();
    } else if (activeMode === 'connectors') {
      handleClearMode();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitForm();
    }
  };

  const handleToggleConnector = (id: string) => {
    setSelectedConnectors(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    
    if (webSearchEnabled && onToggleWebSearch) {
      onToggleWebSearch();
    }
    setTempMode('normal');
    setShowPlusMenu(false);
  };

  const hasContent = inputText.trim().length > 0 || attachments.length > 0;

  return (
    <div className={cn('w-full max-w-3xl mx-auto flex flex-col items-center select-none relative', className)}>
      <input
        type="file"
        ref={fileInputRef}
        accept="*/*"
        multiple
        onChange={(e) => {
          if (e.target.files && onAddAttachments) {
            const filesArray = Array.from(e.target.files);
            const newAttachments: ChatAttachment[] = filesArray.map(file => {
              const isImg = file.type.startsWith('image/');
              return {
                id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl: isImg ? URL.createObjectURL(file) : undefined,
                file
              };
            });
            onAddAttachments(newAttachments);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      <form
        onSubmit={handleSubmitForm}
        className="w-full rounded-[26px] sm:rounded-[28px] bg-[#212121] border border-white/[0.12] p-2 sm:p-2.5 shadow-xl space-y-1.5 focus-within:border-white/[0.24] transition-all duration-150"
      >
        {/* Rich Compact Attachment Previews inside composer */}
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1.5 pt-1 pb-1">
            {attachments.map(file => {
              const isImage = file.type?.startsWith('image/') || file.previewUrl;
              return (
                <div
                  key={file.id}
                  className="group relative flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-xs text-[#ECECF1] shadow-sm animate-in zoom-in-95 transition-all duration-150"
                >
                  {isImage && file.previewUrl ? (
                    <div className="h-7 w-7 rounded-md overflow-hidden bg-black/40 shrink-0 border border-white/10">
                      <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                      <Paperclip className="h-3.5 w-3.5 text-[#38BDF8]" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 max-w-[120px] sm:max-w-[160px]">
                    <span className="truncate font-medium text-[12px] leading-snug">{file.name}</span>
                    {file.size ? (
                      <span className="text-[10px] text-[#8E8EA0] leading-none mt-0.5">
                        {formatFileSize(file.size)}
                      </span>
                    ) : null}
                  </div>
                  {onRemoveAttachment && (
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(file.id)}
                      className="text-[#8E8EA0] hover:text-white p-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer ml-0.5"
                      aria-label="Remove attachment"
                      title="Remove attachment"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* IMAGE IDEAS & OPTIONS (When Create Image mode is active) */}
        {activeMode === 'image' && (
          <div className="flex flex-col gap-2 px-1.5 pt-1 pb-1 animate-in fade-in duration-200">
            {/* Explore Ideas Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#8E8EA0] shrink-0 mr-0.5">
                <Sparkles className="h-3.5 w-3.5 text-[#5486E9]" />
                <span>Ideas:</span>
              </div>
              {[
                'Cyberpunk neon workspace at night',
                'Minimal 3D geometric icon',
                'Serene mountain landscape at sunrise',
                'Retro futuristic AI avatar',
                'Modern architectural glass house'
              ].map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangeText(idea);
                    if (textareaRef.current) {
                      textareaRef.current.focus();
                    }
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11.5px] text-[#ECECF1] hover:text-white transition-all shrink-0 cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {idea}
                </button>
              ))}
            </div>

            {/* Compact Style and Aspect Ratio selector options */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-lg px-2 py-1 text-[#C5C5D2]">
                <span className="text-[11px] text-[#8E8EA0]">Style:</span>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="bg-transparent text-[11.5px] text-[#ECECF1] focus:outline-none cursor-pointer"
                >
                  {IMAGE_STYLES.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#212121] text-white">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-lg px-2 py-1 text-[#C5C5D2]">
                <span className="text-[11px] text-[#8E8EA0]">Ratio:</span>
                <select
                  value={imageAspectRatio}
                  onChange={(e) => setImageAspectRatio(e.target.value)}
                  className="bg-transparent text-[11.5px] text-[#ECECF1] focus:outline-none cursor-pointer"
                >
                  {ASPECT_RATIOS.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#212121] text-white">
                      {r.id} ({r.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-end gap-1.5 sm:gap-2 px-1">
            {/* PLUS BUTTON & TOOL MENU */}
            <div className="relative shrink-0 mb-0.5" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
                  showPlusMenu 
                    ? "bg-white/[0.12] text-white rotate-45" 
                    : "bg-transparent hover:bg-white/[0.08] text-[#C5C5D2] hover:text-[#ECECF1]"
                )}
                aria-label="Add tools"
                title="Add tools"
              >
                <Plus className="h-5 w-5 stroke-[2]" />
              </button>

              {/* Spacious, Premium Tool Menu (ChatGPT scale & hierarchy) */}
              {showPlusMenu && (
                <div className="absolute bottom-[calc(100%+12px)] left-0 w-[280px] sm:w-[320px] rounded-2xl bg-[#212121] shadow-[0_0_40px_rgba(0,0,0,0.5)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 border border-white/5">
                  <div className="flex flex-col">
                    {/* 1. Add photos & files */}
                    <button
                      type="button"
                      onClick={() => { fileInputRef.current?.click(); setShowPlusMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2F2F2F] transition-colors text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9]"
                    >
                      <div className="flex items-center justify-center shrink-0 text-[#C5C5D2] group-hover:text-white transition-colors">
                        <Paperclip className="h-5 w-5 stroke-[2]" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[14px] font-medium text-[#ECECF1] group-hover:text-white truncate transition-colors">
                          Add photos & files
                        </span>
                        <span className="text-[12px] text-[#8E8EA0] truncate">
                          Upload documents, spreadsheets, images
                        </span>
                      </div>
                    </button>

                    {/* 2. Add from Library */}
                    <button
                      type="button"
                      onClick={() => { 
                        addToast({ title: 'Library', description: 'Select a saved file from your Nexorbit Library', type: 'info' }); 
                        handleSelectMode('library');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2F2F2F] transition-colors text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9]"
                    >
                      <div className="flex items-center justify-center shrink-0 text-[#C5C5D2] group-hover:text-white transition-colors">
                        <Library className="h-5 w-5 stroke-[2]" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[14px] font-medium text-[#ECECF1] group-hover:text-white truncate transition-colors">
                          Add from Library
                        </span>
                        <span className="text-[12px] text-[#8E8EA0] truncate">
                          Browse files and workspace items
                        </span>
                      </div>
                    </button>

                    {/* 3. Create image */}
                    <button
                      type="button"
                      onClick={() => handleSelectMode('image')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2F2F2F] transition-colors text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9]"
                    >
                      <div className="flex items-center justify-center shrink-0 text-[#C5C5D2] group-hover:text-white transition-colors">
                        <ImageIcon className="h-5 w-5 stroke-[2]" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[14px] font-medium text-[#ECECF1] group-hover:text-white truncate transition-colors">
                          Create image
                        </span>
                        <span className="text-[12px] text-[#8E8EA0] truncate">
                          Generate visual concepts and art
                        </span>
                      </div>
                    </button>

                    {/* 4. Web search */}
                    <button
                      type="button"
                      onClick={() => handleSelectMode('search')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2F2F2F] transition-colors text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9]"
                    >
                      <div className="flex items-center justify-center shrink-0 text-[#C5C5D2] group-hover:text-white transition-colors">
                        <Search className="h-5 w-5 stroke-[2]" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[14px] font-medium text-[#ECECF1] group-hover:text-white truncate transition-colors">
                          Web search
                        </span>
                        <span className="text-[12px] text-[#8E8EA0] truncate">
                          Search live web for real-time answers
                        </span>
                      </div>
                      {webSearchEnabled && <CheckCircle2 className="h-4.5 w-4.5 text-[#5486E9] ml-auto shrink-0" />}
                    </button>

                    {/* 5. Connectors (Only connected services) */}
                    {activePlugins.length > 0 && (
                      <>
                        <div className="h-[1px] bg-white/10 my-1 mx-2" />
                        <div className="px-3 py-1.5 text-[11px] font-medium text-[#8E8EA0] uppercase tracking-wider">
                          Connectors
                        </div>
                        {activePlugins.map(plugin => {
                          const isSelected = selectedConnectors.has(plugin.id);
                          return (
                            <button
                              key={plugin.id}
                              type="button"
                              onClick={() => handleToggleConnector(plugin.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2F2F2F] transition-colors text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5486E9]"
                            >
                              <div className="flex items-center justify-center shrink-0 text-[#C5C5D2] group-hover:text-white transition-colors">
                                {getConnectorIcon(plugin.id, "h-5 w-5")}
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[14px] font-medium text-[#ECECF1] group-hover:text-white truncate transition-colors">
                                  {plugin.name}
                                </span>
                                <span className="text-[12px] text-[#8E8EA0] truncate">
                                  {plugin.accountEmail || 'Connected'}
                                </span>
                              </div>
                              {isSelected && <CheckCircle2 className="h-4.5 w-4.5 text-[#5486E9] ml-auto shrink-0" />}
                            </button>
                          );
                        })}
                      </>
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* SELECTED TOOL INDICATOR */}
            {activeMode !== 'normal' ? (
              <div 
                id="selected-tool-indicator"
                className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-[#ECECF1] px-2.5 py-1.5 rounded-xl border border-white/5 shadow-inner text-xs select-none shrink-0 mb-0.5 transition-colors"
              >
                <div className="text-white shrink-0">
                  {activeMode === 'search' && <Search className="h-4 w-4 stroke-[2]" />}
                  {activeMode === 'image' && <ImageIcon className="h-4 w-4 stroke-[2]" />}
                  {activeMode === 'library' && <Library className="h-4 w-4 stroke-[2]" />}
                  {activeMode === 'connectors' && <Settings className="h-4 w-4 stroke-[2]" />}
                </div>
                
                <span className="font-medium text-[13px] text-[#ECECF1] whitespace-nowrap">
                  {activeMode === 'search' && 'Web search'}
                  {activeMode === 'image' && 'Create image'}
                  {activeMode === 'library' && 'Library'}
                  {activeMode === 'connectors' && 'Connectors'}
                </span>
                
                <span className="text-white/15 mx-0.5 font-light">|</span>
                
                <button
                  type="button"
                  onClick={handleClearMode}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 -mr-1 rounded-md hover:bg-white/5"
                  aria-label="Remove mode"
                  title="Remove mode"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : attachments.length > 0 ? (
              <div 
                id="selected-files-indicator"
                className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-[#ECECF1] px-2.5 py-1.5 rounded-xl border border-white/5 shadow-inner text-xs select-none shrink-0 mb-0.5 transition-colors"
              >
                <Paperclip className="h-4 w-4 text-white stroke-[2]" />
                <span className="font-medium text-[13px] text-[#ECECF1] whitespace-nowrap">Files</span>
                <span className="text-white/15 mx-0.5 font-light">|</span>
                <button
                  type="button"
                  onClick={() => {
                    if (attachments.length > 0 && onRemoveAttachment) {
                      attachments.forEach(file => onRemoveAttachment(file.id));
                    }
                  }}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer p-0.5 -mr-1 rounded-md hover:bg-white/5"
                  aria-label="Clear files"
                  title="Clear files"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}

            {/* EXPANDABLE INPUT TEXTAREA */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => onChangeText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activePlaceholder}
              rows={1}
              disabled={isThinking}
              className="flex-1 bg-transparent resize-none border-none outline-none text-[15px] sm:text-[16px] text-[#ECECF1] placeholder:text-[#8E8EA0] min-h-[38px] max-h-[200px] py-1.5 px-2 leading-relaxed font-sans"
            />
            
            {/* MICROPHONE & SUBMIT / STOP CONTROLS */}
            <div className="flex items-center gap-1.5 shrink-0 mb-0.5">
              <button
                type="button"
                className="h-9 w-9 rounded-full text-[#8E8EA0] hover:text-[#ECECF1] hover:bg-white/[0.08] flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                aria-label="Voice input"
                title="Voice input"
              >
                <Mic className="h-4.5 w-4.5 stroke-[2]" />
              </button>
              
              {isThinking ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="h-9 w-9 rounded-full bg-white text-black hover:bg-[#ECECF1] active:scale-95 flex items-center justify-center transition-all duration-150 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                  aria-label="Stop generating"
                  title="Stop generating"
                >
                  <Square className="h-3.5 w-3.5 fill-black text-black" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!hasContent}
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
                    hasContent 
                      ? "bg-white text-black hover:bg-[#ECECF1] active:scale-95 cursor-pointer" 
                      : "bg-[#2F3037]/60 text-[#676767] cursor-not-allowed"
                  )}
                  aria-label="Send message"
                  title="Send message"
                >
                  <ArrowUp className="h-4.5 w-4.5 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
      </form>
    </div>
  );
};

