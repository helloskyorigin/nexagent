'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AskConversation,
  AskMessage,
  FindingItem,
  SourceItem,
  ContextEntity,
  RelatedItem,
} from './types';
import {
  INITIAL_CONVERSATIONS,
  MOCK_PROJECT_ALPHA_RESPONSE,
  MOCK_RISK_RESPONSE,
  MOCK_SOURCES_RESPONSE,
  MOCK_SUMMARIZE_RESPONSE,
  MOCK_SOURCES,
} from './mockData';
import { AskMyWorldHeader } from './AskMyWorldHeader';
import { UserMessage } from './UserMessage';
import { AIResponse } from './AIResponse';
import { ContextRail } from './ContextRail';
import { AskComposer } from './AskComposer';
import { EmptyAskState } from './EmptyAskState';
import {
  ConflictDetailDrawer,
  EmailDrawer,
  MeetingDrawer,
  SourcePreviewDrawer,
  PrepareResponseModal,
  VoiceModal,
  AttachmentModal,
  HistoryDrawer,
} from './DetailDrawers';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface AskMyWorldViewProps {
  onNavigate?: (pageId: string) => void;
  onOpenConnector?: (connectorId: string) => void;
  className?: string;
}

export const AskMyWorldView: React.FC<AskMyWorldViewProps> = ({
  onNavigate,
  onOpenConnector,
  className,
}) => {
  const { addToast } = useToast();
  const [conversations, setConversations] = useState<AskConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    'conv-project-alpha'
  );
  const [isDeepResearch, setIsDeepResearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Layout states
  const [isContextRailOpen, setIsContextRailOpen] = useState(true);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Interactive drawers and modal states
  const [isConflictDrawerOpen, setIsConflictDrawerOpen] = useState(false);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
  const [selectedSourceForPreview, setSelectedSourceForPreview] = useState<SourceItem | null>(null);
  const [isPrepareResponseOpen, setIsPrepareResponseOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Handle New Conversation
  const handleNewConversation = () => {
    setActiveConversationId(null);
    addToast({
      type: 'info',
      title: 'New Conversation Started',
      description: 'Ask any question across your workspace apps.',
    });
  };

  // Handle Sending a Prompt
  const handleSendPrompt = (text: string) => {
    const timestamp = 'Just now';
    const userMsg: AskMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp,
    };

    let convId = activeConversationId;
    let updatedConvs = [...conversations];

    if (!convId) {
      const newConv: AskConversation = {
        id: `conv-${Date.now()}`,
        title: text.length > 28 ? `${text.substring(0, 28)}...` : text,
        updatedAt: 'Just now',
        previewText: text,
        messages: [userMsg],
      };
      updatedConvs.unshift(newConv);
      convId = newConv.id;
      setActiveConversationId(convId);
      setConversations(updatedConvs);
    } else {
      updatedConvs = updatedConvs.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            updatedAt: 'Just now',
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      });
      setConversations(updatedConvs);
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Determine mock AI response based on query
      let aiData = MOCK_PROJECT_ALPHA_RESPONSE;
      const lower = text.toLowerCase();

      if (lower.includes('risk')) {
        aiData = MOCK_RISK_RESPONSE;
      } else if (lower.includes('source')) {
        aiData = MOCK_SOURCES_RESPONSE;
      } else if (lower.includes('summar')) {
        aiData = MOCK_SUMMARIZE_RESPONSE;
      }

      const aiMsg: AskMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiData.summaryText,
        timestamp: 'Just now',
        aiData,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              messages: [...c.messages, aiMsg],
            };
          }
          return c;
        })
      );
    }, 600);
  };

  // Handle pending command from Home
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pendingCommand = sessionStorage.getItem('pending_ask_command');
      if (pendingCommand) {
        sessionStorage.removeItem('pending_ask_command');
        // Let state initialize, then send
        setTimeout(() => {
          setActiveConversationId(null);
          handleSendPrompt(pendingCommand);
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Finding Action Clicks
  const handleFindingAction = (finding: FindingItem) => {
    switch (finding.actionType) {
      case 'review_conflict':
        setIsConflictDrawerOpen(true);
        break;
      case 'open_conversation':
        setIsEmailDrawerOpen(true);
        break;
      case 'view_meeting':
        setIsMeetingDrawerOpen(true);
        break;
      default:
        setIsConflictDrawerOpen(true);
        break;
    }
  };

  // Handle Context Entities
  const handleSelectEntity = (entity: ContextEntity) => {
    if (entity.type === 'person') {
      setIsEmailDrawerOpen(true);
    } else if (entity.type === 'event') {
      setIsMeetingDrawerOpen(true);
    } else if (entity.type === 'project') {
      setIsConflictDrawerOpen(true);
    } else {
      setSelectedSourceForPreview(MOCK_SOURCES[0]);
    }
  };

  // Handle Related Items
  const handleSelectRelated = (item: RelatedItem) => {
    const match = MOCK_SOURCES.find((s) => s.connector === item.connector);
    if (match) {
      setSelectedSourceForPreview(match);
    } else {
      setSelectedSourceForPreview(MOCK_SOURCES[0]);
    }
  };

  return (
    <div className={cn('relative flex flex-col min-h-screen font-sans', className)}>
      {/* Subtle Orbital Visual Atmosphere Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        {/* Soft Radial Gradient Ambient Glows */}
        <div className="absolute top-12 left-1/4 w-96 h-96 rounded-full bg-indigo-200/15 blur-3xl" />
        <div className="absolute top-48 right-1/4 w-80 h-80 rounded-full bg-purple-200/15 blur-3xl" />

        {/* Ambient SVG Orbital Paths */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 280 C 300 200, 700 350, 1400 220"
            fill="none"
            stroke="rgba(99,102,241,0.12)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <path
            d="M 100 480 C 500 400, 900 520, 1600 420"
            fill="none"
            stroke="rgba(168,85,247,0.10)"
            strokeWidth="1.2"
          />
          {/* Subtle Light Point Orbitals */}
          <circle cx="620" cy="245" r="2.5" fill="#818cf8" className="animate-pulse" />
          <circle cx="1120" cy="230" r="2" fill="#a855f7" />
          <circle cx="480" cy="415" r="2" fill="#6366f1" />
        </svg>
      </div>

      {/* 1. Header Bar */}
      <AskMyWorldHeader
        onNewConversation={handleNewConversation}
        onToggleHistory={() => setIsHistoryDrawerOpen(true)}
        onToggleContextRail={() => setIsContextRailOpen(!isContextRailOpen)}
        isContextRailOpen={isContextRailOpen}
        onOpenNotifications={() =>
          addToast({
            type: 'info',
            title: 'Notifications',
            description: 'All workspace connectors are currently synced and up to date.',
          })
        }
      />

      {/* 2. Main Body Layout (Center Workspace + Right Context Rail) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start justify-between min-w-0 pt-2 pb-6">
        {/* Main Conversation Column */}
        <div className="flex-1 flex flex-col min-w-0 w-full max-w-4xl space-y-4">
          {/* Messages Feed */}
          {activeConv && activeConv.messages.length > 0 ? (
            <div className="space-y-6">
              {activeConv.messages.map((msg) => {
                if (msg.sender === 'user') {
                  return (
                    <UserMessage
                      key={msg.id}
                      text={msg.text}
                      timestamp={msg.timestamp}
                    />
                  );
                }

                if (msg.sender === 'ai' && msg.aiData) {
                  return (
                    <AIResponse
                      key={msg.id}
                      data={msg.aiData}
                      onSelectFindingAction={handleFindingAction}
                      onSelectSource={(src) => setSelectedSourceForPreview(src)}
                      onPrepareResponse={() => setIsPrepareResponseOpen(true)}
                    />
                  );
                }

                return null;
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <EmptyAskState onSelectSuggestion={handleSendPrompt} />
          )}

          {/* Persistent Anchored Composer */}
          <div className="pt-2 sticky bottom-3 z-10">
            <AskComposer
              onSend={handleSendPrompt}
              onOpenAttachModal={() => setIsAttachModalOpen(true)}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              isDeepResearch={isDeepResearch}
              onToggleDeepResearch={() => {
                setIsDeepResearch(!isDeepResearch);
                addToast({
                  type: 'info',
                  title: isDeepResearch ? 'Deep Research Disabled' : 'Deep Research Enabled',
                  description: isDeepResearch
                    ? 'Returned to standard query speed.'
                    : 'Nexorbit will perform multi-hop cross-reference synthesis.',
                });
              }}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Right Context Rail (Desktop visible when open, collapses smoothly) */}
        {isContextRailOpen && (
          <div className="w-full lg:w-72 xl:w-80 shrink-0 animate-fadeIn">
            <ContextRail
              onSelectEntity={handleSelectEntity}
              onSelectRelated={handleSelectRelated}
              onSelectFollowUp={handleSendPrompt}
            />
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 3. Interactive Modals & Drawers */}
      {/* ========================================== */}

      {/* Conflict Detail Drawer */}
      <ConflictDetailDrawer
        isOpen={isConflictDrawerOpen}
        onClose={() => setIsConflictDrawerOpen(false)}
        onPrepareResponse={() => setIsPrepareResponseOpen(true)}
        onOpenSource={(src) => setSelectedSourceForPreview(src)}
        sources={MOCK_SOURCES.slice(0, 3)}
      />

      {/* Email Thread Drawer */}
      <EmailDrawer
        isOpen={isEmailDrawerOpen}
        onClose={() => setIsEmailDrawerOpen(false)}
        onPrepareReply={() => setIsPrepareResponseOpen(true)}
      />

      {/* Meeting Detail Drawer */}
      <MeetingDrawer
        isOpen={isMeetingDrawerOpen}
        onClose={() => setIsMeetingDrawerOpen(false)}
      />

      {/* Source Preview Drawer */}
      <SourcePreviewDrawer
        source={selectedSourceForPreview}
        onClose={() => setSelectedSourceForPreview(null)}
      />

      {/* Prepare Response Workflow Modal */}
      <PrepareResponseModal
        isOpen={isPrepareResponseOpen}
        onClose={() => setIsPrepareResponseOpen(false)}
      />

      {/* Voice Mode Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSubmitVoice={handleSendPrompt}
      />

      {/* Attachment Modal */}
      <AttachmentModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        onAttachFile={(fileName) =>
          addToast({
            type: 'info',
            title: 'File Attached',
            description: `Attached ${fileName} to query context.`,
          })
        }
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => setActiveConversationId(id)}
        onNewChat={handleNewConversation}
      />
    </div>
  );
};
