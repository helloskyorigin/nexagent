'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MemoryHeader } from './MemoryHeader';
import { MemoryFilters, FilterOption } from './MemoryFilters';
import { MemoryRow } from './MemoryRow';
import { MemoryEmptyState } from './MemoryEmptyState';
import { AddMemoryModal } from './AddMemoryModal';
import { EditMemoryModal } from './EditMemoryModal';
import { DeleteMemoryModal } from './DeleteMemoryModal';
import { AddMemoryCard } from './AddMemoryCard';
import {
  MemoryRecord,
  subscribeToMemories,
} from '../../services/memory/memoryService';
import { useToast } from '../ui/Toast';

export const MemoryView: React.FC = () => {
  const { addToast } = useToast();

  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryRecord | null>(null);
  const [deletingMemory, setDeletingMemory] = useState<MemoryRecord | null>(null);

  // Subscribe to real persistent memories
  useEffect(() => {
    const unsubscribe = subscribeToMemories((updatedMemories) => {
      setMemories(updatedMemories);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filter memories by category and search query
  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      // Category filter
      if (activeFilter !== 'All' && mem.category !== activeFilter) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const titleMatch = mem.title?.toLowerCase().includes(query);
        const contentMatch = mem.content?.toLowerCase().includes(query);
        const categoryMatch = mem.category?.toLowerCase().includes(query);
        return titleMatch || contentMatch || categoryMatch;
      }

      return true;
    });
  }, [memories, activeFilter, searchTerm]);

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <MemoryHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddMemory={() => setIsAddModalOpen(true)}
        />

        {/* Filters */}
        <div className="pt-1">
          <MemoryFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Content Area */}
        <div className="space-y-3 pt-2">
          {memories.length === 0 ? (
            /* Empty State: Zero memories */
            <MemoryEmptyState
              onAddMemory={() => setIsAddModalOpen(true)}
              isFiltered={false}
            />
          ) : filteredMemories.length === 0 ? (
            /* Empty State: Filter matched nothing */
            <div className="text-center py-14 px-4 rounded-2xl border border-dashed border-white/[0.08] bg-[#0e1017]/30">
              <p className="text-sm font-medium text-slate-300">
                {searchTerm
                  ? `No memories matching "${searchTerm}"`
                  : `No memories in ${activeFilter}`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for something else or clear the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('All');
                }}
                className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            /* Vertical List of Real Memories */
            <div className="space-y-3">
              {filteredMemories.map((mem) => (
                <MemoryRow
                  key={mem.id}
                  memory={mem}
                  onEdit={(item) => setEditingMemory(item)}
                  onDelete={(item) => setDeletingMemory(item)}
                />
              ))}

              {/* Bottom Card to Add Memory */}
              <div className="pt-2">
                <AddMemoryCard onClick={() => setIsAddModalOpen(true)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultCategory={activeFilter !== 'All' ? activeFilter : 'Preferences'}
        onSuccess={() => {
          addToast({
            title: 'Memory Saved',
            description: 'Nexorbit will remember this detail.',
            type: 'success',
          });
        }}
      />

      {/* Edit Memory Modal */}
      <EditMemoryModal
        isOpen={!!editingMemory}
        memory={editingMemory}
        onClose={() => setEditingMemory(null)}
        onSuccess={() => {
          addToast({
            title: 'Memory Updated',
            description: 'Memory has been successfully updated.',
            type: 'success',
          });
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteMemoryModal
        isOpen={!!deletingMemory}
        memory={deletingMemory}
        onClose={() => setDeletingMemory(null)}
        onSuccess={() => {
          addToast({
            title: 'Memory Deleted',
            description: 'Memory has been removed from Nexorbit.',
            type: 'info',
          });
        }}
      />
    </div>
  );
};
