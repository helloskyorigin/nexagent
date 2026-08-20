'use client';

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface SecurityCardProps {
  onLearnMore: () => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({ onLearnMore }) => {
  return (
    <div className="w-full bg-[#121520]/80 border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs backdrop-blur-xs">
      <div className="flex items-center gap-3.5">
        <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 shadow-inner">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          Your data is private and secure. Nexorbit only accesses data you explicitly authorize.
        </p>
      </div>

      <button
        type="button"
        onClick={onLearnMore}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer self-start sm:self-auto flex-shrink-0 group"
      >
        <span>Security & Privacy</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
};
