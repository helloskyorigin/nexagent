'use client';

import React from 'react';
import { X, Lock, Sliders, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type IntegrationStatus = 'not_connected' | 'connected' | 'needs_attention';

export interface ServiceIntegrationItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: IntegrationStatus;
}

export interface ConnectModalProps {
  isOpen: boolean;
  service: ServiceIntegrationItem | null;
  onClose: () => void;
  onToggleStatus?: (serviceId: string, nextStatus: IntegrationStatus) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  service,
  onClose,
  onToggleStatus,
}) => {
  if (!isOpen || !service) return null;

  const Icon = service.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#15181D] border border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Connect {service.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {service.name} integration will be available when workspace connections are enabled.
            </p>
          </div>
        </div>

        {/* Integration Scope Box */}
        <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-blue-400" />
            <span>Planned Scope</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Developer-only Preview State Mechanism for UI Testing */}
        {onToggleStatus && (
          <div className="p-3 rounded-xl bg-[#0D0F12]/80 border border-dashed border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sliders className="h-3 w-3" /> Dev UI Preview Switch
              </span>
              <span>Local State Only</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onToggleStatus(service.id, 'not_connected')}
                className={cn(
                  'px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer',
                  service.status === 'not_connected'
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
                )}
              >
                Not Connected
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(service.id, 'connected')}
                className={cn(
                  'px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer',
                  service.status === 'connected'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
                )}
              >
                Connected
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(service.id, 'needs_attention')}
                className={cn(
                  'px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer',
                  service.status === 'needs_attention'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-transparent text-slate-500 border-slate-800 hover:text-slate-300'
                )}
              >
                Attention
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Coming soon
          </button>
        </div>
      </div>
    </div>
  );
};
