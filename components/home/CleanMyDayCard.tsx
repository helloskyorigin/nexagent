'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CleanMyDayCardProps {
  onNavigate: () => void;
  className?: string;
}

export const CleanMyDayCard: React.FC<CleanMyDayCardProps> = ({
  onNavigate,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-950 tracking-tight">
          Need a clearer day?
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Let Nexorbit decide what matters.
        </p>
      </div>

      {/* Luminous Glowing Celestial Orb Vector Graphic */}
      <div className="relative my-2 sm:my-3 h-28 sm:h-32 flex items-center justify-center select-none pointer-events-none">
        {/* Soft Ambient Radial Blur Halo */}
        <div className="absolute w-24 h-24 rounded-full bg-blue-400/20 blur-xl" />

        <svg viewBox="0 0 200 130" className="w-full h-full max-w-[190px]">
          <defs>
            <radialGradient id="cmdSphereGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="40%" stopColor="#3b82f6" />
              <stop offset="85%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>

            <linearGradient id="cmdRingGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="cmdRingGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Background Outer Orbital Ellipses */}
          <ellipse
            cx="100"
            cy="65"
            rx="85"
            ry="24"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="0.75"
            strokeDasharray="2 3"
            transform="rotate(-15 100 65)"
          />

          {/* Back Half of Primary Orbit Ring */}
          <path
            d="M 32 83 A 72 20 0 0 1 168 47"
            fill="none"
            stroke="url(#cmdRingGradBack)"
            strokeWidth="2.5"
            transform="rotate(-18 100 65)"
          />

          {/* Central Blue Sphere */}
          <circle cx="100" cy="65" r="22" fill="url(#cmdSphereGrad)" filter="drop-shadow(0 4px 12px rgba(37,99,235,0.35))" />

          {/* Specular Highlight on Sphere */}
          <ellipse
            cx="94"
            cy="56"
            rx="6.5"
            ry="3.5"
            fill="#ffffff"
            fillOpacity="0.6"
            transform="rotate(-25 94 56)"
          />

          {/* Front Half of Primary Orbit Ring */}
          <path
            d="M 168 47 A 72 20 0 0 1 32 83"
            fill="none"
            stroke="url(#cmdRingGradFront)"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform="rotate(-18 100 65)"
          />

          {/* Small Orbiting Node */}
          <circle cx="148" cy="46" r="3" fill="#60a5fa" filter="drop-shadow(0 0 4px #3b82f6)" />
        </svg>
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onNavigate}
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[13.5px] py-2.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
      >
        <span>Clean My Day</span>
        <span className="text-sm">→</span>
      </button>
    </div>
  );
};
