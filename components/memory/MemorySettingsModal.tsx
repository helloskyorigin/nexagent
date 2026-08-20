'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Shield,
  Trash2,
  Check,
  RotateCcw,
  Sliders,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { MemorySettingsConfig } from './types';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface MemorySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MemorySettingsConfig;
  onSaveSettings: (settings: MemorySettingsConfig) => void;
  onClearAllMemories: () => void;
}

interface SettingsFormContentProps {
  settings: MemorySettingsConfig;
  onClose: () => void;
  onSaveSettings: (settings: MemorySettingsConfig) => void;
  onClearAllMemories: () => void;
}

const SettingsFormContent: React.FC<SettingsFormContentProps> = ({
  settings,
  onClose,
  onSaveSettings,
  onClearAllMemories,
}) => {
  const { addToast } = useToast();
  const [localSettings, setLocalSettings] = useState<MemorySettingsConfig>(settings);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const handleSave = () => {
    onSaveSettings(localSettings);
    addToast({
      title: 'Memory Settings Saved',
      description: 'Your memory retention and autonomy preferences have been updated.',
      type: 'success',
    });
    onClose();
  };

  const handleExecuteClear = () => {
    if (confirmInput !== 'CLEAR') {
      addToast({
        title: 'Confirmation Failed',
        description: 'Please type CLEAR in uppercase to confirm.',
        type: 'error',
      });
      return;
    }
    onClearAllMemories();
    setIsConfirmingClear(false);
    onClose();
    addToast({
      title: 'Memory Wiped',
      description: 'All synapses and contextual history have been permanently forgotten.',
      type: 'info',
    });
  };

  return (
    <div className="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-6 sm:p-7 text-left shadow-2xl transition-all border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Lock className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Memory Settings</h3>
        </div>
        <p className="text-xs text-slate-500 font-medium pl-10">
          Control what Nexorbit autonomously remembers, stores, and connects across your apps.
        </p>
      </div>

      <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Autonomous Memory Toggles */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Autonomous Memory &amp; Indexing
          </span>

          {/* Toggle 1: Auto Remember */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="space-y-0.5 max-w-sm">
              <div className="text-xs font-bold text-slate-900">
                Automatically remember useful context
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Allow Nexorbit to synthesize facts and deliverables automatically when you work.
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.autoRememberContext}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  autoRememberContext: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Toggle 2: Remember Conversations */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="space-y-0.5 max-w-sm">
              <div className="text-xs font-bold text-slate-900">
                Remember conversation insights
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Preserve key conclusions, agreements, and decisions from chats and prompt sessions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.rememberConversations}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  rememberConversations: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Toggle 3: Remember User Preferences */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="space-y-0.5 max-w-sm">
              <div className="text-xs font-bold text-slate-900">
                Personalized workflow preferences
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Remember your tone, layout preferences, and response brevity patterns.
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.rememberPreferences}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  rememberPreferences: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          {/* Toggle 4: Cross-App Context */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="space-y-0.5 max-w-sm">
              <div className="text-xs font-bold text-slate-900">
                Cross-app synaptic connections
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Link Gmail emails, Calendar events, Drive files, and Notion docs into single unified projects.
              </p>
            </div>
            <input
              type="checkbox"
              checked={localSettings.allowCrossAppContext}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  allowCrossAppContext: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Retention Period */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Memory Retention Policy
          </span>
          <select
            value={localSettings.retentionPeriod}
            onChange={(e) =>
              setLocalSettings((prev) => ({
                ...prev,
                retentionPeriod: e.target.value as any,
              }))
            }
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white cursor-pointer"
          >
            <option value="forever">Keep memories indefinitely (Recommended)</option>
            <option value="1year">Retain memories for 1 year</option>
            <option value="6months">Retain memories for 6 months</option>
            <option value="90days">Retain memories for 90 days</option>
          </select>
        </div>

        {/* Danger Zone: Clear Memories */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span className="text-xs font-bold text-rose-900">Danger Zone</span>
          </div>
          <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
            Permanently purge all synthesized memories, facts, and connection graphs across all apps.
          </p>

          {isConfirmingClear ? (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-rose-800">
                Type <strong className="text-rose-900">CLEAR</strong> to confirm:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="CLEAR"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-rose-300 rounded-xl font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
                />
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleExecuteClear}
                  className="text-xs h-8 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                >
                  Confirm Purge
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsConfirmingClear(false)}
                  className="text-xs h-8 px-2 rounded-xl text-slate-600 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingClear(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear all memories</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-xs h-9 px-4 rounded-xl cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-5 font-semibold rounded-xl shadow-2xs cursor-pointer"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export const MemorySettingsModal: React.FC<MemorySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearAllMemories,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <SettingsFormContent
          key={isOpen ? 'open' : 'closed'}
          settings={settings}
          onClose={onClose}
          onSaveSettings={onSaveSettings}
          onClearAllMemories={onClearAllMemories}
        />
      </div>
    </div>
  );
};
