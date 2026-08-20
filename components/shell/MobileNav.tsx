'use client';

import React, { useState } from 'react';
import {
  Home,
  Brain,
  History,
  Target,
  MoreHorizontal,
  CheckSquare,
  Cpu,
  Settings as SettingsIcon,
  Sparkles,
  Link2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Drawer } from '../ui/Drawer';
import { CONNECTOR_DATA, ConnectorId, getConnectorIcon } from './ConnectorModal';
import { ProUsageCard } from './ProUsageCard';

export interface MobileNavProps {
  activePage: string;
  onSelectPage: (pageId: string) => void;
  onOpenConnector: (connectorId: ConnectorId) => void;
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activePage,
  onSelectPage,
  onOpenConnector,
  className,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { id: 'ask-my-world', label: 'Ask', icon: <Brain className="h-4 w-4" /> },
    { id: 'what-changed', label: 'Changes', icon: <History className="h-4 w-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="h-4 w-4" /> },
    { id: 'more', label: 'More', icon: <MoreHorizontal className="h-4 w-4" /> },
  ];

  const handleTabClick = (id: string) => {
    if (id === 'more') {
      setIsMoreOpen(true);
    } else {
      onSelectPage(id);
    }
  };

  const handleSelectMoreItem = (pageId: string) => {
    setIsMoreOpen(false);
    onSelectPage(pageId);
  };

  const handleConnectorClick = (connectorId: ConnectorId) => {
    setIsMoreOpen(false);
    onOpenConnector(connectorId);
  };

  return (
    <>
      {/* Mobile Bottom Sticky Bar */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around lg:hidden select-none shadow-lg',
          className
        )}
      >
        {mainTabs.map((tab) => {
          const isActive =
            tab.id === 'more'
              ? ['clean-my-day', 'memory', 'settings'].includes(activePage)
              : activePage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-[11px] font-medium transition-all duration-150',
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <span
                className={cn(
                  'p-1 rounded-lg transition-colors',
                  isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'
                )}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* More Navigation Drawer */}
      <Drawer
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        title="Nexorbit Menu"
        subtitle="Navigation & Connected Apps"
        position="right"
      >
        <div className="space-y-6 pb-6">
          {/* Secondary Pages */}
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Features
            </span>
            <button
              onClick={() => handleSelectMoreItem('clean-my-day')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors',
                activePage === 'clean-my-day'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <CheckSquare className="h-4 w-4 text-indigo-500" />
              <span>Clean My Day</span>
            </button>

            <button
              onClick={() => handleSelectMoreItem('memory')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors',
                activePage === 'memory'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <Cpu className="h-4 w-4 text-indigo-500" />
              <span>Memory</span>
            </button>

            <button
              onClick={() => handleSelectMoreItem('settings')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors',
                activePage === 'settings'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <SettingsIcon className="h-4 w-4 text-indigo-500" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => handleSelectMoreItem('support')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors',
                activePage === 'support'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Support</span>
            </button>
          </div>

          {/* Connected Apps Section */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Connected Apps
              </span>
              <Link2 className="h-3 w-3 text-slate-400" />
            </div>

            <div className="space-y-1">
              {(['gmail', 'calendar', 'drive', 'notion', 'github'] as ConnectorId[]).map((cId) => {
                const conn = CONNECTOR_DATA[cId];
                return (
                  <button
                    key={cId}
                    onClick={() => handleConnectorClick(cId)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-500">{getConnectorIcon(cId, 'h-4 w-4')}</span>
                      <span className="font-medium">{conn.name}</span>
                    </div>

                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          conn.connected ? 'bg-emerald-500' : 'bg-slate-300'
                        )}
                      />
                      <span className="text-[10px] text-slate-400 uppercase">
                        {conn.connected ? 'Connected' : 'Off'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pro Usage Card */}
          <div className="pt-2">
            <ProUsageCard />
          </div>
        </div>
      </Drawer>
    </>
  );
};
