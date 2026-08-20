'use client';

import React from 'react';

export const BackgroundAtmosphere: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Soft Ambient Radial Gradient Bleed */}
      <div
        className="absolute -top-10 right-0 w-[550px] sm:w-[750px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-bl from-blue-100/40 via-indigo-50/30 to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* SVG Celestial Orbital Vector Curves & Floating Nodes */}
      <svg
        viewBox="0 0 1200 700"
        className="absolute top-0 right-0 w-full max-w-[1100px] h-[550px] object-cover opacity-80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.05" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#93c5fd" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="dashedLineGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.03" />
          </linearGradient>

          <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Outer Wide Orbital Ellipse */}
        <ellipse
          cx="920"
          cy="210"
          rx="460"
          ry="170"
          fill="none"
          stroke="url(#orbitLineGrad)"
          strokeWidth="1.2"
          transform="rotate(-16 920 210)"
        />

        {/* Counter Orbiting Dashed Arc */}
        <ellipse
          cx="950"
          cy="230"
          rx="380"
          ry="130"
          fill="none"
          stroke="url(#dashedLineGrad)"
          strokeWidth="1"
          strokeDasharray="4 6"
          transform="rotate(22 950 230)"
        />

        {/* Ambient Orbiting Nodes & Sparkles */}
        <circle cx="730" cy="180" r="3.5" fill="#3b82f6" fillOpacity="0.7" />
        <circle cx="860" cy="90" r="4.5" fill="#60a5fa" fillOpacity="0.5" />
        <circle cx="1060" cy="310" r="3" fill="#818cf8" fillOpacity="0.6" />

        {/* Tiny Diamond Sparkle ✦ nodes */}
        <g transform="translate(750, 140) scale(0.75)" opacity="0.65">
          <path d="M 0,-8 L 3,0 L 0,8 L -3,0 Z" fill="#60a5fa" />
          <path d="M -8,0 L 0,3 L 8,0 L 0,-3 Z" fill="#60a5fa" />
        </g>
        <g transform="translate(1010, 160) scale(0.6)" opacity="0.5">
          <path d="M 0,-8 L 3,0 L 0,8 L -3,0 Z" fill="#818cf8" />
          <path d="M -8,0 L 0,3 L 8,0 L 0,-3 Z" fill="#818cf8" />
        </g>

        {/* Faint Glowing 3D Sphere with Tilted Ring in Ambient Upper Right */}
        <g transform="translate(930, 200)">
          {/* Subtle Outer Glow */}
          <circle cx="0" cy="0" r="46" fill="#60a5fa" fillOpacity="0.12" filter="blur(14px)" />
          
          {/* Back half of ring */}
          <ellipse
            cx="0"
            cy="0"
            rx="52"
            ry="18"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.8"
            strokeOpacity="0.4"
            transform="rotate(-24)"
          />

          {/* Sphere Body */}
          <circle cx="0" cy="0" r="26" fill="url(#sphereGrad)" />

          {/* Front half of ring */}
          <path
            d="M -47 21 A 52 18 0 0 0 47 -21"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeOpacity="0.75"
            transform="rotate(-24)"
          />
        </g>
      </svg>
    </div>
  );
};
