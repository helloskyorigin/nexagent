'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Image from 'next/image';

export interface ImageStyleOption {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export const IMAGE_STYLES: ImageStyleOption[] = [
  {
    id: 'Photorealistic',
    name: 'Photorealistic',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    description: 'Realistic camera shot with natural lighting',
  },
  {
    id: 'Cinematic',
    name: 'Cinematic',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop&q=80',
    description: 'Moody film atmosphere and dramatic lighting',
  },
  {
    id: 'Digital Art',
    name: 'Digital Art',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    description: 'Vibrant modern digital illustration',
  },
  {
    id: 'Anime',
    name: 'Anime',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
    description: 'Stylized Japanese animation aesthetic',
  },
  {
    id: '3D',
    name: '3D Render',
    thumbnail: 'https://images.unsplash.com/photo-1633493106185-11e5593883b3?w=200&auto=format&fit=crop&q=80',
    description: 'Smooth 3D clay and volumetric render',
  },
  {
    id: 'Watercolor',
    name: 'Watercolor',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
    description: 'Delicate hand-painted watercolor textures',
  },
  {
    id: 'Oil Painting',
    name: 'Oil Painting',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80',
    description: 'Classic painterly impasto brushwork',
  },
];

export interface AspectRatioOption {
  id: string;
  label: string;
  name: string;
  widthRatio: number;
  heightRatio: number;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: '1:1',
    label: '1:1',
    name: 'Square',
    widthRatio: 1,
    heightRatio: 1,
  },
  {
    id: '16:9',
    label: '16:9',
    name: 'Landscape',
    widthRatio: 16,
    heightRatio: 9,
  },
  {
    id: '9:16',
    label: '9:16',
    name: 'Portrait',
    widthRatio: 9,
    heightRatio: 16,
  },
];

export interface ImageGenerationPanelProps {
  initialPrompt?: string;
  initialStyle?: string;
  initialAspectRatio?: string;
  onGenerate: (prompt: string, options: { style: string; aspectRatio: string }) => void;
  onClose: () => void;
  isGenerating?: boolean;
  className?: string;
}

export const ImageGenerationPanel: React.FC<ImageGenerationPanelProps> = ({
  initialPrompt = '',
  initialStyle = 'Photorealistic',
  initialAspectRatio = '1:1',
  onGenerate,
  onClose,
  isGenerating = false,
  className,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [selectedRatio, setSelectedRatio] = useState(initialAspectRatio);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt.trim(), {
      style: selectedStyle,
      aspectRatio: selectedRatio,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <div className={cn('w-full space-y-4 animate-in fade-in duration-200 select-none text-slate-100', className)}>
      {/* Header with Title and Close Button */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ImageIcon className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">Create Image</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isGenerating}
          className="h-7 w-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close image panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Prompt Text Input */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
          Prompt
        </label>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          rows={2}
          placeholder="Describe the image you want to create in detail..."
          className="w-full bg-[#0D0F12] rounded-xl border border-slate-800/90 focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 p-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none resize-none min-h-[72px] sm:min-h-[80px] transition-all leading-relaxed"
        />
      </div>

      {/* 1. VISUAL STYLE SELECTOR */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pl-0.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Style
          </label>
          <span className="text-[11px] text-blue-400 font-medium">{selectedStyle}</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-none no-scrollbar -mx-1 px-1">
          {IMAGE_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.id)}
                disabled={isGenerating}
                className={cn(
                  'group relative shrink-0 w-[84px] sm:w-[92px] rounded-xl overflow-hidden border text-left transition-all duration-150 cursor-pointer disabled:opacity-50',
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-[#121824] shadow-md shadow-blue-900/20'
                    : 'border-slate-800 bg-[#0D0F12] hover:border-slate-700 opacity-80 hover:opacity-100'
                )}
              >
                {/* Thumbnail Image Container */}
                <div className="relative w-full h-[52px] sm:h-[56px] overflow-hidden bg-slate-900">
                  <Image
                    src={style.thumbnail}
                    alt={style.name}
                    fill
                    sizes="(max-width: 640px) 84px, 92px"
                    className={cn(
                      'object-cover transition-transform duration-300 group-hover:scale-105',
                      isSelected ? 'scale-105' : 'filter grayscale-[20%]'
                    )}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F12] via-transparent to-transparent opacity-80" />

                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Style Label */}
                <div className="p-1.5 text-center">
                  <span
                    className={cn(
                      'block text-[11px] font-medium truncate leading-tight',
                      isSelected ? 'text-blue-400 font-semibold' : 'text-slate-300 group-hover:text-white'
                    )}
                  >
                    {style.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. VISUAL ASPECT RATIO SELECTOR & GENERATE ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 border-t border-slate-800/80">
        {/* Aspect Ratio Options */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
            Aspect Ratio
          </label>

          <div className="flex items-center gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = selectedRatio === ratio.id;
              return (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setSelectedRatio(ratio.id)}
                  disabled={isGenerating}
                  className={cn(
                    'h-8.5 px-3 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all cursor-pointer disabled:opacity-50',
                    isSelected
                      ? 'border-blue-500 bg-blue-600/15 text-blue-400 font-semibold shadow-xs ring-1 ring-blue-500/30'
                      : 'border-slate-800 bg-[#0D0F12] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  )}
                >
                  {/* Visual Frame Box Preview */}
                  <div className="flex items-center justify-center h-4 w-4 shrink-0">
                    {ratio.id === '1:1' && (
                      <div
                        className={cn(
                          'w-3.5 h-3.5 rounded-[2px] border transition-colors',
                          isSelected ? 'border-blue-400 bg-blue-500/30' : 'border-slate-500'
                        )}
                      />
                    )}
                    {ratio.id === '16:9' && (
                      <div
                        className={cn(
                          'w-4 h-2.5 rounded-[2px] border transition-colors',
                          isSelected ? 'border-blue-400 bg-blue-500/30' : 'border-slate-500'
                        )}
                      />
                    )}
                    {ratio.id === '9:16' && (
                      <div
                        className={cn(
                          'w-2.5 h-4 rounded-[2px] border transition-colors',
                          isSelected ? 'border-blue-400 bg-blue-500/30' : 'border-slate-500'
                        )}
                      />
                    )}
                  </div>

                  <span>{ratio.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="flex items-center justify-end sm:justify-start gap-2 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="h-9 px-3.5 rounded-xl border border-slate-800 bg-[#0D0F12] hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 sm:inline-flex hidden"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={!prompt.trim() || isGenerating}
            className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-40 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer min-w-[110px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
