'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyConnectStateProps {
  onConnectGoogle: () => void;
  onExploreApps: () => void;
}

export const EmptyConnectState: React.FC<EmptyConnectStateProps> = ({
  onConnectGoogle,
  onExploreApps,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 max-w-2xl mx-auto">
      <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
        <Sparkles className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">
          No apps connected yet
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Connect your Google Workspace or developer platforms so Nexorbit can index your communications, files, and schedule to build your personal AI Brain.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          onClick={onConnectGoogle}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-10 px-5 rounded-xl cursor-pointer"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Connect Google Workspace
        </Button>
        <Button
          variant="secondary"
          onClick={onExploreApps}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs h-10 px-5 rounded-xl cursor-pointer"
        >
          Explore All Integrations
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-3 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Enterprise-grade TLS encryption and zero third-party data sharing.</span>
      </div>
    </div>
  );
};
