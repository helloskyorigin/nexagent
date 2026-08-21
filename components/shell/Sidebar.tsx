'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SquarePen,
  Bot,
  Blocks,
  CheckSquare,
  Box,
  BookOpen,
  Settings as SettingsIcon,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  MessageSquare,
  Zap,
  Palette,
  HelpCircle,
  LogOut,
  MoreHorizontal,
  Pencil,
  Pin,
  Trash2,
  Copy,
  Mail,
  Check,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorId } from './ConnectorModal';
import { useAuth } from '../auth/AuthContext';
import {
  renameConversationTitle,
  deleteConversationById,
  togglePinConversation,
  duplicateConversationById,
  toggleUnreadConversation,
} from '../../services/chat/storage';

export interface NavItem {
  id: string;
  label: string;
  targetPage: string;
  icon: React.ReactNode;
}

export const FIXED_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Work', targetPage: 'home', icon: <SquarePen className="h-5.5 w-5.5 text-[#ECECF1] group-hover:text-white stroke-[2.2]" /> },
  { id: 'agent', label: 'Autopilot', targetPage: 'missions', icon: <Bot className="h-5.5 w-5.5 text-[#ECECF1] group-hover:text-white stroke-[2.2]" /> },
  { id: 'plugins', label: 'Connect', targetPage: 'connected-apps', icon: <Blocks className="h-5.5 w-5.5 text-[#ECECF1] group-hover:text-white stroke-[2.2]" /> },
];

export const SCROLLABLE_NAV_ITEMS: NavItem[] = [
  { id: 'tasks', label: 'Tasks', targetPage: 'tasks', icon: <CheckSquare className="h-5.5 w-5.5 text-[#ECECF1] group-hover:text-white stroke-[2.2]" /> },
  { id: 'memory', label: 'Memory', targetPage: 'memory', icon: <Box className="h-5.5 w-5.5 text-[#ECECF1] group-hover:text-white stroke-[2.2]" /> },
  { id: 'library', label: 'Library', targetPage: 'library', icon: <BookOpen className="h-5.5 w-5.5 text-[#ECECF1] group-hover:text-white stroke-[2.2]" /> },
];

export const MAIN_NAV_ITEMS: NavItem[] = [...FIXED_NAV_ITEMS, ...SCROLLABLE_NAV_ITEMS];

export interface ConversationSummary {
  id: string;
  title: string;
  time?: string;
  type?: 'chat' | 'agent';
  pinned?: boolean;
  unread?: boolean;
}

