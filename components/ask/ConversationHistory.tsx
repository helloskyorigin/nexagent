'use client';

import React, { useState } from 'react';
import { MessageSquare, Clock, Edit2, Trash2, Check, X, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AskConversation } from './types';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/Toast';

export interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: AskConversation[];
  activeConversationId?: string;
  onSelectConversation: (convId: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (convId: string, newTitle: string) => void;
  onDeleteConversation: (convId: string) => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
}) => {
  const { addToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (conv: AskConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(convId, editTitle.trim());
      addToast({
        type: 'success',
        title: 'Conversation Renamed',
        description: `Renamed to "${editTitle.trim()}"`,
      });
    }
    setEditingId(null);
  };

  const handleDelete = (convId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(convId);
    addToast({
      type: 'info',
      title: 'Conversation Deleted',
      description: `Removed "${title}" from history`,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conversation History"
      description="Saved Ask My World reasoning sessions"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onNewConversation();
              onClose();
            }}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Conversation
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-2 text-xs">
        {conversations.length === 0 ? (
          <p className="text-slate-400 py-6 text-center">No conversation history found.</p>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isEditing = editingId === conv.id;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  if (!isEditing) {
                    onSelectConversation(conv.id);
                    onClose();
                  }
                }}
                className={cn(
                  'p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group',
                  isActive
                    ? 'bg-indigo-50/80 border-indigo-200'
                    : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    )}
                  />

                  {isEditing ? (
                    <div className="flex items-center gap-1 min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-white border border-indigo-300 rounded px-2 py-0.5 text-xs text-slate-900 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleSaveRename(conv.id, e)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span
                        className={cn(
                          'font-semibold block truncate',
                          isActive ? 'text-indigo-900' : 'text-slate-900'
                        )}
                      >
                        {conv.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" />
                        {conv.updatedAt}
                      </span>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleStartRename(conv, e)}
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(conv.id, conv.title, e)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};
