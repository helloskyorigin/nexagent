'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar, ConversationSummary } from './Sidebar';
import { TopBar } from './TopBar';
import { SlideMenu } from './SlideMenu';
import { ConnectorModal, ConnectorId } from './ConnectorModal';
import { NewTaskModal } from './NewTaskModal';
import { PlaceholderPage, PAGE_CONFIG } from './PlaceholderPage';
import { HomeDashboard } from '../home/HomeDashboard';
import { ChatView } from '../chat/ChatView';
import { MemoryView } from '../memory/MemoryView';
import { ConnectedAppsView } from '../connectors/ConnectedAppsView';
import { MissionsView } from '../missions/MissionsView';
import { TasksPage } from '../tasks/TasksPage';
import { HistoryView } from '../history/HistoryView';
import { LibraryView } from '../library/LibraryView';
import { SupportView } from '../support/SupportView';
import { WhatChangedView } from '../changes/WhatChangedView';
import { CleanMyDayView } from '../focus/CleanMyDayView';
import { SettingsView } from '../settings/SettingsView';
import { useAuth } from '../auth/AuthContext';
import { AuthContainer } from '../auth/AuthContainer';
import { AuthLoading } from '../auth/AuthLoading';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { subscribeToAllConversations } from '../../services/chat/storage';

