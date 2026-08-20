'use client';

import React from 'react';
import { Modal } from '../../ui/Modal';
import { Check, Zap, Sparkles } from 'lucide-react';
import { useToast } from '../../ui/Toast';

export interface ViewPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSelectPlan: (plan: 'Free Plan' | 'Pro Plan' | 'Enterprise Plan') => void;
}

export const ViewPlansModal: React.FC<ViewPlansModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
}) => {
  const { addToast } = useToast();

  const handleChoose = (plan: 'Free Plan' | 'Pro Plan' | 'Enterprise Plan') => {
    onSelectPlan(plan);
    onClose();
    addToast({
      type: 'success',
      title: 'Plan Updated',
      description: `Your subscription has been switched to ${plan}.`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nexorbit Subscription Plans"
      description="Choose the plan that fits your personal workspace and AI needs"
      maxWidth="lg"
    >
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free Plan */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Free Plan</h3>
                {currentPlan === 'Free Plan' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="text-2xl font-extrabold text-slate-900">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
              <p className="text-xs text-slate-500">Essential connected app context & AI responses.</p>

              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Up to 5 connected app accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>10 GB vector context memory</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Standard response reasoning speed</span>
                </li>
              </ul>
            </div>

            <button
              disabled={currentPlan === 'Free Plan'}
              onClick={() => handleChoose('Free Plan')}
              className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {currentPlan === 'Free Plan' ? 'Active' : 'Downgrade to Free'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/40 space-y-4 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Pro Plan</span>
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </h3>
                {currentPlan === 'Pro Plan' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="text-2xl font-extrabold text-slate-900">$15 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
              <p className="text-xs text-slate-500">Unlimited context memory, real-time sync, and priority AI routing.</p>

              <ul className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Unlimited connected apps & accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>100 GB vector memory & full history</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Ultra-fast AI reasoning mode</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Priority support & early lab access</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('Pro Plan')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              {currentPlan === 'Pro Plan' ? 'Active Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
