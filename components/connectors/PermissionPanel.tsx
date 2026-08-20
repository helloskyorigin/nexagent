'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { Shield, Eye, Lock, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PermissionPanelProps {
  connector: ConnectorItem;
  className?: string;
}

export const PermissionPanel: React.FC<PermissionPanelProps> = ({ connector, className }) => {
  return (
    <div className={cn('space-y-4 text-xs', className)}>
      {/* Access */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Eye className="h-3.5 w-3.5 text-indigo-600" />
          <span>Data Accessed</span>
        </div>
        <ul className="space-y-1 text-slate-600 pl-5 list-disc">
          {connector.permissions.access.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Use */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
          <span>How It&apos;s Used</span>
        </div>
        <ul className="space-y-1 text-slate-600 pl-5 list-disc">
          {connector.permissions.use.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Control */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Lock className="h-3.5 w-3.5 text-blue-600" />
          <span>User Control &amp; Revocation</span>
        </div>
        <ul className="space-y-1 text-slate-600 pl-5 list-disc">
          {connector.permissions.control.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
