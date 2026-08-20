'use client';

import React, { useState } from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { ConnectorStatus } from './ConnectorStatus';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RefreshCw, Shield, Trash2, Clock, CheckCircle2, ShieldCheck, Mail, ExternalLink } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface ConnectorDetailProps {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSyncNow: (connectorId: string) => void;
  onRequestDisconnect: (connector: ConnectorItem) => void;
  onOpenExplorer?: (connector: ConnectorItem) => void;
}

export const ConnectorDetail: React.FC<ConnectorDetailProps> = ({
  connector,
  isOpen,
  onClose,
  onSyncNow,
  onRequestDisconnect,
  onOpenExplorer,
}) => {
  const { addToast } = useToast();
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);

  if (!connector) return null;

  const isGmail = connector.id === 'gmail';
  const isConnected = connector.status === 'connected' || connector.status === 'up_to_date';

  const handleSyncClick = () => {
    setIsSyncingLocal(true);
    setTimeout(() => {
      setIsSyncingLocal(false);
      onSyncNow(connector.id);
      addToast({
        type: 'success',
        title: `${connector.name} Synced`,
        description: `Successfully resynced ${connector.name} context.`,
      });
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={connector.name}
      description="Manage Connection & Scope"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRequestDisconnect(connector)}
            leftIcon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />}
            className="text-rose-700 hover:bg-rose-50 border-rose-200 text-xs font-semibold h-8.5 rounded-xl cursor-pointer"
          >
            Disconnect
          </Button>

          <div className="flex items-center gap-2">
            {isGmail && isConnected && onOpenExplorer && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenExplorer(connector);
                }}
                leftIcon={<Mail className="h-3.5 w-3.5" />}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8.5 rounded-xl cursor-pointer"
              >
                Browse Emails
              </Button>
            )}

            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-medium cursor-pointer">
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-slate-800">
        {/* Connection Header Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                <ConnectorIcon id={connector.id} size="lg" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">{connector.name}</h3>
                <p className="text-xs text-slate-500 font-normal">{connector.category}</p>
              </div>
            </div>

            <div className="shrink-0">
              <ConnectorStatus status={connector.status} customLabel={connector.statusLabel} />
            </div>
          </div>

          {/* Special Gmail live viewer CTA */}
          {isGmail && isConnected && onOpenExplorer && (
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-600 font-medium">Live Read-Only Messages Explorer</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenExplorer(connector);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Explorer</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* HUMAN-READABLE PERMISSION SCOPE */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
            Approved Access Scope
          </span>
          <div className="p-3.5 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-2">
            <div className="flex items-start gap-2 text-slate-900 font-semibold text-xs">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{connector.humanPermissionSummary}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
              Nexorbit only accesses data relevant to your daily focus and query answers.
            </p>
          </div>
        </div>

        {/* LAST SYNC STATUS & ACTION */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sync Status</span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {isSyncingLocal ? 'Syncing now...' : connector.lastSynced || 'Synced just now'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncClick}
            disabled={isSyncingLocal}
            leftIcon={<RefreshCw className={cn('h-3.5 w-3.5', isSyncingLocal && 'animate-spin text-blue-600')} />}
            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-800 text-xs font-semibold h-8.5 rounded-xl shrink-0 cursor-pointer"
          >
            {isSyncingLocal ? 'Syncing...' : 'Sync now'}
          </Button>
        </div>

        {/* DETAILED PERMISSION LIST */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
            Usage Breakdown
          </span>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            {connector.uses.map((useItem, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-700 font-medium text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{useItem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
