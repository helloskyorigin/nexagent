'use client';

import React from 'react';
import { Modal } from '../../ui/Modal';
import { ShieldCheck, Key, Smartphone, Lock } from 'lucide-react';
import { useToast } from '../../ui/Toast';

export interface ManageSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageSecurityModal: React.FC<ManageSecurityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Security"
      description="Manage 2FA, session tokens, and security audits"
      maxWidth="md"
    >
      <div className="space-y-4 pt-2 text-xs">
        {/* Status Badge */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <div className="text-emerald-950 font-bold">Your Account is Secure</div>
            <div className="text-[11px] text-emerald-700 font-normal">
              No unauthorized access attempts or suspicious token revokations detected.
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900">Security Features</h4>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 text-slate-500" />
                <div>
                  <div className="font-bold text-slate-800">Two-Factor Authentication</div>
                  <div className="text-[10px] text-slate-400">Authenticator app or SMS passcodes</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                Enabled
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-slate-500" />
                <div>
                  <div className="font-bold text-slate-800">Active Sessions</div>
                  <div className="text-[10px] text-slate-400">1 active web browser session</div>
                </div>
              </div>
              <button
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Sessions Verified',
                    description: 'Only your current browser session is logged in.',
                  });
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
