'use client';

import React, { useState } from 'react';
import { ChatComposer } from '../chat/ChatComposer';

export interface HomeDashboardProps {
  onNavigate: (pageId: string) => void;
  onOpenConnector?: (id: string) => void;
  onOpenMobileMenu?: () => void;
}

// Curated short, confident, work-oriented headlines
const WORK_HEADLINES = [
  'Where would you like to begin?',
  'Ready when you are.',
  'What are we working on?',
  "Let's make progress.",
  'Focus on what matters next.',
  'Plan, analyze, or create.',
  'Turn thoughts into execution.',
  'What needs your attention today?',
  'Clear your backlog.',
  'Coordinate your next move.',
  'Draft, research, or synthesize.',
  'Bring your work together.'
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
}) => {
  const [commandText, setCommandText] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  // Rotates deterministically approximately every 5 hours
  const [activeHeadline] = useState(() => {
    const fiveHoursInMs = 5 * 60 * 60 * 1000;
    const timeIndex = Math.floor(Date.now() / fiveHoursInMs);
    return WORK_HEADLINES[timeIndex % WORK_HEADLINES.length];
  });

  // Submit prompt to real Chat session
  const handleSubmit = (e?: React.FormEvent, attachments?: any[], useWebSearch?: boolean) => {
    if (e) e.preventDefault();
    const clean = commandText.trim();
    if (!clean) return;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_ask_command', clean);
      if (useWebSearch || webSearchEnabled) {
        sessionStorage.setItem('pending_web_search', 'true');
      }
    }

    onNavigate('chat');
  };

  // Submit manual image creation from Home composer
  const handleGenerateImage = (prompt: string, options: { style?: string; aspectRatio?: string }) => {
    const clean = prompt.trim();
    if (!clean) return;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_ask_command', clean);
      if (options.style && options.style !== 'None') {
        sessionStorage.setItem('pending_image_style', options.style);
      }
      if (options.aspectRatio) {
        sessionStorage.setItem('pending_image_ratio', options.aspectRatio);
      }
    }

    onNavigate('chat');
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full flex flex-col justify-center select-none overflow-x-hidden bg-[#000000] text-[#ECECF1]">
      {/* BACKGROUND AESTHETICS (Subtle cosmic orbital art) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle background star dust */}
        <div className="absolute top-1/4 left-1/3 h-1 w-1 rounded-full bg-[#5486E9]/30 blur-[0.5px]" />
        <div className="absolute top-1/6 right-1/4 h-1 w-1 rounded-full bg-[#C5C5D2]/20 blur-[0.5px]" />
        <div className="absolute bottom-1/3 left-1/5 h-1.5 w-1.5 rounded-full bg-[#5486E9]/15 blur-[1px]" />

        {/* Orbital Ellipses at bottom right */}
        <div className="absolute -bottom-24 -right-24 w-[640px] h-[340px] opacity-25">
          {/* Outer Ellipse */}
          <div className="absolute inset-0 rounded-[100%] border border-[#5486E9]/20 transform -rotate-12" />
          {/* Inner Ellipse */}
          <div className="absolute inset-8 rounded-[100%] border border-[#5486E9]/10 transform -rotate-12" />
          {/* Center glow orb */}
          <div className="absolute top-12 right-20 h-4 w-4 rounded-full bg-[#5486E9] shadow-[0_0_20px_4px_rgba(84,134,233,0.4)]" />
          <div className="absolute bottom-10 left-16 h-2 w-2 rounded-full bg-[#5486E9] shadow-[0_0_8px_2px_rgba(84,134,233,0.3)]" />
        </div>
      </div>

      {/* MAIN CENTER HERO CANVAS */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[860px] mx-auto px-4 py-8 sm:py-16">
        {/* 1. HERO TITLE */}
        <div className="text-center mb-8 sm:mb-10 animate-in fade-in duration-300">
          <h1 className="text-3xl sm:text-4xl md:text-[46px] font-semibold tracking-tight text-[#ECECF1] font-sans leading-[1.14]">
            {activeHeadline}
          </h1>
        </div>

        {/* 2. COMMAND COMPOSER */}
        <div className="w-full relative z-10 transition-all duration-150 ease-out">
          <ChatComposer
            inputText={commandText}
            onChangeText={setCommandText}
            onSubmit={handleSubmit}
            onGenerateImage={handleGenerateImage}
            webSearchEnabled={webSearchEnabled}
            onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
            placeholder="Ask anything"
          />
        </div>
      </div>
    </div>
  );
};