export interface SidebarProps {
  activePage: string;
  onSelectPage: (pageId: string) => void;
  onOpenConnector?: (connectorId: ConnectorId) => void;
  conversations?: ConversationSummary[];
  activeConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  onNewTask?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  className,
}) => {
  const { user, signOut } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Menu state for conversation ⋯
  const [menuOpenConvId, setMenuOpenConvId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const convMenuRef = useRef<HTMLDivElement>(null);

  // Inline rename state
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (convMenuRef.current && !convMenuRef.current.contains(event.target as Node)) {
        setMenuOpenConvId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false);
        setMenuOpenConvId(null);
        setEditingConvId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Focus rename input when editing begins
  useEffect(() => {
    if (editingConvId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingConvId]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexorbit_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexorbit_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const isItemActive = (item: NavItem) => {
    if (item.id === 'home' && (activePage === 'home' || !activePage)) return true;
    if (item.id === 'agent' && (activePage === 'missions' || activePage === 'agent')) return true;
    if (item.id === 'plugins' && (activePage === 'connected-apps' || activePage === 'plugins' || activePage === 'connectors')) return true;
    if (item.id === 'tasks' && (activePage === 'tasks' || activePage === 'clean-my-day')) return true;
    if (item.id === 'memory' && activePage === 'memory') return true;
    if (item.id === 'library' && (activePage === 'history' || activePage === 'library' || activePage === 'what-changed')) return true;
    if (item.id === 'settings' && activePage === 'settings') return true;
    if (item.id === 'account' && activePage === 'account') return true;
    return false;
  };

  // Sort conversations: Pinned conversations at top
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleOpenConvMenu = (e: React.MouseEvent<HTMLButtonElement>, convId: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (menuOpenConvId === convId) {
      setMenuOpenConvId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 160;
    const menuWidth = 180;

    // Viewport bounds checking
    let top = rect.bottom + 4;
    let left = rect.right - menuWidth;

    if (top + menuHeight > window.innerHeight - 10) {
      top = Math.max(10, rect.top - menuHeight - 4);
    }
    if (left < 10) {
      left = 10;
    }

    setMenuPosition({ top, left });
    setMenuOpenConvId(convId);
  };

  const handleRenameStart = (conv: ConversationSummary) => {
    setEditingConvId(conv.id);
    setEditingTitle(conv.title);
    setMenuOpenConvId(null);
  };

  const handleRenameSave = async (convId: string) => {
    const clean = editingTitle.trim();
    if (clean) {
      await renameConversationTitle(convId, clean);
    }
    setEditingConvId(null);
  };

  const handleTogglePin = async (convId: string) => {
    setMenuOpenConvId(null);
    await togglePinConversation(convId);
  };

  const handleDuplicate = async (convId: string) => {
    setMenuOpenConvId(null);
    const newId = await duplicateConversationById(convId);
    if (newId && onSelectConversation) {
      onSelectConversation(newId);
    }
  };

  const handleToggleUnread = async (convId: string) => {
    setMenuOpenConvId(null);
    await toggleUnreadConversation(convId);
  };

  const handleDelete = async (convId: string) => {
    setMenuOpenConvId(null);
    await deleteConversationById(convId);
    if (activeConversationId === convId && onSelectPage) {
      onSelectPage('home');
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Sky Origin';
  const displayPlan = 'Pro Plan';
  const initialLetter = displayName.substring(0, 2).toUpperCase() || 'SO';

  const activeMenuConv = conversations.find((c) => c.id === menuOpenConvId);

  return (
    <aside
      className={cn(
        'flex flex-col justify-between shrink-0 select-none h-screen sticky top-0 z-20 transition-all duration-200 ease-out',
        'bg-[#000000] border-r border-white/[0.05] text-[#ECECF1]',
        isCollapsed ? 'w-[72px] p-3' : 'w-[310px] p-3.5',
        className
      )}
    >
      {/* 1. FIXED TOP SECTION (Header & Fixed Navigation: New Chat, Agent, Plugins) */}
      <div className="flex flex-col shrink-0 space-y-2 pb-1 group/header">
        {/* Brand Logo & Header with SINGLE Integrated Collapse / Expand Control Slot */}
        <div className="flex items-center justify-between px-1.5 py-1 min-h-[36px]">
          <div className="flex items-center gap-3 min-w-0">
            {/* Dedicated Logo / Toggle Control Slot (36x36px) */}
            <button
              type="button"
              onClick={toggleCollapse}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="relative h-9 w-9 rounded-xl flex items-center justify-center hover:bg-white/10 text-[#ECECF1] hover:text-white transition-colors cursor-pointer shrink-0 focus:outline-none"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {!isCollapsed ? (
                <>
                  {/* Open state default: Logo Orb */}
                  <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-150", isLogoHovered ? "opacity-0 pointer-events-none" : "opacity-100")}>
                    <svg viewBox="0 0 36 36" fill="none" className="h-8.5 w-8.5 text-[#5486E9]">
                      <ellipse cx="18" cy="18" rx="14" ry="7" stroke="currentColor" strokeWidth="2.4" className="transform -rotate-45 origin-center" />
                      <circle cx="18" cy="18" r="4.5" fill="white" />
                    </svg>
                  </div>
                  {/* Open state hover: Collapse Icon */}
                  <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-150", isLogoHovered ? "opacity-100" : "opacity-0 pointer-events-none")}>
                    <PanelLeftClose className="h-5 w-5 text-[#ECECF1] hover:text-white stroke-[2]" />
                  </div>
                </>
              ) : (
                /* Collapsed state: Expand Icon */
                <PanelLeftOpen className="h-5 w-5 text-[#ECECF1] hover:text-white stroke-[2]" />
              )}
            </button>

            {/* Nexorbit Brand Name (visible only when open) */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={() => onSelectPage('home')}
                className="font-bold text-xl tracking-tight text-[#ECECF1] hover:text-white transition-colors leading-none truncate cursor-pointer text-left focus:outline-none"
                aria-label="Nexorbit Home"
                title="Nexorbit Home"
              >
                Nexorbit
              </button>
            )}
          </div>
        </div>

        {/* Fixed Main Navigation List: New Chat, Agent, Plugins */}
        <nav className="space-y-1" aria-label="Primary Fixed Navigation">
          {FIXED_NAV_ITEMS.map((item) => {
            const active = isItemActive(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPage(item.targetPage)}
                className={cn(
                  'w-full h-11 flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all duration-150 cursor-pointer group text-left',
                  active
                    ? 'bg-[#212121] text-white border border-white/[0.08] shadow-xs'
                    : 'text-[#ECECF1] hover:text-white hover:bg-white/[0.06]'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="shrink-0 text-[#ECECF1] group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="truncate text-[#ECECF1] group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. SCROLLABLE MIDDLE SECTION (Tasks, Memory, Library + CHAT HISTORY) */}
      <div className="flex-1 min-h-0 overflow-y-auto sidebar-scrollbar pr-1 space-y-3 pt-1">
        {/* Scrollable Nav Items: Tasks, Memory, Library with exact identical spacing and height */}
        <nav className="space-y-1" aria-label="Secondary Navigation">
          {SCROLLABLE_NAV_ITEMS.map((item) => {
            const active = isItemActive(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPage(item.targetPage)}
                className={cn(
                  'w-full h-11 flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[16px] font-semibold transition-all duration-150 cursor-pointer group text-left',
                  active
                    ? 'bg-[#212121] text-white border border-white/[0.08] shadow-xs'
                    : 'text-[#ECECF1] hover:text-white hover:bg-white/[0.06]'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="shrink-0 text-[#ECECF1] group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="truncate text-[#ECECF1] group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* PROJECTS SECTION */}
        {!isCollapsed && (
          <div className="pt-3 border-t border-white/[0.05] space-y-1.5">
            <div className="flex items-center justify-between px-2.5 py-1">
              <span className="text-[12px] font-bold text-[#C5C5D2] uppercase tracking-wider">
                Projects
              </span>
            </div>

            {/* Chat List */}
            <div className="space-y-0.5">
              {sortedConversations.length > 0 ? (
                sortedConversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  const isMenuOpen = menuOpenConvId === conv.id;
                  const isEditing = editingConvId === conv.id;

                  if (isEditing) {
                    return (
                      <div
                        key={conv.id}
                        className="w-full px-2 py-1.5 rounded-xl bg-[#212121] border border-[#5486E9] flex items-center gap-1.5"
                      >
                        <input
                          ref={renameInputRef}
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSave(conv.id);
                            if (e.key === 'Escape') setEditingConvId(null);
                          }}
                          className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-white font-medium px-1 py-0.5"
                        />
                        <button
                          type="button"
                          onClick={() => handleRenameSave(conv.id)}
                          className="p-1 rounded text-[#10A37F] hover:bg-white/10 transition-colors cursor-pointer"
                          title="Save"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingConvId(null)}
                          className="p-1 rounded text-[#C5C5D2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Cancel"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        if (onSelectConversation) {
                          onSelectConversation(conv.id);
                        } else {
                          onSelectPage(conv.type === 'agent' ? 'missions' : 'chat');
                        }
                      }}
                      className={cn(
                        'group relative w-full text-left px-3.5 py-2.5 rounded-xl text-[15px] flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer min-h-[40px]',
                        isActive
                          ? 'bg-[#212121] text-white font-semibold border border-white/[0.08]'
                          : isMenuOpen
                          ? 'bg-[#212121] text-white font-semibold border border-white/[0.08]'
                          : 'text-[#ECECF1] hover:text-white hover:bg-white/[0.06]'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {conv.pinned && (
                          <Pin className="h-3.5 w-3.5 text-[#5486E9] shrink-0 fill-[#5486E9]/20" />
                        )}
                        {conv.unread && (
                          <span className="h-2 w-2 rounded-full bg-[#5486E9] shrink-0" />
                        )}
                        <span className="truncate font-medium text-[#ECECF1] group-hover:text-white transition-colors">
                          {conv.title}
                        </span>
                      </div>

                      {/* Clean ⋯ trigger button on hover or active/menuOpen */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenConvMenu(e, conv.id)}
                        className={cn(
                          'p-1 rounded-lg text-[#C5C5D2] hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer shrink-0',
                          isMenuOpen ? 'opacity-100 bg-white/[0.1] text-white' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                        )}
                        aria-label="Chat options"
                        title="More options"
                      >
                        <MoreHorizontal className="h-4 w-4 stroke-[2]" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="px-2.5 py-3 text-center text-xs font-medium text-[#C5C5D2]">
                  No chats yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. FIXED BOTTOM USER PROFILE SECTION */}
      <div className="pt-2 border-t border-white/[0.05] shrink-0 relative" ref={accountMenuRef}>
        {/* Floating Account Menu */}
        {isAccountMenuOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#171717] border border-white/[0.1] rounded-2xl shadow-2xl p-1.5 z-50 text-white flex flex-col gap-0.5 overflow-hidden transform transition-all duration-150 origin-bottom-left animate-in fade-in zoom-in-95">
            {/* User Info Header */}
            <div className="flex items-center gap-3 px-3 pt-2 pb-2.5 mb-0.5 border-b border-white/[0.08]">
              <div className="h-8.5 w-8.5 rounded-full bg-[#5486E9] text-white font-medium flex items-center justify-center shrink-0 text-xs">
                {initialLetter}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-[15px] font-semibold text-white truncate">
                  {displayName}
                </div>
                <div className="text-xs text-[#C5C5D2] truncate">
                  {user?.email || 'user@nexorbit.ai'}
                </div>
              </div>
            </div>

            {/* Menu Groups */}
            <div className="flex flex-col gap-0.5 pb-0.5 mb-0.5 border-b border-white/[0.08]">
              <button 
                type="button"
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13.5px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
              >
                <Zap className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
                Upgrade Plan
              </button>
              <button 
                type="button"
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13.5px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
              >
                <Palette className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
                Personalization
              </button>
            </div>

            <div className="flex flex-col gap-0.5 pb-0.5 mb-0.5 border-b border-white/[0.08]">
              <button 
                type="button"
                onClick={() => { setIsAccountMenuOpen(false); onSelectPage('account'); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13.5px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
              >
                <User className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
                Profile
              </button>
              <button 
                type="button"
                onClick={() => { setIsAccountMenuOpen(false); onSelectPage('settings'); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13.5px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
              >
                <SettingsIcon className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
                Settings
              </button>
              <button 
                type="button"
                onClick={() => { setIsAccountMenuOpen(false); onSelectPage('support'); }}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13.5px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
              >
                <HelpCircle className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
                Help
              </button>
            </div>

            <button 
              type="button"
              onClick={async () => {
                setIsAccountMenuOpen(false);
                if (signOut) {
                  try {
                    await signOut();
                  } catch(e) {}
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13.5px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="h-4 w-4 text-red-400 stroke-[2]" />
              Log out
            </button>
          </div>
        )}

        {/* User Profile Pill at bottom */}
        {!isCollapsed ? (
          <button
            type="button"
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#171717] hover:bg-[#212121] border border-white/[0.08] transition-all duration-150 cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8.5 w-8.5 rounded-full bg-[#5486E9] text-white font-semibold text-xs flex items-center justify-center shrink-0">
                {initialLetter}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-[15px] font-semibold text-[#ECECF1] group-hover:text-white transition-colors truncate">
                  {displayName}
                </div>
                <div className="text-[13px] font-medium text-[#C5C5D2] truncate">
                  {displayPlan}
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-[#C5C5D2] group-hover:text-white shrink-0 transition-colors" />
          </button>
        ) : (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="h-8.5 w-8.5 rounded-full bg-[#5486E9] text-white font-semibold text-xs flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              title={displayName}
              aria-label={displayName}
            >
              {initialLetter}
            </button>
          </div>
        )}
      </div>

      {/* FIXED ANCHORED CHAT ⋯ CONTEXT MENU */}
      {menuOpenConvId && activeMenuConv && menuPosition && (
        <div
          ref={convMenuRef}
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          className="w-[180px] bg-[#171717] border border-white/[0.1] rounded-2xl shadow-2xl p-1.5 z-50 text-white flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* 1. Rename */}
          <button
            type="button"
            onClick={() => handleRenameStart(activeMenuConv)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
          >
            <Pencil className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
            <span>Rename</span>
          </button>

          {/* 2. Pin chat */}
          <button
            type="button"
            onClick={() => handleTogglePin(activeMenuConv.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
          >
            <Pin className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
            <span>{activeMenuConv.pinned ? 'Unpin chat' : 'Pin chat'}</span>
          </button>

          {/* 3. Move to Agent */}
          <button
            type="button"
            onClick={() => {
              setMenuOpenConvId(null);
              onSelectPage('missions');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] font-medium text-[#ECECF1] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-left"
          >
            <Bot className="h-4 w-4 text-[#ECECF1] stroke-[2]" />
            <span>Move to Agent</span>
          </button>

          <div className="h-[1px] bg-white/[0.08] my-1" />

          {/* 4. Delete (Destructive Red) */}
          <button
            type="button"
            onClick={() => handleDelete(activeMenuConv.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[14px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
          >
            <Trash2 className="h-4 w-4 text-red-400 stroke-[2]" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </aside>
  );
};
