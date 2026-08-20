'use client';

import React from 'react';
import { User, Settings, Zap, LogOut, ChevronDown } from 'lucide-react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { useToast } from '../ui/Toast';
import { useAuth } from '../auth/AuthContext';

export interface UserProfileDropdownProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  onNavigate,
  className,
}) => {
  const { addToast } = useToast();
  const { user, signOut } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayPlan = user?.plan || 'Free Plan';

  const handleProfileClick = () => {
    addToast({
      type: 'info',
      title: displayName,
      description: `${displayPlan} • ${user?.email || 'user@nexorbit.ai'}`,
    });
  };

  const handleSettingsClick = () => {
    if (onNavigate) {
      onNavigate('settings');
    }
  };

  const handleUsageClick = () => {
    addToast({
      type: 'info',
      title: 'Credit Usage Overview',
      description: '1,250 / 15,000 credits used this cycle.',
    });
  };

  const handleSignOutClick = async () => {
    try {
      await signOut();
      addToast({
        type: 'info',
        title: 'Signed Out',
        description: 'You have been safely signed out. Redirecting to login...',
      });
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const menuItems: DropdownItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-3.5 w-3.5 text-zinc-400" />,
      onClick: handleProfileClick,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-3.5 w-3.5 text-zinc-400" />,
      onClick: handleSettingsClick,
    },
    {
      id: 'usage',
      label: 'Usage & Billing',
      icon: <Zap className="h-3.5 w-3.5 text-zinc-400" />,
      onClick: handleUsageClick,
    },
    {
      id: 'signout',
      label: 'Sign out',
      icon: <LogOut className="h-3.5 w-3.5 text-red-400" />,
      danger: true,
      onClick: handleSignOutClick,
    },
  ];

  const triggerNode = (
    <div className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer group select-none">
      <Avatar name={displayName} src={user?.photoURL} size="sm" status="online" />
      <div className="text-left hidden sm:block">
        <div className="text-[13px] font-medium text-zinc-100 group-hover:text-white transition-colors">
          {displayName}
        </div>
        <div className="text-xs font-normal text-zinc-400">{displayPlan}</div>
      </div>
      <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors ml-0.5" />
    </div>
  );

  return <Dropdown trigger={triggerNode} items={menuItems} align="right" className={className} />;
};

