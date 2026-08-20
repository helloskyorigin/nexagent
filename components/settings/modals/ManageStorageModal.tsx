'use client';

import React from 'react';
import { Modal } from '../../ui/Modal';
import { HardDrive, Database, FileText, RefreshCw } from 'lucide-react';
import { useToast } from '../../ui/Toast';

export interface ManageStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageStorageModal: React.FC<ManageStorageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();

  const handleClearCache = () => {
    addToast({
      type: 'success',
      title: 'Temporary Caches Cleared',
      description: 'Freed up 420 MB of ephemeral index caches.',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Storage Breakdown"
      description="Overview of vector context, connected app caches, and file storage"
      maxWidth="md"
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Usage Overview */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
          <div className="flex justify-between items-center text-slate-900 font-bold">
            <span>Overall Storage</span>
            <span>2.4 GB / 10 GB</span>
          </div>
          <div className="w-full h-2 rounded-full bg-blue-200/60 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '24%' }} />
          </div>
          <p className="text-[11px] text-slate-500">24% of your Free Plan allocation is used.</p>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Database className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-bold text-slate-800">Vector Embeddings</div>
                <div className="text-[10px] text-slate-400">Semantic memory nodes</div>
              </div>
            </div>
            <span className="font-mono font-bold text-slate-700">1.2 GB</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-bold text-slate-800">Synced Document Caches</div>
                <div className="text-[10px] text-slate-400">Google Drive & Notion previews</div>
              </div>
            </div>
            <span className="font-mono font-bold text-slate-700">0.8 GB</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <HardDrive className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-bold text-slate-800">Local Ephemeral Caches</div>
                <div className="text-[10px] text-slate-400">Search indexes & temporary files</div>
              </div>
            </div>
            <span className="font-mono font-bold text-slate-700">0.4 GB</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span>Clear Ephemeral Caches</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
