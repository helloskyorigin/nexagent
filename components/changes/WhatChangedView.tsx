'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Filter, 
  Check, 
  Search, 
  RotateCcw,
  ChevronDown,
  X
} from 'lucide-react';
import { 
  ChangeFeedItem, 
  CategoryFilter, 
  ConnectorSourceId
} from './types';
import { 
  INITIAL_CHANGE_ITEMS 
} from './mockData';
import { CategoryFilterTabs } from './CategoryFilterTabs';
import { ChangeRow } from './ChangeRow';
import { ChangeDetailDrawer } from './ChangeDetailDrawer';
import { FilterPopover, FilterState } from './FilterPopover';
import { DateSelectorPopover } from './DateSelectorPopover';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import {
  subscribeToChanges,
  dismissChange,
  updateChangeReadState,
  markAllChangesAsRead,
  addChangeSignal,
} from '../../services/firestore/changes';

export interface WhatChangedViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const WhatChangedView: React.FC<WhatChangedViewProps> = ({
  onNavigate,
  className,
}) => {
  const { user } = useAuth();

  // Main Data States
  const [items, setItems] = useState<ChangeFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('Today');
  const [showMoreLoaded, setShowMoreLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal / Popover / Drawer States
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [activeDrawerItem, setActiveDrawerItem] = useState<ChangeFeedItem | null>(null);
  const [popoverFilters, setPopoverFilters] = useState<FilterState>({
    importance: 'all',
    unreadOnly: false,
    source: 'all',
  });

  // Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Subscribe to real Firestore updates
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToChanges(
      user.uid,
      (fetchedItems) => {
        const mapped = fetchedItems.map((item) => ({
          ...item,
          id: item.id || '',
        })) as ChangeFeedItem[];
        setItems(mapped);
        setLoading(false);
      },
      (err) => {
        console.error('Error in subscribeToChanges:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Seed demo signals inside Firestore
  const handleSeedDemoSignals = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      for (const item of INITIAL_CHANGE_ITEMS) {
        const { id, ...cleanItem } = item;
        await addChangeSignal(user.uid, cleanItem as any);
      }
      triggerToast('Workspace signals successfully seeded to Firestore!');
    } catch (err) {
      console.error('Error seeding workspace signals:', err);
      triggerToast('Seeding failed.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle single item read state
  const handleToggleRead = async (id: string) => {
    try {
      await updateChangeReadState(id, true);
    } catch (err) {
      console.error('Error updating read state:', err);
    }
  };

  // Dismiss a change signal
  const handleDismiss = async (id: string) => {
    try {
      await dismissChange(id);
      triggerToast('Change signal dismissed');
    } catch (err) {
      console.error('Error dismissing change:', err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user?.uid) return;
    try {
      await markAllChangesAsRead(user.uid);
      triggerToast('All changes marked as read');
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Handle Ask Nexorbit
  const handleAskNexorbit = (item: ChangeFeedItem) => {
    if (onNavigate) {
      sessionStorage.setItem('pending_ask_command', `Explain why this changed: ${item.title}`);
      onNavigate('chat');
    }
  };

  // Filter Pipeline
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSub = item.contextSubtitle.toLowerCase().includes(q);
        const matchesSource = item.sourceName.toLowerCase().includes(q);
        const matchesWhat = item.whatChanged.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSub && !matchesSource && !matchesWhat) {
          return false;
        }
      }

      // 2. Category Tab Filter
      if (activeCategory !== 'all') {
        if (item.category !== activeCategory) {
          return false;
        }
      }

      // 3. Popover Filter: Importance
      if (popoverFilters.importance !== 'all') {
        if (item.importance !== popoverFilters.importance) {
          return false;
        }
      }

      // 4. Popover Filter: Unread Only
      if (popoverFilters.unreadOnly && item.isRead) {
        return false;
      }

      // 5. Popover Filter: Source
      if (popoverFilters.source !== 'all') {
        if (item.sourceId !== popoverFilters.source) {
          return false;
        }
      }

      // 6. Load More filter (hide 'Earlier' section until Load More is clicked)
      if (!showMoreLoaded && item.timeSection === 'Earlier') {
        return false;
      }

      return true;
    });
  }, [
    items,
    searchQuery,
    activeCategory,
    popoverFilters,
    showMoreLoaded,
  ]);

  // Section Grouping strictly by: Today, Yesterday, Earlier
  const sections = useMemo(() => {
    const availableSections: ('Today' | 'Yesterday' | 'Earlier')[] = [
      'Today',
      'Yesterday',
      'Earlier',
    ];
    return availableSections
      .map((sec) => ({
        section: sec,
        items: filteredItems.filter((i) => i.timeSection === sec),
      }))
      .filter((grp) => grp.items.length > 0);
  }, [filteredItems]);

  return (
    <div
      className={cn(
        "relative min-h-screen font-sans bg-slate-50/50 pb-28",
        className
      )}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              What Changed
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Important updates across your connected world.
            </p>
          </div>

          {/* Right Header Controls: Search, Filter, Mark all as read */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative w-48 sm:w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search changes..."
                className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              id="open-filters-btn"
              onClick={() => setIsFilterPopoverOpen(true)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs border",
                popoverFilters.importance !== 'all' || popoverFilters.unreadOnly || popoverFilters.source !== 'all'
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
              )}
            >
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <span>Filter</span>
              {(popoverFilters.importance !== 'all' || popoverFilters.unreadOnly || popoverFilters.source !== 'all') && (
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              )}
            </button>

            {/* Mark all as read */}
            <button
              id="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer select-none"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Mark all as read</span>
            </button>
          </div>
        </div>

        {/* COMPACT FILTER TABS (All, Messages, Calendar, Files) */}
        <div className="mb-6">
          <CategoryFilterTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* MAIN FEED */}
        <div className="space-y-8">
          {sections.length === 0 ? (
            /* CLEAN MINIMAL EMPTY STATE */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-2xs space-y-4 flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Your workspace is perfectly in sync.</h3>
                <p className="text-xs text-slate-500">No new notifications or changes found.</p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleSeedDemoSignals}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Seed Demo Signals</span>
                </button>

                {(activeCategory !== 'all' || searchQuery || popoverFilters.unreadOnly) && (
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                      setPopoverFilters({
                        importance: 'all',
                        unreadOnly: false,
                        source: 'all',
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* FEED SECTIONS GROUPED BY TODAY, YESTERDAY, EARLIER */
            <div className="space-y-8">
              {sections.map(({ section, items: sectionItems }) => (
                <div key={section} className="space-y-3">
                  {/* Section Header */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {section}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-200/70" />
                  </div>

                  {/* Section Change Cards */}
                  <div className="space-y-3">
                    {sectionItems.map((item) => (
                      <ChangeRow
                        key={item.id}
                        item={item}
                        onOpenDetailDrawer={setActiveDrawerItem}
                        onAskNexorbit={handleAskNexorbit}
                        onToggleRead={handleToggleRead}
                        onDismiss={handleDismiss}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* LOAD MORE BUTTON */}
              {!showMoreLoaded && (
                <div className="pt-2 text-center">
                  <button
                    id="load-more-btn"
                    onClick={() => {
                      setShowMoreLoaded(true);
                      triggerToast('Loaded earlier change signals');
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white hover:bg-slate-50 text-indigo-600 font-semibold text-xs border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <span>Load earlier changes</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CHANGE DETAIL DRAWER */}
      <ChangeDetailDrawer
        item={activeDrawerItem}
        isOpen={Boolean(activeDrawerItem)}
        onClose={() => setActiveDrawerItem(null)}
        onAskNexorbit={handleAskNexorbit}
      />

      {/* FILTER POPOVER */}
      <FilterPopover
        isOpen={isFilterPopoverOpen}
        onClose={() => setIsFilterPopoverOpen(false)}
        filters={popoverFilters}
        onApplyFilters={(newFilters) => {
          setPopoverFilters(newFilters);
          triggerToast('Filters updated');
        }}
        onResetFilters={() => {
          setPopoverFilters({
            importance: 'all',
            unreadOnly: false,
            source: 'all',
          });
          triggerToast('Filters reset');
        }}
      />

      {/* DATE SELECTOR POPOVER */}
      <DateSelectorPopover
        isOpen={isDatePopoverOpen}
        onClose={() => setIsDatePopoverOpen(false)}
        selectedRange={selectedDateRange}
        onSelectRange={(range) => {
          setSelectedDateRange(range);
          triggerToast(`Date range set to ${range}`);
        }}
      />
    </div>
  );
};
