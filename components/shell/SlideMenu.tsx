'use client';

import React, { useEffect } from 'react';
import {
  Home,
  MessageSquare,
  History,
  Target,
  Sparkles,
  Box,
  LayoutGrid,
  Settings as SettingsIcon,
  HelpCircle,
  X,
  LogOut,
  CheckSquare,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorId } from './ConnectorModal';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../ui/Toast';

export interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onSelectPage: (pageId: string) => void;
  onOpenConnector?: (connectorId: ConnectorId) => void;
  userName?: string;
  userEmail?: string;
}

const MENU_ITEMS = [
  { id: 'home', label: 'Work', icon: <Home className="h-5 w-5" /> },
  { id: 'chat', label: 'Projects', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="h-5 w-5" /> },
  { id: 'missions', label: 'Autopilot', icon: <Target className="h-5 w-5" /> },
  { id: 'memory', label: 'Memory', icon: <Box className="h-5 w-5" /> },
  { id: 'connected-apps', label: 'Connect', icon: <LayoutGrid className="h-5 w-5" /> },
  { id: 'library', label: 'Library', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  { id: 'support', label: 'Support', icon: <HelpCircle className="h-5 w-5" /> },
];

export const SlideMenu: React.FC<SlideMenuProps> = ({
  isOpen,
  onClose,
  activePage,
  onSelectPage,
  userName: fallbackName = 'User',
  userEmail: fallbackEmail = 'user@nexorbit.ai',
}) => {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  const displayName = user?.displayName || fallbackName;
  const displayEmail = user?.email || fallbackEmail;
  const displayPlan = user?.plan || 'Free Plan';
  const initialLetter = displayName.charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    onClose();
    try {
      await signOut();
      addToast({
        type: 'info',
        title: 'Signed Out',
        description: 'You have been safely signed out.',
      });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer Surface */}
      <div className="relative w-4/5 max-w-xs bg-[#0D0F12] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-slideInLeft border-r border-white/[0.08] p-5 text-zinc-300">
        {/* Top: Header & Brand */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center h-8 w-8 shrink-0">
                <svg viewBox="0 0 36 36" fill="none" className="h-8 w-8 text-blue-500">
                  <ellipse cx="18" cy="18" rx="14" ry="7" stroke="currentColor" strokeWidth="2.4" className="transform -rotate-45 origin-center" />
                  <circle cx="18" cy="18" r="4.5" fill="white" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-white leading-none">
                  Nexorbit
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Preview */}
          <div
            onClick={() => {
              onClose();
              onSelectPage('settings');
            }}
            className="p-3 rounded-xl bg-[#12151f] border border-white/[0.08] flex items-center gap-3 cursor-pointer hover:bg-[#181c2b] transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-xs shrink-0">
              {initialLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-zinc-400 truncate">{displayEmail}</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {MENU_ITEMS.map((item) => {
              const isActive =
                activePage === item.id ||
                (item.id === 'missions' && (activePage === 'clean-my-day' || activePage === 'tasks')) ||
                (item.id === 'history' && activePage === 'what-changed') ||
                (item.id === 'chat' && (activePage === 'ask' || activePage === 'ask-my-world')) ||
                (item.id === 'connected-apps' && activePage === 'connectors');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onClose();
                    onSelectPage(item.id);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14.5px] font-medium transition-all duration-150 text-left cursor-pointer',
                    isActive
                      ? 'bg-white/[0.07] text-white border border-blue-500/30'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-blue-400' : 'text-zinc-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Workspace status & Logout Action */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Connectors Synced</span>
            </div>
            <span className="font-medium text-zinc-300">6/6 Active</span>
          </div>

          {/* Prominent Log Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-red-500/10 text-zinc-300 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 font-medium text-xs transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-zinc-400 hover:text-red-400" />
            <span>Sign Out of Nexorbit</span>
          </button>

          <div className="text-[11px] text-zinc-500 text-center font-normal">
            Nexorbit • {displayPlan}
          </div>
        </div>
      </div>
    </div>
  );
};
