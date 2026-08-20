'use client';

import React, { useEffect, useState } from 'react';
import { NexorbitLogo } from '../NexorbitLogo';

const states = [
  {
    title: 'Signing you in...',
    subtitle: 'Securely connecting your account.',
  },
  {
    title: 'Preparing your workspace...',
    subtitle: 'Setting things up for you.',
  },
  {
    title: 'Almost there...',
    subtitle: 'Finishing your workspace.',
  },
];

export const AuthenticatingView: React.FC = () => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentState((prev) => (prev < states.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-8 space-y-8 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-slate-50 border border-slate-100 animate-[spin_4s_linear_infinite] shadow-[0_0_24px_rgba(0,0,0,0.02)]" />
          <div className="absolute -inset-2 rounded-full bg-slate-100/50 animate-pulse" />
          <NexorbitLogo variant="mark" size="xl" animated className="text-slate-900 relative z-10" />
        </div>
      </div>

      <div className="space-y-2 pt-4 relative h-[60px] overflow-hidden">
        {states.map((state, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 flex flex-col transition-all duration-700 ease-out ${
              idx === currentState
                ? 'opacity-100 translate-y-0'
                : idx < currentState
                ? 'opacity-0 -translate-y-4'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 className="text-xl font-semibold text-slate-950 tracking-tight">
              {state.title}
            </h2>
            <p className="text-[15px] text-slate-500 font-normal mt-1.5">
              {state.subtitle}
            </p>
          </div>
        ))}
      </div>
      
      {/* Elegant progress indicator */}
      <div className="w-48 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden relative mt-4">
        <div className="absolute top-0 bottom-0 left-0 bg-slate-900 rounded-full animate-[indeterminate_2s_infinite_ease-in-out]" style={{ width: '50%' }} />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
};
