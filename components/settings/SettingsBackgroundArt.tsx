'use client';

import React from 'react';

export const SettingsBackgroundArt: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <svg
        className="w-full h-full opacity-40 dark:opacity-20 transition-opacity duration-500 animate-orbit-slow"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="orbitGrad1" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Primary Elliptical Orbital Arch across the header & settings area */}
        <path
          d="M200 -50 C 450 180, 850 160, 1180 -20"
          stroke="url(#orbitGrad1)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />

        <path
          d="M320 -100 C 600 240, 1000 210, 1350 40"
          stroke="url(#orbitGrad2)"
          strokeWidth="1.5"
        />

        {/* Subtle Constellation Nodes */}
        <circle cx="580" cy="145" r="2.5" fill="#818cf8" filter="url(#glow)" />
        <circle cx="820" cy="130" r="2" fill="#c084fc" />
        <circle cx="980" cy="95" r="3" fill="#6366f1" filter="url(#glow)" />

        {/* Lower gentle planetary sweep */}
        <path
          d="M-50 650 C 350 500, 950 780, 1490 620"
          stroke="url(#orbitGrad1)"
          strokeWidth="1"
          strokeDasharray="3 8"
        />
        <circle cx="420" cy="540" r="1.5" fill="#818cf8" />
        <circle cx="1120" cy="690" r="2" fill="#a855f7" />
      </svg>
    </div>
  );
};