export interface AppShellProps {
  initialPage?: string;
  children?: React.ReactNode;
  showDevTabOption?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  initialPage = 'home',
  children,
  showDevTabOption = false,
}) => {
  const { user, isAuthenticated, authInitializing } = useAuth();
  const [activePage, setActivePage] = useState<string>('home');
  const [activeConnectorId, setActiveConnectorId] = useState<ConnectorId | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const prevAuthRef = useRef<boolean>(false);

  // Conversations state shared across Sidebar and ChatView
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const handleConversationsChange = useCallback((cList: ConversationSummary[]) => {
    setConversations(cList);
  }, []);

  // Subscribe to persistent conversations for sidebar live updates
  useEffect(() => {
    const unsubscribe = subscribeToAllConversations(user?.uid || null, (allConvs) => {
      setConversations(
        allConvs.map((c) => ({
          id: c.id,
          title: c.title,
          time: c.updatedAt,
          type: c.type,
          pinned: c.pinned,
          unread: c.unread,
        }))
      );
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Post-login ALWAYS lands on 'home'
  useEffect(() => {
    if (isAuthenticated) {
      if (!prevAuthRef.current) {
        setActivePage('home');
        if (typeof window !== 'undefined') {
          window.location.hash = 'home';
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        window.location.hash = '';
      }
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Handle active session hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined' && window.location.hash && isAuthenticated) {
        const hashPage = window.location.hash.replace('#', '');
        if (hashPage) {
          const normalized =
            hashPage === 'ask' || hashPage === 'ask-my-world'
              ? 'chat'
              : hashPage === 'tasks' || hashPage === 'clean-my-day'
              ? 'tasks'
              : hashPage === 'agent'
              ? 'missions'
              : hashPage === 'what-changed'
              ? 'history'
              : hashPage === 'connectors' || hashPage === 'plugins'
              ? 'connected-apps'
              : hashPage;
          setActivePage(normalized);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  if (authInitializing) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  const handleSelectPage = (pageId: string) => {
    const normalizedPage =
      pageId === 'ask' || pageId === 'ask-my-world'
        ? 'chat'
        : pageId === 'tasks' || pageId === 'clean-my-day'
        ? 'tasks'
        : pageId === 'agent'
        ? 'missions'
        : pageId === 'what-changed'
        ? 'history'
        : pageId === 'connectors' || pageId === 'plugins'
        ? 'connected-apps'
        : pageId;
    setActivePage(normalizedPage);
    if (typeof window !== 'undefined') {
      window.location.hash = normalizedPage;
    }
  };

  const handleSelectNewTaskType = (type: 'task' | 'chat' | 'agent') => {
    setActiveConversationId(null);
    if (type === 'chat') {
      handleSelectPage('chat');
    } else if (type === 'agent') {
      handleSelectPage('missions');
    } else {
      handleSelectPage('tasks');
    }
  };

  const currentPageMeta = PAGE_CONFIG[activePage] || PAGE_CONFIG['home'];

  const hasCustomHeader =
    activePage === 'home' ||
    activePage === 'chat' ||
    activePage === 'ask' ||
    activePage === 'ask-my-world' ||
    activePage === 'missions' ||
    activePage === 'tasks' ||
    activePage === 'history' ||
    activePage === 'what-changed' ||
    activePage === 'clean-my-day' ||
    activePage === 'memory' ||
    activePage === 'settings' ||
    activePage === 'support' ||
    activePage === 'connected-apps' ||
    activePage === 'plugins' ||
    activePage === 'connectors';

  return (
    <div className="min-h-screen bg-[#000000] text-[#ECECF1] flex flex-col font-sans antialiased transition-colors duration-200">
      <div className="flex flex-1 w-full relative">
        {/* Persistent Fixed Left Sidebar for Desktop (lg+) */}
        <Sidebar
          activePage={activePage}
          onSelectPage={handleSelectPage}
          onOpenConnector={(id) => setActiveConnectorId(id)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
            const target = conversations.find((c) => c.id === id);
            if (target && target.type === 'agent') {
              handleSelectPage('missions');
            } else {
              handleSelectPage('chat');
            }
          }}
          onNewTask={() => {
            setIsNewTaskModalOpen(true);
          }}
          className="hidden lg:flex"
        />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0 pb-0">
          {!hasCustomHeader && (
            <TopBar
              activePageTitle={currentPageMeta.title}
              activePageIcon={currentPageMeta.icon}
              onNavigate={handleSelectPage}
              onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
            />
          )}

          {showDevTabOption && (
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="indigo" size="sm">
                  Nexorbit Workspace
                </Badge>
                <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                  Screen: <code className="font-mono text-blue-400 font-semibold">/{activePage}</code>
                </span>
              </div>
            </div>
          )}

          {/* Main Content Area Container */}
          <main
            className={cn(
              'flex-1 w-full mx-auto overflow-x-hidden',
              activePage === 'home'
                ? 'max-w-7xl px-2 sm:px-6'
                : activePage === 'chat' || activePage === 'ask' || activePage === 'ask-my-world'
                ? 'w-full p-0 max-w-none h-screen'
                : 'max-w-7xl px-4 sm:px-6 md:px-8 py-3 sm:py-5 safe-pt'
            )}
          >
            {children ? (
              children
            ) : activePage === 'home' ? (
              <HomeDashboard
                onNavigate={handleSelectPage}
                onOpenConnector={(id) => setActiveConnectorId(id)}
                onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
              />
            ) : activePage === 'chat' || activePage === 'ask' || activePage === 'ask-my-world' ? (
              <ChatView
                onNavigate={handleSelectPage}
                activeConversationId={activeConversationId}
                onSelectConversation={setActiveConversationId}
                onConversationsChange={handleConversationsChange}
              />
            ) : activePage === 'tasks' ? (
              <TasksPage onNavigate={handleSelectPage} />
            ) : activePage === 'missions' || activePage === 'agent' ? (
              <MissionsView
                onNavigate={handleSelectPage}
                onOpenConnector={(id) => setActiveConnectorId(id)}
              />
            ) : activePage === 'library' || activePage === 'history' ? (
              <LibraryView onNavigate={handleSelectPage} />
            ) : activePage === 'what-changed' ? (
              <WhatChangedView onNavigate={handleSelectPage} />
            ) : activePage === 'clean-my-day' ? (
              <CleanMyDayView onNavigate={handleSelectPage} />
            ) : activePage === 'memory' ? (
              <MemoryView onNavigate={handleSelectPage} />
            ) : activePage === 'settings' ? (
              <SettingsView onNavigate={handleSelectPage} />
            ) : activePage === 'support' ? (
              <SupportView onNavigate={handleSelectPage} />
            ) : activePage === 'connected-apps' || activePage === 'connectors' ? (
              <ConnectedAppsView
                onNavigate={handleSelectPage}
                initialSelectedConnectorId={activeConnectorId}
              />
            ) : (
              <PlaceholderPage pageId={activePage} onNavigate={handleSelectPage} />
            )}
          </main>
        </div>
      </div>

      <SlideMenu
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onOpenConnector={(id) => setActiveConnectorId(id)}
      />

      {activeConnectorId && (
        <ConnectorModal
          connectorId={activeConnectorId}
          onClose={() => setActiveConnectorId(null)}
          onNavigate={(pageId) => {
            setActiveConnectorId(null);
            handleSelectPage(pageId);
          }}
        />
      )}

      {/* New Task Selection Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSelectType={handleSelectNewTaskType}
      />
    </div>
  );
};
