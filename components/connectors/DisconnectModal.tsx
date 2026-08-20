'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { ConnectorIcon } from './ConnectorIcon';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface DisconnectModalProps {
  connector: ConnectorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisconnect: (connectorId: string) => void;
}

export const DisconnectModal: React.FC<DisconnectModalProps> = ({
  connector,
  isOpen,
  onClose,
  onConfirmDisconnect,
}) => {
  const { addToast } = useToast();

  if (!connector) return null;

  const handleDisconnect = () => {
    onConfirmDisconnect(connector.id);
    addToast({
      type: 'info',
      title: `${connector.name} Disconnected`,
      description: `Nexorbit will no longer use your ${connector.name} connection.`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Disconnect ${connector.name}?`}
      description="Disconnect App Authorization"
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs text-slate-700">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="p-2 bg-white rounded-xl border border-slate-200 shrink-0 shadow-2xs">
            <ConnectorIcon id={connector.id} size="md" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-sm">{connector.name}</span>
            <span className="text-[11px] text-slate-500 font-normal">Active Connection</span>
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <p className="font-semibold text-slate-900 text-xs">
            Nexorbit will no longer use this connection.
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
            Your synced context memory for {connector.name} will be unlinked. You can reconnect at any time.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-medium cursor-pointer">
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 font-semibold text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Disconnect
          </Button>
        </div>
      </div>
    </Modal>
  );
};
