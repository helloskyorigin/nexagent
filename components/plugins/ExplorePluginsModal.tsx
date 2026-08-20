'use client';

import React, { useState } from 'react';
import { X, Sparkles, Compass, Check, Plus, ExternalLink } from 'lucide-react';

interface ExplorePluginsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPCOMING_INTEGRATIONS = [
  { id: 'linear', name: 'Linear', category: 'Developer', desc: 'Sync issues, cycles, and project milestones.' },
  { id: 'figma', name: 'Figma', category: 'Design', desc: 'Inspect design components, specs, and file changes.' },
  { id: 'jira', name: 'Jira', category: 'Productivity', desc: 'Track enterprise tickets, sprints, and epics.' },
  { id: 'salesforce', name: 'Salesforce', category: 'Analytics', desc: 'Automate CRM lead routing and pipeline reports.' },
  { id: 'hubspot', name: 'HubSpot', category: 'Marketing', desc: 'Sync contacts, deals, and engagement workflows.' },
  { id: 'stripe', name: 'Stripe', category: 'Finance', desc: 'Monitor MRR, disputes, and subscription charges.' },
];

export const ExplorePluginsModal: React.FC<ExplorePluginsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  const [customRequest, setCustomRequest] = useState('');
  const [customSubmitted, setCustomSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleToggleRequest = (id: string) => {
    setRequested((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequest.trim()) return;
    setCustomSubmitted(true);
    setTimeout(() => {
      setCustomRequest('');
      setCustomSubmitted(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#121520] border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Explore Plugins
              </h2>
              <p className="text-xs text-slate-400">
                Discover upcoming integrations for Nexorbit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List of upcoming plugins */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1 pr-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Upcoming Integrations Pipeline
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UPCOMING_INTEGRATIONS.map((item) => {
              const isReq = !!requested[item.id];
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#161a25] border border-slate-800/80 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleRequest(item.id)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isReq
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
                    }`}
                  >
                    {isReq ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Vote Recorded</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        <span>Request Access</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Request Custom Plugin Form */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Request a Custom Integration
            </span>
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                placeholder="e.g. Asana, Zendesk, Discord..."
                className="flex-1 bg-[#161a25] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                disabled={!customRequest.trim() || customSubmitted}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {customSubmitted ? 'Submitted!' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
