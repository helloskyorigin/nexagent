'use client';

import React from 'react';
import { Shield, RefreshCw, Sliders, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AboutConnectedAppsCardProps {
  onLearnMorePrivacy?: () => void;
  className?: string;
}

export const AboutConnectedAppsCard: React.FC<AboutConnectedAppsCardProps> = ({
  onLearnMorePrivacy,
  className,
}) => {
  return (
    <div className={cn('p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5', className)}>
      <div>
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-sans">
          About Connected Apps
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
          Nexorbit securely connects to your tools to synthesize context without storing raw passwords.
        </p>
      </div>

      <div className="space-y-2.5 pt-1">
        <div className="flex items-start gap-2.5">
          <Shield className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-slate-800">Secure by design: </span>
            <span className="text-slate-500 font-normal">Encrypted in transit & at rest.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <RefreshCw className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-slate-800">Real-time sync: </span>
            <span className="text-slate-500 font-normal">Keeps your workspace memory up to date.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Sliders className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-slate-800">You&apos;re in control: </span>
            <span className="text-slate-500 font-normal">Manage or disconnect access anytime.</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onLearnMorePrivacy}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Learn more about privacy</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

