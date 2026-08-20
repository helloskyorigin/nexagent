'use client';

import React from 'react';
import { Modal } from '../../ui/Modal';
import { Lock, ShieldCheck } from 'lucide-react';

export interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      description="How Nexorbit protects your workspace data and identity"
      maxWidth="md"
    >
      <div className="space-y-4 pt-2 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <div className="p-3 rounded-xl bg-[#15181D] border border-slate-800 flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white">Nexorbit Privacy Policy</span>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">1. Zero Model Training Guarantee</h4>
          <p className="text-slate-400">
            Your personal context, task records, and chat prompts are processed through enterprise API endpoints and are never used to train base foundation models.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">2. End-to-End Encryption & Memory Safety</h4>
          <p className="text-slate-400">
            Contextual memory vectors and stored brain embeddings are encrypted at rest and in transit. You have full controls to view, export, or purge your memory brain at any time.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">3. Third-Party Integrations</h4>
          <p className="text-slate-400">
            Connected app tokens (Gmail, Google Calendar, GitHub, Strava) are authenticated client-side via OAuth and used solely to perform authorized user actions.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
