'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ChatHeader } from './ChatHeader';
import { UserMessage, AssistantMessage, TypingIndicator } from './MessageItem';
import { ChatComposer } from './ChatComposer';
import { RenameModal } from './RenameModal';
import { useAuth } from '../auth/AuthContext';
import { ChatAttachment } from './types';
import { getStoredSettings } from '../../services/settings/settingsService';
import { detectImageIntent } from '../../services/ai/imageIntent';
import {
  createNewConversation,
  addMessageToConversation,
  renameConversationTitle,
  archiveConversationById,
  deleteConversationById,
  subscribeToAllConversations,
  subscribeToConversationMessages,
  Conversation,
  ChatMessage,
} from '../../services/chat/storage';

export interface ChatViewProps {
  onNavigate?: (pageId: string) => void;
  initialMode?: string;
  initialQuery?: string;
  activeConversationId?: string | null;
  onSelectConversation?: (id: string | null) => void;
  onConversationsChange?: (convs: Array<{ id: string; title: string; time?: string; type?: 'chat' | 'agent' }>) => void;
  className?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  onNavigate,
  initialMode = 'Auto',
  initialQuery = '',
  activeConversationId: externalActiveConvId,
  onSelectConversation,
  onConversationsChange,
  className,
}) => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [internalActiveConvId, setInternalActiveConvId] = useState<string | null>(null);
  const activeConvId = externalActiveConvId !== undefined ? externalActiveConvId : internalActiveConvId;

  const setActiveConvId = useCallback(
    (id: string | null) => {
      setInternalActiveConvId(id);
      if (onSelectConversation) onSelectConversation(id);
    },
    [onSelectConversation]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingResponse, setStreamingResponse] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<string>(initialMode);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialProcessRun = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Stop active generation cleanly
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsThinking(false);
    setStreamingResponse(null);
    setSearchStatus(null);
  }, []);

  // Auto-scroll to bottom of message area
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isUserScrolledUp) {
      scrollToBottom();
    }
  }, [messages, isThinking, isUserScrolledUp, scrollToBottom]);

  // Handle scroll detection for 'New response' button
  const handleScroll = () => {
    if (!mainScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainScrollRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setIsUserScrolledUp(isScrolledUp);
  };

  const onConversationsChangeRef = useRef(onConversationsChange);
  useEffect(() => {
    onConversationsChangeRef.current = onConversationsChange;
  }, [onConversationsChange]);

  // Subscribe to all conversations
  useEffect(() => {
    const unsubscribe = subscribeToAllConversations(user?.uid || null, (allConvs) => {
      setConversations(allConvs);
      if (onConversationsChangeRef.current) {
        onConversationsChangeRef.current(
          allConvs.map((c) => ({
            id: c.id,
            title: c.title,
            time: c.updatedAt,
            type: c.type,
          }))
        );
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Subscribe to messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;

    const unsubscribe = subscribeToConversationMessages(
      activeConvId,
      user?.uid || null,
      (fetchedMsgs) => {
        setMessages(fetchedMsgs);
      }
    );

    return () => unsubscribe();
  }, [activeConvId, user?.uid]);

  // Handle image generation
  const handleGenerateImage = useCallback(
    async (
      prompt: string,
      options?: { style?: string; aspectRatio?: string },
      targetConvId?: string | null
    ) => {
      if (isThinking || streamingResponse !== null) return;

      setIsThinking(true);
      setStreamingResponse(null);
      setSearchStatus(null);

      let convId = targetConvId || activeConvId;

      // 1. Create conversation if none exists
      if (!convId) {
        const cleanPrompt = prompt.trim();
        const titleText = cleanPrompt.length > 36 ? cleanPrompt.substring(0, 36) + '...' : cleanPrompt;
        const createdConv = await createNewConversation(
          user?.uid || null,
          titleText,
          'chat',
          currentMode
        );
        convId = createdConv.id;
        setActiveConvId(convId);
      }

      // 2. Add User Message (Preserving user's exact natural prompt)
      const displayPrompt = prompt.trim();
      await addMessageToConversation(
        convId,
        user?.uid || null,
        'user',
        displayPrompt
      );

      const controller = new AbortController();
      abortControllerRef.current = controller;

      // 3. Call Image API
      try {
        const res = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            prompt: displayPrompt,
            style: options?.style,
            aspectRatio: options?.aspectRatio,
            userId: user?.uid,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Image generation failed');
        }

        const data = await res.json();

        if (data.error || !data.imageUrl) {
          throw new Error(data.error || 'Image generation failed');
        }

        // 4. Add AI Response with generated Image
        await addMessageToConversation(
          convId,
          user?.uid || null,
          'ai',
          '',
          undefined,
          undefined,
          data.imageUrl,
          displayPrompt,
          options?.style,
          options?.aspectRatio
        );
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
        console.error('Image Generation Error:', err);
        await addMessageToConversation(
          convId,
          user?.uid || null,
          'ai',
          "Couldn't generate the image. Please try again.",
          undefined,
          undefined,
          undefined,
          displayPrompt,
          options?.style,
          options?.aspectRatio,
          true
        );
      } finally {
        abortControllerRef.current = null;
        setIsThinking(false);
        setSearchStatus(null);
      }
    },
    [activeConvId, currentMode, isThinking, streamingResponse, user?.uid, setActiveConvId]
  );

  // Execute AI query (handles both initial and follow-up messages on SAME conversation)
  const executeQuery = useCallback(
    async (
      queryText: string,
      targetConvId?: string | null,
      pendingAttachments?: ChatAttachment[],
      useWebSearch?: boolean
    ) => {
      const activeAttachments = pendingAttachments !== undefined ? pendingAttachments : attachments;
      if ((!queryText.trim() && activeAttachments.length === 0) || isThinking || streamingResponse !== null) return;

      let convId = targetConvId || activeConvId;

      // 0. Detect Image Generation Intent directly from natural language
      if (!useWebSearch && (!activeAttachments || activeAttachments.length === 0) && queryText.trim()) {
        const imageIntent = detectImageIntent(queryText);
        if (imageIntent.isImageIntent) {
          await handleGenerateImage(imageIntent.cleanedPrompt, undefined, convId);
          return;
        }
      }

      setIsThinking(true);
      setStreamingResponse(null);

      // 1. Process files if any
      const attachmentsToProcess = [...activeAttachments];
      const processedAttachments: ChatAttachment[] = [];

      if (attachmentsToProcess.length > 0) {
        setSearchStatus('Processing files...');
        for (const attachment of attachmentsToProcess) {
          if (attachment.content) {
            processedAttachments.push(attachment);
            continue;
          }

          if (!attachment.file) {
            console.warn(`Attachment ${attachment.name} missing File object`);
            processedAttachments.push(attachment);
            continue;
          }

          try {
            setSearchStatus(`Analyzing ${attachment.name}...`);
            const formData = new FormData();
            formData.append('file', attachment.file);
            formData.append('userId', user?.uid || 'anonymous');

            const extractRes = await fetch('/api/files/extract', {
              method: 'POST',
              body: formData,
            });

            if (!extractRes.ok) {
              const errData = await extractRes.json();
              throw new Error(errData.error || 'Extraction failed');
            }

            const extractData = await extractRes.json();
            processedAttachments.push({
              ...attachment,
              content: extractData.data.content,
            });
          } catch (err: any) {
            console.error(`Error extracting file ${attachment.name}:`, err);
            // We can still send the message but maybe notify the user
            processedAttachments.push(attachment);
          }
        }
      }

      setSearchStatus(useWebSearch ? 'Searching the web...' : null);

      // 2. Create a real conversation if none exists
      if (!convId) {
        const titleText = queryText.trim()
          ? (queryText.trim().length > 36 ? queryText.trim().substring(0, 36) + '...' : queryText.trim())
          : (processedAttachments[0]?.name || 'Attached file');

        const createdConv = await createNewConversation(
          user?.uid || null,
          titleText,
          'chat',
          currentMode
        );
        convId = createdConv.id;
        setActiveConvId(convId);
      }

      const displayPrompt = queryText.trim() || `[Attached ${processedAttachments.length} file(s): ${processedAttachments.map(a => a.name).join(', ')}]`;

      // 3. Add User Message
      await addMessageToConversation(
        convId,
        user?.uid || null,
        'user',
        displayPrompt,
        undefined,
        processedAttachments.length > 0 ? processedAttachments : undefined
      );

      const promptForApi = queryText.trim() || `I have attached ${processedAttachments.length} file(s). Please analyze or assist me based on their content.`;

      // 4. Fetch AI Response (Streamed from Groq)
      try {
        // Collect all previous file contents for context
        const fileContexts: any[] = [];
        
        // Check current attachments
        processedAttachments.forEach(att => {
          if (att.content) {
            fileContexts.push({ name: att.name, content: att.content });
          }
        });

        // Check history for file contents (to support follow-ups)
        messages.forEach(m => {
          if (m.attachments) {
            m.attachments.forEach(att => {
              if (att.content && !fileContexts.some(f => f.name === att.name)) {
                fileContexts.push({ name: att.name, content: att.content });
              }
            });
          }
        });

        const historyForApi = messages.map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

        const userSettings = getStoredSettings();

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            prompt: promptForApi,
            messages: historyForApi.concat({ sender: 'user', text: promptForApi }),
            mode: currentMode.toLowerCase(),
            webSearchEnabled: useWebSearch,
            attachments: fileContexts, // Send all relevant file context
            userId: user?.uid,
            memoryEnabled: userSettings.memoryEnabled,
          }),
        });

        if (!res.ok) {
          throw new Error('API request failed');
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error('No body stream reader available');
        }

        const decoder = new TextDecoder();
        let done = false;
        let accumulatedText = '';
        let extractedSources: any[] = [];
        let parsingSources = true;
        setStreamingResponse('');

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            accumulatedText += chunk;

            if (parsingSources) {
              const separatorIdx = accumulatedText.indexOf('|||__SOURCES_END__|||');
              if (separatorIdx !== -1) {
                const sourcesJson = accumulatedText.substring(0, separatorIdx);
                try {
                  extractedSources = JSON.parse(sourcesJson);
                } catch (e) {}
                accumulatedText = accumulatedText.substring(separatorIdx + 21);
                parsingSources = false;
              } else if (!accumulatedText.startsWith('[') || accumulatedText.length > 8192) {
                // Regular response text without sources preamble
                parsingSources = false;
              }
            }

            if (!parsingSources) {
              setStreamingResponse(accumulatedText);
              // Turn off thinking state once we get the first chunk of text
              if (accumulatedText.trim().length > 0) {
                setIsThinking(false);
                setSearchStatus(null);
              }
            }
          }
        }

        // If for some reason we finished but accumulatedText is empty, provide a fallback
        const finalResponseText = accumulatedText.trim() || 'I received your request. Let me know if you need anything else.';

        await addMessageToConversation(
          convId,
          user?.uid || null,
          'ai',
          finalResponseText,
          extractedSources.length > 0 ? extractedSources : undefined
        );
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // User stopped generation intentionally
          return;
        }
        console.error('Error in executeQuery API call:', err);
        await addMessageToConversation(
          convId,
          user?.uid || null,
          'ai',
          'Something went wrong. Please try again.'
        );
      } finally {
        abortControllerRef.current = null;
        setStreamingResponse(null);
        setIsThinking(false);
        setSearchStatus(null);
      }
    },
    [activeConvId, currentMode, isThinking, streamingResponse, messages, user, attachments, setActiveConvId, handleGenerateImage]
  );

  // Process pending ask command from Home screen composer
  useEffect(() => {
    if (isInitialProcessRun.current) return;

    let pendingQuery = initialQuery;
    let pendingMode = initialMode;
    let pendingWebSearch = false;
    let pendingImageStyle: string | null = null;
    let pendingImageRatio: string | null = null;

    if (typeof window !== 'undefined') {
      const storedQuery = sessionStorage.getItem('pending_ask_command');
      const storedMode = sessionStorage.getItem('pending_chat_mode');
      const storedSearch = sessionStorage.getItem('pending_web_search');
      const storedImageStyle = sessionStorage.getItem('pending_image_style');
      const storedImageRatio = sessionStorage.getItem('pending_image_ratio');

      if (storedQuery) {
        pendingQuery = storedQuery;
        sessionStorage.removeItem('pending_ask_command');
      }
      if (storedMode) {
        pendingMode = storedMode;
        sessionStorage.removeItem('pending_chat_mode');
      }
      if (storedSearch) {
        pendingWebSearch = true;
        sessionStorage.removeItem('pending_web_search');
      }
      if (storedImageStyle) {
        pendingImageStyle = storedImageStyle;
        sessionStorage.removeItem('pending_image_style');
      }
      if (storedImageRatio) {
        pendingImageRatio = storedImageRatio;
        sessionStorage.removeItem('pending_image_ratio');
      }
    }

    if (pendingQuery && pendingQuery.trim()) {
      isInitialProcessRun.current = true;
      const clean = pendingQuery.trim();

      (async () => {
        const titleText = clean.length > 36 ? clean.substring(0, 36) + '...' : clean;
        const newConv = await createNewConversation(
          user?.uid || null,
          titleText,
          'chat',
          pendingMode
        );
        setActiveConvId(newConv.id);
        if (pendingWebSearch) {
          setWebSearchEnabled(true);
        }

        if (pendingImageStyle || pendingImageRatio) {
          await handleGenerateImage(clean, { style: pendingImageStyle || undefined, aspectRatio: pendingImageRatio || undefined }, newConv.id);
        } else {
          await executeQuery(clean, newConv.id, undefined, pendingWebSearch);
        }
      })();
    }
  }, [initialQuery, initialMode, user?.uid, executeQuery, handleGenerateImage, setActiveConvId]);

  // Handle composer submission in Chat Workspace
  const handleComposerSubmit = (e?: React.FormEvent, submitAttachments?: any[], useWebSearch?: boolean) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;

    const query = inputText.trim();
    const currentAttachments = submitAttachments || [...attachments];
    setInputText('');
    setAttachments([]);
    // Turn off explicit web search after submit to prevent accidental consecutive searches if desired, or keep it on. The prompt: "If the user explicitly turns Web Search ON: use search for that message. If the user turns it OFF: return to normal Chat." Usually it resets or stays. I will keep it on if user enabled it.

    executeQuery(query, null, currentAttachments, useWebSearch !== undefined ? useWebSearch : webSearchEnabled);
  };

  // Header Title
  const activeConversationObj = conversations.find((c) => c.id === activeConvId);
  const currentConvTitle =
    activeConversationObj?.title ||
    (messages.length > 0 && messages[0].text
      ? messages[0].text.length > 36
        ? messages[0].text.substring(0, 36) + '...'
        : messages[0].text
      : 'New Chat');

  // Handle Header Actions
  const handleRenameSave = async (newTitle: string) => {
    if (activeConvId) {
      await renameConversationTitle(activeConvId, newTitle);
    }
  };

  const handleArchiveConversation = async () => {
    if (activeConvId) {
      await archiveConversationById(activeConvId);
      const remaining = conversations.filter((c) => c.id !== activeConvId);
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
      } else {
        setActiveConvId(null);
        if (onNavigate) onNavigate('home');
      }
    }
  };

  const handleDeleteConversation = async () => {
    if (activeConvId) {
      const idToDelete = activeConvId;
      await deleteConversationById(idToDelete);
      const remaining = conversations.filter((c) => c.id !== idToDelete);
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
      } else {
        setActiveConvId(null);
        if (onNavigate) onNavigate('home');
      }
    }
  };

  return (
    <div
      className={cn(
        'w-full h-screen flex flex-col bg-[#000000] text-[#ECECF1] font-sans overflow-hidden select-none relative',
        className
      )}
    >
      {/* Fixed Top Header */}
      <ChatHeader
        title={currentConvTitle}
        onNavigateHome={() => onNavigate && onNavigate('home')}
        onRename={() => setIsRenameModalOpen(true)}
        onMoveToProject={handleArchiveConversation}
        onArchive={handleArchiveConversation}
        onDelete={handleDeleteConversation}
      />

      {/* Scrollable Message Stream */}
      <main
        ref={mainScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin relative"
      >
        <div className="max-w-3xl mx-auto space-y-0">
          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
              {msg.sender === 'user' ? (
                <UserMessage
                  message={msg}
                  userInitial={
                    user?.displayName
                      ? user.displayName.substring(0, 2).toUpperCase()
                      : user?.email
                      ? user.email.substring(0, 2).toUpperCase()
                      : 'SO'
                  }
                  userName={
                    user?.displayName ||
                    user?.email?.split('@')[0] ||
                    'You'
                  }
                />
              ) : (
                <AssistantMessage
                  message={msg}
                  onRegenerate={() => {
                    // Find the last user message to use as prompt
                    const msgIndex = messages.indexOf(msg);
                    const lastUserMsg = messages
                      .slice(0, msgIndex >= 0 ? msgIndex : messages.length)
                      .reverse()
                      .find((m) => m.sender === 'user');
                    
                    if (msg.imageUrl || msg.isImageError) {
                      const promptToUse = msg.imagePrompt || lastUserMsg?.text || '';
                      if (promptToUse) {
                        const imageIntent = detectImageIntent(promptToUse);
                        const cleanPrompt = imageIntent.isImageIntent ? imageIntent.cleanedPrompt : promptToUse;
                        handleGenerateImage(cleanPrompt, { style: msg.imageStyle, aspectRatio: msg.imageAspectRatio });
                        return;
                      }
                    }

                    if (lastUserMsg) {
                      const imageIntent = !webSearchEnabled ? detectImageIntent(lastUserMsg.text) : { isImageIntent: false, cleanedPrompt: lastUserMsg.text };
                      if (imageIntent.isImageIntent) {
                        handleGenerateImage(imageIntent.cleanedPrompt);
                      } else {
                        executeQuery(lastUserMsg.text, activeConvId);
                      }
                    }
                  }}
                />
              )}
            </React.Fragment>
          ))}

          {/* Streaming Response */}
          {streamingResponse !== null && (
            <div className="space-y-2 mt-0 mb-2">
              <TypingIndicator isStreaming={true} />
              <AssistantMessage
                message={{
                  id: 'streaming-temp',
                  sender: 'ai',
                  text: streamingResponse,
                  timestamp: '',
                }}
              />
            </div>
          )}

          {/* Request / Sending State Dot (when thinking and not streaming yet) */}
          {isThinking && streamingResponse === null && (
            <TypingIndicator status={searchStatus} isStreaming={false} />
          )}

          {/* Empty State if no messages yet */}
          {messages.length === 0 && !isThinking && streamingResponse === null && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Start a Conversation with Nexorbit
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Ask questions, generate ideas, analyze code, or perform tasks with your AI workspace assistant.
              </p>
            </div>
          )}

          <div ref={messagesEndRef} className="h-10 sm:h-14" />
        </div>
      </main>

      {/* Floating 'New response' scroll button */}
      {isUserScrolledUp && (
        <button
          type="button"
          onClick={() => {
            setIsUserScrolledUp(false);
            scrollToBottom();
          }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xl flex items-center gap-1.5 z-20 animate-bounce cursor-pointer transition-all"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          <span>New response</span>
        </button>
      )}

      {/* Fixed Bottom Composer */}
      <footer className="shrink-0 px-4 sm:px-6 pb-4 pt-2 bg-[#000000] border-t border-white/[0.05] z-10">
        <ChatComposer
          inputText={inputText}
          onChangeText={setInputText}
          onSubmit={handleComposerSubmit}
          attachments={attachments}
          onAddAttachments={(files) =>
            setAttachments((prev) => [...prev, ...files])
          }
          onRemoveAttachment={(id) =>
            setAttachments((prev) => prev.filter((a) => a.id !== id))
          }
          isThinking={isThinking || streamingResponse !== null}
          onStop={handleStopGeneration}
          webSearchEnabled={webSearchEnabled}
          onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
          onGenerateImage={handleGenerateImage}
        />
      </footer>

      {/* Rename Conversation Modal */}
      <RenameModal
        isOpen={isRenameModalOpen}
        currentTitle={currentConvTitle}
        onClose={() => setIsRenameModalOpen(false)}
        onSave={handleRenameSave}
      />
    </div>
  );
};
