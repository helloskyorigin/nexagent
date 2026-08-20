'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../ui/Toast';
import {
  Mail,
  Search,
  RefreshCw,
  Star,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Paperclip,
  CheckCircle2,
  Clock,
  User,
  Inbox,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  fromName: string;
  fromEmail: string;
  to: string;
  date: string;
  timestamp: number;
  snippet: string;
  isUnread: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labelIds: string[];
  hasAttachments: boolean;
  bodySnippet?: string;
  bodyHtml?: string;
  bodyText?: string;
}

export interface GmailInboxViewerProps {
  isOpen: boolean;
  onClose: () => void;
  accountEmail?: string;
  onRequestDisconnect?: () => void;
}

type FilterTab = 'INBOX' | 'UNREAD' | 'STARRED' | 'IMPORTANT' | 'ALL';

export const GmailInboxViewer: React.FC<GmailInboxViewerProps> = ({
  isOpen,
  onClose,
  accountEmail,
  onRequestDisconnect,
}) => {
  const { user, getIdToken } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<FilterTab>('INBOX');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileStats, setProfileStats] = useState<{ messagesTotal?: number; emailAddress?: string } | null>(null);

  const fetchEmails = useCallback(
    async (label: FilterTab, query: string, pageToken?: string, isAppend = false) => {
      if (!user) return;
      if (isAppend) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setErrorMessage(null);
      }

      try {
        const idToken = await getIdToken();
        const params = new URLSearchParams();

        if (label !== 'ALL') {
          params.set('label', label);
        }
        if (query.trim()) {
          params.set('q', query.trim());
        }
        if (pageToken) {
          params.set('pageToken', pageToken);
        }
        params.set('maxResults', '15');

        const res = await fetch(`/api/connectors/gmail/messages?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch Gmail messages.');
        }

        const data = await res.json();
        if (data.success && data.data) {
          const fetchedList = (data.data.messages || []) as GmailMessage[];
          if (isAppend) {
            setMessages((prev) => [...prev, ...fetchedList]);
          } else {
            setMessages(fetchedList);
          }
          setNextPageToken(data.data.nextPageToken);
        }
      } catch (err: any) {
        console.error('Fetch Gmail error:', err);
        setErrorMessage(err.message || 'Failed to load inbox emails.');
        addToast({
          type: 'error',
          title: 'Gmail Fetch Error',
          description: err.message || 'Could not load messages from Gmail.',
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user, addToast, getIdToken]
  );

  // Load profile stats and emails when opened or tab changes
  useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    let isMounted = true;

    const loadInbox = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const idToken = await getIdToken();
        const params = new URLSearchParams();

        if (activeTab !== 'ALL') {
          params.set('label', activeTab);
        }
        if (searchQuery.trim()) {
          params.set('q', searchQuery.trim());
        }
        params.set('maxResults', '15');

        const [msgRes, profRes] = await Promise.all([
          fetch(`/api/connectors/gmail/messages?${params.toString()}`, {
            headers: { Authorization: `Bearer ${idToken}` },
          }),
          fetch('/api/connectors/gmail/profile', {
            headers: { Authorization: `Bearer ${idToken}` },
          }).catch(() => null),
        ]);

        if (!isMounted) return;

        if (profRes && profRes.ok) {
          const profData = await profRes.json();
          if (profData?.success && profData?.data) {
            setProfileStats(profData.data);
          }
        }

        if (!msgRes.ok) {
          const errData = await msgRes.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch Gmail messages.');
        }

        const data = await msgRes.json();
        if (isMounted && data.success && data.data) {
          setMessages(data.data.messages || []);
          setNextPageToken(data.data.nextPageToken);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Fetch Gmail error:', err);
        setErrorMessage(err.message || 'Failed to load inbox emails.');
        addToast({
          type: 'error',
          title: 'Gmail Fetch Error',
          description: err.message || 'Could not load messages from Gmail.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInbox();

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, searchQuery, user, addToast, getIdToken]);

  // Fetch single message detail if clicked
  const handleOpenMessage = async (msg: GmailMessage) => {
    setSelectedMessage(msg);
    if (!user) return;

    setLoadingDetail(true);
    try {
      const idToken = await getIdToken();
      const res = await fetch(`/api/connectors/gmail/messages/${msg.id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.ok) {
        const detailData = await res.json();
        if (detailData.success && detailData.data) {
          setSelectedMessage(detailData.data);
        }
      }
    } catch (err) {
      console.warn('Failed to load full body, using snippet fallback:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmails(activeTab, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchEmails(activeTab, '');
  };

  const getSenderInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gmail Production Explorer"
      description="Live Read-Only Google Workspace Connection"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">Protected by AES-256 encrypted credential store</span>
            <span className="sm:hidden">Encrypted Read-Only</span>
          </div>

          <div className="flex items-center gap-2">
            {onRequestDisconnect && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRequestDisconnect}
                className="text-rose-600 hover:bg-rose-50 text-xs font-semibold"
              >
                Disconnect
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-medium">
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* TOP STATUS BANNER */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-blue-200/80 shadow-2xs text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {accountEmail || 'Connected Gmail Account'}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Scope: <code className="text-slate-700 bg-white/60 px-1 py-0.5 rounded">https://www.googleapis.com/auth/gmail.readonly</code>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchEmails(activeTab, searchQuery)}
            disabled={loading}
            leftIcon={<RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin text-blue-600')} />}
            className="bg-white hover:bg-slate-50 border-blue-200 text-slate-700 text-xs font-semibold h-8 rounded-xl shrink-0"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* SINGLE MESSAGE VIEW (IF SELECTED) */}
        {selectedMessage ? (
          <div className="space-y-4 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to message list</span>
              </button>

              <a
                href={`https://mail.google.com/mail/u/0/#inbox/${selectedMessage.id}`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Open in Gmail Web</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Email Header */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedMessage.subject || '(No Subject)'}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedMessage.isStarred && (
                    <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                      <Star className="h-4 w-4 fill-amber-400" />
                    </span>
                  )}
                  {selectedMessage.isImportant && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                      Important
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {getSenderInitials(selectedMessage.fromName)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{selectedMessage.fromName}</span>
                    <span className="text-slate-400 ml-1.5 text-[11px]">&lt;{selectedMessage.fromEmail}&gt;</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{selectedMessage.date}</span>
                </div>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs min-h-[220px] max-h-[380px] overflow-y-auto space-y-3">
              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-xs font-medium">Fetching email payload securely...</span>
                </div>
              ) : selectedMessage.bodyHtml ? (
                <div
                  className="prose prose-xs max-w-none text-slate-800 text-xs leading-relaxed overflow-x-auto break-words"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedMessage.bodyHtml) }}
                />
              ) : (
                <pre className="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.bodyText || selectedMessage.snippet}
                </pre>
              )}
            </div>

            {/* READ ONLY DISCLAIMER */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                Read-Only Session: Nexorbit securely fetches email context for queries without modifying your account.
              </span>
            </div>
          </div>
        ) : (
          /* INBOX LIST VIEW */
          <div className="space-y-3">
            {/* SEARCH BAR & FILTER TABS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Gmail messages (e.g. from:stripe, invoice, meeting)..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* TABS */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
                {(
                  [
                    { id: 'INBOX', label: 'Inbox' },
                    { id: 'UNREAD', label: 'Unread' },
                    { id: 'STARRED', label: 'Starred' },
                    { id: 'IMPORTANT', label: 'Important' },
                    { id: 'ALL', label: 'All' },
                  ] as { id: FilterTab; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                      activeTab === tab.id
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR MESSAGE IF ANY */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Unable to fetch emails</p>
                  <p className="text-rose-600">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* MESSAGES LIST */}
            <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
              {loading && messages.length === 0 ? (
                <div className="py-14 text-center space-y-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs font-medium text-slate-500">Querying real Gmail API messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-2">
                  <Inbox className="h-8 w-8 text-slate-300 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-800">No emails found</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    {searchQuery
                      ? `No messages matched the search "${searchQuery}" in ${activeTab}.`
                      : `Your ${activeTab.toLowerCase()} folder currently has no recent messages.`}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={cn(
                      'p-3.5 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group select-none',
                      msg.isUnread ? 'bg-blue-50/20' : 'bg-white'
                    )}
                  >
                    {/* Unread dot or Star */}
                    <div className="pt-1 shrink-0 flex items-center gap-1.5">
                      {msg.isUnread ? (
                        <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-transparent shrink-0" />
                      )}

                      <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                        {getSenderInitials(msg.fromName)}
                      </div>
                    </div>

                    {/* Email summary info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              'text-xs truncate tracking-tight',
                              msg.isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                            )}
                          >
                            {msg.fromName}
                          </span>
                          {msg.hasAttachments && (
                            <Paperclip className="h-3 w-3 text-slate-400 shrink-0" title="Has attachment" />
                          )}
                        </div>

                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap shrink-0">
                          {msg.date}
                        </span>
                      </div>

                      <h5
                        className={cn(
                          'text-xs truncate',
                          msg.isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'
                        )}
                      >
                        {msg.subject || '(No Subject)'}
                      </h5>

                      <p className="text-[11px] text-slate-500 line-clamp-1 font-normal leading-relaxed">
                        {msg.snippet}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* LOAD MORE BUTTON */}
            {nextPageToken && (
              <div className="text-center pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchEmails(activeTab, searchQuery, nextPageToken, true)}
                  disabled={loadingMore}
                  leftIcon={loadingMore ? <RefreshCw className="h-3 w-3 animate-spin" /> : undefined}
                  className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border-slate-200 rounded-xl"
                >
                  {loadingMore ? 'Loading more...' : 'Load more emails'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
