'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../ui/Toast';
import {
  File,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Folder,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  HardDrive,
  Download,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
  thumbnailLink?: string;
}

export interface DriveViewerProps {
  isOpen: boolean;
  onClose: () => void;
  accountEmail?: string;
  onRequestDisconnect?: () => void;
}

export const DriveViewer: React.FC<DriveViewerProps> = ({
  isOpen,
  onClose,
  accountEmail,
  onRequestDisconnect,
}) => {
  const { user, getIdToken } = useAuth();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchFiles = useCallback(
    async (query: string, pageToken?: string, isAppend = false) => {
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

        if (query.trim()) {
          params.set('q', `name contains '${query.trim()}'`);
        }
        if (pageToken) {
          params.set('pageToken', pageToken);
        }
        params.set('pageSize', '20');

        const res = await fetch(`/api/connectors/drive/files?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch Google Drive files.');
        }

        const data = await res.json();
        if (data.success && data.data) {
          const fetchedList = (data.data.files || []) as DriveFile[];
          if (isAppend) {
            setFiles((prev) => [...prev, ...fetchedList]);
          } else {
            setFiles(fetchedList);
          }
          setNextPageToken(data.data.nextPageToken);
        }
      } catch (err: any) {
        console.error('Fetch Drive error:', err);
        setErrorMessage(err.message || 'Failed to load drive files.');
        addToast({
          type: 'error',
          title: 'Drive Fetch Error',
          description: err.message || 'Could not load files from Google Drive.',
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user, addToast, getIdToken]
  );

  useEffect(() => {
    let isCancelled = false;
    if (isOpen && user) {
      void Promise.resolve().then(() => {
        if (!isCancelled) {
          fetchFiles(searchQuery);
        }
      });
    }
    return () => {
      isCancelled = true;
    };
  }, [isOpen, user, fetchFiles, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchFiles('');
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') return <Folder className="h-5 w-5 text-amber-500" />;
    if (mimeType.includes('pdf')) return <FileText className="h-5 w-5 text-rose-500" />;
    if (mimeType.includes('image')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (mimeType.includes('video')) return <Film className="h-5 w-5 text-purple-500" />;
    if (mimeType.includes('audio')) return <Music className="h-5 w-5 text-emerald-500" />;
    if (mimeType.includes('spreadsheet')) return <FileText className="h-5 w-5 text-emerald-600" />;
    if (mimeType.includes('presentation')) return <FileText className="h-5 w-5 text-orange-500" />;
    if (mimeType.includes('document')) return <FileText className="h-5 w-5 text-blue-600" />;
    return <File className="h-5 w-5 text-slate-400" />;
  };

  const formatSize = (bytes?: string) => {
    if (!bytes) return '---';
    const b = parseInt(bytes, 10);
    if (isNaN(b)) return '---';
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
    return `${(b / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google Drive Explorer"
      description="Browse and manage your cloud files securely"
      maxWidth="3xl"
      footer={
        <div className="flex items-center justify-between w-full text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Encrypted Read-Only Access</span>
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
        {/* STATUS BANNER */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 to-orange-50/60 border border-amber-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-amber-200/80 shadow-2xs text-amber-600">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {accountEmail || 'Connected Google Drive'}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Browsing root directory and recent files
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchFiles(searchQuery)}
            disabled={loading}
            leftIcon={<RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin text-amber-600')} />}
            className="bg-white hover:bg-slate-50 border-amber-200 text-slate-700 text-xs font-semibold h-8 rounded-xl shrink-0"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* SEARCH & FILTERS */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by name..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* FILES LIST */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
          {loading && files.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <RefreshCw className="h-6 w-6 animate-spin text-amber-600 mx-auto" />
              <p className="text-xs font-medium text-slate-500">Accessing Google Drive storage...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <Folder className="h-8 w-8 text-slate-300 mx-auto" />
              <h4 className="text-xs font-bold text-slate-800">No files found</h4>
              <p className="text-[11px] text-slate-500">Try adjusting your search or check your connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 divide-y divide-slate-50">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-3.5 flex items-center gap-4 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="shrink-0">
                    {file.thumbnailLink ? (
                      <img src={file.thumbnailLink} alt="" className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        {getFileIcon(file.mimeType)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{file.name}</span>
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(file.modifiedTime)}
                      </span>
                      <span>{formatSize(file.size)}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => window.open(file.webViewLink, '_blank')}
                      title="View in Google Drive"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOAD MORE */}
        {nextPageToken && (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchFiles(searchQuery, nextPageToken, true)}
              disabled={loadingMore}
              className="text-xs font-semibold"
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
