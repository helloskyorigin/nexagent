'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LibraryHeader } from './LibraryHeader';
import { LibrarySummaryCards } from './LibrarySummaryCards';
import { LibraryCategoryTabs, CategoryTab, SortOption } from './LibraryCategoryTabs';
import { LibraryItemRow } from './LibraryItemRow';
import { LibraryEmptyState } from './LibraryEmptyState';
import { LibraryStorageCard } from './LibraryStorageCard';
import { UploadFileModal } from './UploadFileModal';
import { SaveLinkModal } from './SaveLinkModal';
import { AddNoteModal } from './AddNoteModal';
import { AddCodeModal } from './AddCodeModal';
import { ViewItemModal } from './ViewItemModal';
import { RenameItemModal } from './RenameItemModal';
import { DeleteItemModal } from './DeleteItemModal';
import {
  LibraryItem,
  subscribeToLibrary,
  calculateLibraryStorage,
  calculateCategoryCounts,
} from '../../services/library/libraryService';
import { useToast } from '../ui/Toast';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LibraryViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigate, className }) => {
  const { addToast } = useToast();

  // Primary Data State
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>('Recent');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSaveLinkModalOpen, setIsSaveLinkModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false);

  const [viewingItem, setViewingItem] = useState<LibraryItem | null>(null);
  const [renamingItem, setRenamingItem] = useState<LibraryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<LibraryItem | null>(null);

  // Subscribe to unified real library storage
  useEffect(() => {
    try {
      const unsubscribe = subscribeToLibrary((fetchedItems) => {
        setItems(fetchedItems);
        setIsLoading(false);
        setHasError(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to library:', err);
      queueMicrotask(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
  }, []);

  // Calculated Metrics (100% Real Data)
  const counts = useMemo(() => calculateCategoryCounts(items), [items]);
  const storage = useMemo(() => calculateLibraryStorage(items), [items]);

  // Filter and Sort Items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by Tab
    if (activeTab === 'Documents') {
      result = result.filter((i) => i.type === 'document');
    } else if (activeTab === 'Bookmarks') {
      result = result.filter((i) => i.type === 'bookmark');
    } else if (activeTab === 'Images') {
      result = result.filter((i) => i.type === 'image');
    } else if (activeTab === 'Code') {
      result = result.filter((i) => i.type === 'code');
    } else if (activeTab === 'Recent') {
      // Recent tab shows the most recent 10 items
      result = result.slice(0, 10);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((i) => {
        const titleMatch = i.title?.toLowerCase().includes(q);
        const urlMatch = i.url?.toLowerCase().includes(q);
        const typeMatch = i.type?.toLowerCase().includes(q) || i.fileType?.toLowerCase().includes(q);
        const contentMatch = i.content?.toLowerCase().includes(q);
        const fileMatch = i.fileName?.toLowerCase().includes(q);
        return titleMatch || urlMatch || typeMatch || contentMatch || fileMatch;
      });
    }

    // Apply Sorting
    result.sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortOption === 'size-desc') {
        return (b.fileSize || 0) - (a.fileSize || 0);
      }
      return 0;
    });

    return result;
  }, [items, activeTab, searchQuery, sortOption]);

  // Handle category card click from top summary
  const handleSelectSummaryCategory = (cat: string) => {
    if (cat === 'All') {
      setActiveTab('All');
    } else {
      setActiveTab(cat as CategoryTab);
    }
  };

  return (
    <div className={cn('w-full min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col items-center', className)}>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <LibraryHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadFile={() => setIsUploadModalOpen(true)}
          onSaveLink={() => setIsSaveLinkModalOpen(true)}
          onAddNote={() => setIsAddNoteModalOpen(true)}
          onAddCode={() => setIsAddCodeModalOpen(true)}
        />

        {/* Top Summary Cards (Always Real Counts) */}
        <LibrarySummaryCards
          counts={counts}
          activeCategory={activeTab}
          onSelectCategory={handleSelectSummaryCategory}
        />

        {/* Category Tabs & Filter Bar */}
        <div className="pt-2">
          <LibraryCategoryTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </div>

        {/* Content Layout: Main List & Right Storage Panel */}
        <div className="pt-1">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="space-y-3 py-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-[#11131c]/60 border border-white/[0.06] animate-pulse flex items-center p-4 gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/[0.08] rounded-md w-1/3" />
                    <div className="h-3 bg-white/[0.04] rounded-md w-1/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasError ? (
            /* Error State */
            <div className="text-center py-16 px-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle className="mx-auto h-8 w-8 text-rose-400 mb-3" />
              <h3 className="text-base font-semibold text-white">Library could not be loaded</h3>
              <p className="text-sm text-slate-400 mt-1 mb-4">Please try refreshing your library.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.08] hover:bg-white/[0.14] text-white transition-colors"
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State: Zero Items in Library */
            <LibraryEmptyState
              onAddClick={() => setIsUploadModalOpen(true)}
              onUploadFile={() => setIsUploadModalOpen(true)}
              onSaveLink={() => setIsSaveLinkModalOpen(true)}
              isFiltered={false}
            />
          ) : (
            /* Main Content Grid: Items List + Right Sidebar */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Items List (Left/Main Column) */}
              <div className="lg:col-span-8 space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-14 px-4 rounded-2xl border border-dashed border-white/[0.08] bg-[#0e1017]/30">
                    <p className="text-sm font-medium text-slate-300">
                      {searchQuery
                        ? `No items matching "${searchQuery}"`
                        : `No items in ${activeTab}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search query or switch tabs.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveTab('All');
                      }}
                      className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 transition-colors"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredItems.map((item) => (
                      <LibraryItemRow
                        key={item.id}
                        item={item}
                        onOpen={(selected) => setViewingItem(selected)}
                        onRename={(selected) => setRenamingItem(selected)}
                        onDelete={(selected) => setDeletingItem(selected)}
                      />
                    ))}

                    {/* View All / Switch to All helper if on Recent */}
                    {activeTab === 'Recent' && items.length > 10 && (
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('All')}
                          className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View All Library Items →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Real Storage Card */}
              <div className="lg:col-span-4 space-y-4">
                <LibraryStorageCard
                  storage={storage}
                  onManageClick={() => setIsUploadModalOpen(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Creation Modals */}
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          addToast({
            title: 'File Uploaded',
            description: 'Item has been added to your library.',
            type: 'success',
          });
        }}
      />

      <SaveLinkModal
        isOpen={isSaveLinkModalOpen}
        onClose={() => setIsSaveLinkModalOpen(false)}
        onSuccess={() => {
          addToast({
            title: 'Link Saved',
            description: 'Bookmark added to your library.',
            type: 'success',
          });
        }}
      />

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSuccess={() => {
          addToast({
            title: 'Note Saved',
            description: 'Document added to your library.',
            type: 'success',
          });
        }}
      />

      <AddCodeModal
        isOpen={isAddCodeModalOpen}
        onClose={() => setIsAddCodeModalOpen(false)}
        onSuccess={() => {
          addToast({
            title: 'Code Saved',
            description: 'Code snippet added to your library.',
            type: 'success',
          });
        }}
      />

      {/* View Item Modal */}
      <ViewItemModal
        isOpen={!!viewingItem}
        item={viewingItem}
        onClose={() => setViewingItem(null)}
        onEdit={(item) => {
          setViewingItem(null);
          setRenamingItem(item);
        }}
        onDelete={(item) => {
          setViewingItem(null);
          setDeletingItem(item);
        }}
      />

      {/* Rename / Edit Modal */}
      <RenameItemModal
        isOpen={!!renamingItem}
        item={renamingItem}
        onClose={() => setRenamingItem(null)}
        onSuccess={() => {
          addToast({
            title: 'Item Updated',
            description: 'Changes saved successfully.',
            type: 'success',
          });
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteItemModal
        isOpen={!!deletingItem}
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onSuccess={() => {
          addToast({
            title: 'Item Deleted',
            description: 'Removed from your library.',
            type: 'info',
          });
        }}
      />
    </div>
  );
};
