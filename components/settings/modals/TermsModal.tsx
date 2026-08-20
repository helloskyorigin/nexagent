'use client';

import React from 'react';
import { Modal } from '../../ui/Modal';
import { ShieldCheck, FileText } from 'lucide-react';

export interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service"
      description="Nexorbit Platform Conditions and Usage Terms"
      maxWidth="md"
    >
      <div className="space-y-4 pt-2 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <div className="p-3 rounded-xl bg-[#15181D] border border-slate-800 flex items-center gap-2.5">
          <FileText className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="font-semibold text-white">Nexorbit Terms of Service (v2.5)</span>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">1. Acceptance of Terms</h4>
          <p className="text-slate-400">
            By accessing or using Nexorbit, you agree to be bound by these Terms of Service. Nexorbit provides an AI-assisted cognitive operating workspace for productivity, agent orchestration, and context persistence.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">2. Use of AI Services</h4>
          <p className="text-slate-400">
            Nexorbit utilizes Google Gemini models and secure proxy infrastructure to process workspace prompts, generate insights, and automate tasks. You retain ownership of your submitted data.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white text-sm">3. Data Security & Privacy</h4>
          <p className="text-slate-400">
            We adhere to strict data boundaries. Your workspace data and credentials are encrypted and never used for public model training without explicit consent.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </Modal>
  );
};
