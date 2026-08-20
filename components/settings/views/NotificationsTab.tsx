'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import {
  NexorbitSettings,
  getStoredSettings,
  updateSettings,
  subscribeToSettings,
} from '../../../services/settings/settingsService';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface NotificationsTabProps {
  className?: string;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ className }) => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState<NexorbitSettings>(() => getStoredSettings());
  const [browserPerm, setBrowserPerm] = useState<string>('default');

  useEffect(() => {
    const unsubscribe = subscribeToSettings((newSettings) => {
      setSettings(newSettings);
    });
    if (typeof window !== 'undefined' && 'Notification' in window) {
      queueMicrotask(() => {
        setBrowserPerm(Notification.permission);
      });
    }
    return () => unsubscribe();
  }, []);

  const handleToggleSystemNotifs = async () => {
    if (!settings.allowNotifications) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          const perm = await Notification.requestPermission();
          setBrowserPerm(perm);
          if (perm === 'granted') {
            addToast({
              type: 'success',
              title: 'Notifications Enabled',
              description: 'Nexorbit can now send system alerts to your browser.',
            });
          }
        } catch (e) {
          console.error('Notification permission error:', e);
        }
      }
      updateSettings({ allowNotifications: true });
    } else {
      updateSettings({ allowNotifications: false });
      addToast({
        type: 'info',
        title: 'Notifications Muted',
        description: 'All desktop alerts have been muted.',
      });
    }
  };

  const handleUpdate = (updates: Partial<NexorbitSettings>, message?: string) => {
    const next = updateSettings(updates);
    setSettings(next);
    if (message) {
      addToast({
        type: 'success',
        title: 'Notification Settings Saved',
        description: message,
      });
    }
  };

  return (
    <div className={cn('space-y-6 select-none animate-fadeIn', className)}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white tracking-tight">Notifications</h2>
        <p className="text-xs text-slate-400">
          Control how and when Nexorbit delivers alerts and updates.
        </p>
      </div>

      <div className="space-y-4">
        {/* Main Notification Toggle */}
        <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-800/80">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <span>Allow Nexorbit notifications</span>
              {browserPerm === 'granted' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Browser Granted
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Receive desktop and in-app alerts for completed tasks and updates.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.allowNotifications}
            onClick={handleToggleSystemNotifs}
            className={cn(
              'w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-hidden',
              settings.allowNotifications ? 'bg-blue-600' : 'bg-slate-700'
            )}
          >
            <span
              className={cn(
                'block w-4 h-4 rounded-full bg-white transition-transform transform top-1 absolute',
                settings.allowNotifications ? 'translate-x-6 left-0' : 'translate-x-1 left-0'
              )}
            />
          </button>
        </div>

        {/* Task Completion Alerts */}
        <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-800/80">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200">
              Task completion alerts
            </div>
            <p className="text-[11px] text-slate-400">
              Get notified when background research or agent missions finish.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.taskAlerts}
            onClick={() =>
              handleUpdate(
                { taskAlerts: !settings.taskAlerts },
                settings.taskAlerts ? 'Task alerts muted' : 'Task alerts enabled'
              )
            }
            className={cn(
              'w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-hidden',
              settings.taskAlerts ? 'bg-blue-600' : 'bg-slate-700'
            )}
          >
            <span
              className={cn(
                'block w-4 h-4 rounded-full bg-white transition-transform transform top-1 absolute',
                settings.taskAlerts ? 'translate-x-6 left-0' : 'translate-x-1 left-0'
              )}
            />
          </button>
        </div>

        {/* Security & Login Alerts */}
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200">
              Security & session alerts
            </div>
            <p className="text-[11px] text-slate-400">
              Receive notifications regarding workspace logins and security events.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.securityAlerts}
            onClick={() =>
              handleUpdate(
                { securityAlerts: !settings.securityAlerts },
                settings.securityAlerts ? 'Security alerts muted' : 'Security alerts enabled'
              )
            }
            className={cn(
              'w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 focus:outline-hidden',
              settings.securityAlerts ? 'bg-blue-600' : 'bg-slate-700'
            )}
          >
            <span
              className={cn(
                'block w-4 h-4 rounded-full bg-white transition-transform transform top-1 absolute',
                settings.securityAlerts ? 'translate-x-6 left-0' : 'translate-x-1 left-0'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
