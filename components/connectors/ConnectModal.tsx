'use client';

import React, { useState } from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Check, ShieldCheck, Lock, RefreshCw } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useAuth } from '../auth/AuthContext';

export interface ConnectModalProps {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmConnect: (connectorId: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  connector,
  isOpen,
  onClose,
  onConfirmConnect,
}) => {
  const { addToast } = useToast();
  const { user, getIdToken } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorState, setErrorState] = useState(false);

  if (!connector) return null;

  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorState(false);

    try {
      if (!user) {
        throw new Error('Please log in first.');
      }

      const idToken = await getIdToken();
      const res = await fetch(`/api/connectors/${connector.id}/connect`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to generate connection URL.');
      }

      const { url } = await res.json();

      // Open a popup for OAuth flow
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        url,
        `connect-${connector.id}`,
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for Nexorbit to complete the authentication.');
      }

      // Listen for popup callback message
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_CALLBACK' && event.data?.provider === connector.id) {
          window.removeEventListener('message', handleMessage);

          if (event.data.status === 'SUCCESS') {
            setIsConnecting(false);
            onConfirmConnect(connector.id);
            addToast({
              type: 'success',
              title: `${connector.name} Connected`,
              description: `Nexorbit now has secure server-side access to ${connector.name}.`,
            });
            onClose();
          } else {
            setIsConnecting(false);
            setErrorState(true);
            addToast({
              type: 'error',
              title: 'Connection Failed',
              description: event.data.error || 'The authentication flow failed.',
            });
          }
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (err: any) {
      console.error('OAuth connect error:', err);
      setIsConnecting(false);
      setErrorState(true);
      addToast({
        type: 'error',
        title: 'Connection Error',
        description: err.message || 'Could not launch connection.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Connect ${connector.name}`}
      description="Authorize Nexorbit AI Context Integration"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Lock className="h-3 w-3 text-emerald-600" />
            Secure server-side OAuth
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isConnecting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Authorizing...
                </>
              ) : (
                `Connect ${connector.name}`
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-slate-700">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
            <ConnectorIcon id={connector.id} size="md" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-sm">{connector.name}</h4>
            <p className="text-slate-500 text-xs font-normal">{connector.humanPermissionSummary}</p>
          </div>
        </div>

        {/* What Nexorbit will use */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">
            What Nexorbit will access:
          </span>
          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100/80 space-y-1.5">
            {connector.uses.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-800 font-medium">
                <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What Nexorbit will NOT do */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">
            What Nexorbit will never do:
          </span>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            {connector.wonts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust disclaimer */}
        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-[11px]">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>You can revoke permissions or disconnect this application at any time.</span>
        </div>
      </div>
    </Modal>
  );
};
