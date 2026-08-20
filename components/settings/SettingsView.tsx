'use client';

import React, { useState } from 'react';
import { SettingsSectionNav } from './SettingsSectionNav';
import { SettingsTabId } from './types';
import { ProfileTab } from './views/ProfileTab';
import { GeneralTab } from './views/GeneralTab';
import { AIBrainTab } from './views/AIBrainTab';
import { MemoryDataTab } from './views/MemoryDataTab';
import { PrivacySecurityTab } from './views/PrivacySecurityTab';
import { NotificationsTab } from './views/NotificationsTab';
import { AppearanceTab } from './views/AppearanceTab';
import { ConnectedAppsTab } from './views/ConnectedAppsTab';
import { AdvancedTab } from './views/AdvancedTab';
import { cn } from '../../lib/utils';

export interface SettingsViewProps {
  onNavigate: (pageId: string) => void;
  className?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onNavigate,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');

  return (
    <div
      className={cn(
        'w-full min-h-[calc(100vh-4rem)] flex items-start justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 text-slate-100',
        className
      )}
    >
      {/* Main Settings Card / Workspace matching reference image */}
      <div className="w-full max-w-4xl rounded-3xl bg-[#0f1118]/95 border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col md:flex-row min-h-[580px]">
        {/* Left Sub-Navigation Column */}
        <div className="w-full md:w-60 lg:w-64 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-slate-800/80 bg-[#0d0f15]/80 shrink-0">
          <SettingsSectionNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>

        {/* Right Active Tab Content Pane */}
        <div className="flex-1 p-5 sm:p-7 md:p-8 overflow-y-auto max-h-[85vh]">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'ai-brain' && <AIBrainTab />}
          {activeTab === 'memory-data' && <MemoryDataTab />}
          {activeTab === 'privacy-security' && <PrivacySecurityTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'connected-apps' && <ConnectedAppsTab onNavigate={onNavigate} />}
          {activeTab === 'advanced' && <AdvancedTab />}
        </div>
      </div>
    </div>
  );
};
