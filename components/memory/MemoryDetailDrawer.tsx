'use client';

import React, { useState } from 'react';
import {
  X,
  Pin,
  Edit3,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  Link2,
  Users,
  Folder,
  Check,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { MemoryItem } from './types';
import { MemorySourceIcon } from './MemorySourceIcon';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface MemoryDetailDrawerProps {
  memory: MemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveEdit: (updated: MemoryItem) => void;
  onTogglePin: (memory: MemoryItem) => void;
  onRequestForget: (memory: MemoryItem) => void;
  onOpenSource: (memory: MemoryItem) => void;
  onSelectRelatedMemory?: (memoryId: string) => void;
}

export const MemoryDetailDrawer: React.FC<MemoryDetailDrawerProps> = ({
  memory,
  isOpen,
  onClose,
  onSaveEdit,
  onTogglePin,
  onRequestForget,
  onOpenSource,
  onSelectRelatedMemory,
}) => {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState(memory?.category || 'Projects');

  if (!isOpen || !memory) return null;

  const handleStartEdit = () => {
    setEditTitle(memory.title);
    setEditDescription(memory.description);
    setEditCategory(memory.category);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    const updated: MemoryItem = {
      ...memory,
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory,
      updatedAt: 'Just now',
    };
    onSaveEdit(updated);
    setIsEditing(false);
    addToast({
      title: 'Memory Updated',
      description: 'Your changes have been saved to Nexorbit memory.',
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden text-left animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Memory Details
              </span>
              {memory.isPinned && (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  <Pin className="h-3 w-3 fill-indigo-600/20" />
                  Pinned
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onTogglePin(memory)}
                className="h-8 w-8 rounded-lg hover:bg-slate-200/70 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                title={memory.isPinned ? 'Unpin' : 'Pin'}
              >
                <Pin className={cn('h-4 w-4', memory.isPinned && 'fill-indigo-600 text-indigo-600')} />
              </button>

              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Badge */}
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Projects">Projects</option>
                    <option value="People">People</option>
                    <option value="Preferences">Preferences</option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Decisions">Decisions</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-500 text-xs h-8 px-4 rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="text-xs h-8 px-3 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MemorySourceIcon
                    type={memory.source.type}
                    name={memory.source.name}
                    className="h-10 w-10 text-sm shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {memory.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                        {memory.tag || memory.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {memory.timestamp} • {memory.dateGroup}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full Description Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {memory.description}
                </div>
              </div>
            )}

            {/* Source & Provenance Metadata */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                Synaptic Source
              </span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MemorySourceIcon
                      type={memory.source.type}
                      name={memory.source.name}
                      className="h-6 w-6 text-[10px]"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {memory.source.name}
                    </span>
                  </div>
                  {memory.source.url && (
                    <button
                      onClick={() => onOpenSource(memory)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      <span>Open Source</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
                {memory.source.detail && (
                  <p className="text-xs text-slate-500 font-mono">
                    {memory.source.detail}
                  </p>
                )}
                {memory.source.email && (
                  <div className="text-xs text-slate-600 font-medium">
                    Participant: <span className="font-semibold text-slate-800">{memory.source.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Context Entities (People & Project) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Related Person */}
              {memory.relatedPerson && (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                    Connected Person
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-800">
                      {memory.relatedPerson}
                    </span>
                  </div>
                  {memory.relatedPersonRole && (
                    <span className="text-[10.5px] text-slate-400 block">
                      {memory.relatedPersonRole}
                    </span>
                  )}
                </div>
              )}

              {/* Related Project */}
              {memory.relatedProject && (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">
                    Connected Goal / Project
                  </span>
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold text-slate-800">
                      {memory.relatedProject}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-emerald-600 font-medium block">
                    Active workspace tracking
                  </span>
                </div>
              )}
            </div>

            {/* Related Synaptic Memories */}
            {memory.relatedMemories && memory.relatedMemories.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Link2 className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Related Synapses</span>
                </div>
                <div className="space-y-2">
                  {memory.relatedMemories.map((rm) => (
                    <div
                      key={rm.id}
                      onClick={() => onSelectRelatedMemory?.(rm.id)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {rm.title}
                        </div>
                        <div className="text-[10.5px] text-slate-400">
                          {rm.source} • {rm.time}
                        </div>
                      </div>
                      <span className="text-[10.5px] text-indigo-600 font-bold shrink-0">
                        Inspect →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <button
              onClick={() => onRequestForget(memory)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Forget this memory</span>
            </button>

            {!isEditing && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartEdit}
                leftIcon={<Edit3 className="h-3.5 w-3.5 text-slate-600" />}
                className="text-xs h-9 px-4 rounded-xl cursor-pointer"
              >
                Edit Memory
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
