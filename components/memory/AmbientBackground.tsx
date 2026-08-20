'use client';

import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Soft lavender/purple subtle ambient radial glow in upper center/right */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[500px] bg-gradient-to-b from-indigo-100/35 via-purple-50/20 to-transparent rounded-full blur-3xl opacity-60 animate-pulse duration-10000" />
      <div className="absolute top-1/3 -left-32 w-[500px] h-[450px] bg-gradient-to-r from-purple-100/20 via-indigo-50/15 to-transparent rounded-full blur-3xl opacity-40" />

      {/* SVG delicate orbital lines and constellation nodes */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 text-indigo-300/40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="orbital-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Orbit Curve 1 */}
        <path
          d="M -100,200 Q 450,-50 900,300 T 1800,100"
          fill="none"
          stroke="url(#orbital-line-grad)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Orbit Curve 2 */}
        <path
          d="M 200,800 Q 800,350 1400,650 T 2200,400"
          fill="none"
          stroke="url(#orbital-line-grad)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        {/* Subtle Synaptic Connection Nodes */}
        <circle cx="680" cy="310" r="2.5" fill="#A78BFA" opacity="0.4" />
        <circle cx="890" cy="300" r="2" fill="#818CF8" opacity="0.3" />
        <circle cx="1120" cy="480" r="2.5" fill="#C084FC" opacity="0.35" />
        <line x1="680" y1="310" x2="890" y2="300" stroke="#C084FC" strokeWidth="0.5" opacity="0.2" />
        <line x1="890" y1="300" x2="1120" y2="480" stroke="#818CF8" strokeWidth="0.5" opacity="0.15" />
      </svg>
    </div>
  );
};
