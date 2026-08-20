'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  ChevronRight,
  Command,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from '../ui/IconButton';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useToast } from '../ui/Toast';
import { Badge } from '../ui/Badge';

export interface TopBarProps {
  activePageTitle: string;
  activePageIcon?: React.ReactNode;
  onNavigate: (pageId: string) => void;
  onOpenMobileMenu?: () => void;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  activePageTitle,
  activePageIcon,
  onNavigate,
  onOpenMobileMenu,
  className,
}) => {
  const { addToast } = useToast();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      addToast({
        type: 'info',
        title: 'Brain Search',
        description: `Searching Nexorbit context for: "${searchValue}"`,
      });
      setSearchValue('');
    }
  };

  const handleNotificationClick = () => {
    addToast({
      type: 'info',
      title: 'Notifications',
      description: 'You have 2 pending context updates from Gmail & Calendar.',
    });
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-10 min-h-14 safe-pt bg-[#000000]/95 backdrop-blur-md border-b border-[#444654] px-4 sm:px-6 flex items-center justify-between transition-all duration-200 text-[#ECECF1]',
        className
      )}
    >
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-xl border border-[#444654] text-[#C5C5D2] hover:bg-[#212121] hover:text-white lg:hidden cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Page Title / Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#C5C5D2]">
          <span className="hidden sm:inline-block font-medium text-[#C5C5D2]">Nexorbit</span>
          <ChevronRight className="h-3.5 w-3.5 text-[#C5C5D2] hidden sm:inline-block" />
          <div className="flex items-center gap-1.5 text-white font-medium text-sm tracking-tight">
            {activePageIcon && <span className="text-[#5486E9]">{activePageIcon}</span>}
            <span>{activePageTitle}</span>
          </div>
        </div>
      </div>

      {/* Center/Right: Quick Search + Notifications + Profile */}
      <div className="flex items-center gap-2.5">
        {/* Subtle Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#C5C5D2]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search personal brain..."
            className="w-full h-8.5 pl-8 pr-12 text-xs bg-[#171717] hover:bg-[#212121] focus:bg-[#212121] text-[#ECECF1] placeholder:text-[#C5C5D2] rounded-xl border border-[#444654] focus:border-[#5486E9] focus:ring-1 focus:ring-[#5486E9]/20 focus:outline-none transition-all duration-150"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-[#C5C5D2] bg-[#000000] px-1.5 py-0.5 rounded border border-[#444654]">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </form>

        {/* Quick Action Trigger */}
        <IconButton
          icon={<Sparkles className="h-4 w-4 text-[#5486E9]" />}
          label="Ask My World quick action"
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('ask-my-world')}
          className="hidden sm:inline-flex bg-[#171717] hover:bg-[#212121] text-[#ECECF1] hover:text-white border-[#444654]"
        />

        {/* Notification Bell */}
        <div className="relative">
          <IconButton
            icon={<Bell className="h-4 w-4 text-[#C5C5D2] hover:text-white" />}
            label="Notifications"
            variant="ghost"
            size="sm"
            onClick={handleNotificationClick}
          />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#5486E9] ring-2 ring-[#000000]" />
        </div>

        {/* User Profile Dropdown */}
        <div className="pl-1 border-l border-[#444654]">
          <UserProfileDropdown onNavigate={onNavigate} />
        </div>
      </div>
    </header>
  );
};
