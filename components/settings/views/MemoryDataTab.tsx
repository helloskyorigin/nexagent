'use client';

import React, { useState, useEffect } from 'react';
import { Database, HardDrive, Trash2, Loader2, X } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../auth/AuthContext';
import { getStoredSettings, updateSettings } from '../../../services/settings/settingsService';
import { getMemories, deleteMemory, clearAllMemories, MemoryRecord, formatMemoryDate } from '../../../services/memory/memoryService';

export interface MemoryDataTabProps {
  onNavigateMemory?: () => void;
  className?: string;
}

export const MemoryDataTab: React.FC<MemoryDataTabProps> = ({
  onNavigateMemory,
  className,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [settings, setSettings] = useState(getStoredSettings());
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMemories = async () => {
      const uid = user?.uid;
      if (!uid) return;
      
      setIsLoading(true);
      try {
        const data = await getMemories(uid);
        if (isMounted) {
          setMemories(data);
        }
      } catch (err) {
        console.error('Failed to load memories:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMemories();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleToggle = () => {
    const nextVal = !settings.memoryEnabled;
    const updated = updateSettings({ memoryEnabled: nextVal });
    setSettings(updated);
    addToast({
      type: 'info',
      title: 'Memory Setting Updated',
      description: nextVal
        ? 'Nexorbit will personalize answers using saved memories.'
        : 'Saved memories are temporarily paused for AI responses.',
    });
  };

  const handleDeleteMemory = async (id: string) => {
    if (!user?.uid) return;
    try {
      await deleteMemory(id, user.uid);
      setMemories(prev => prev.filter(m => m.id !== id));
      addToast({
        type: 'success',
        title: 'Memory Deleted',
        description: 'The selected memory has been removed.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete memory.',
      });
    }
  };

  const handleClearAll = async () => {
    if (!user?.uid || !window.confirm('Are you sure you want to clear ALL memories? This cannot be undone.')) return;
    setIsClearing(true);
    try {
      await clearAllMemories(user.uid);
      setMemories([]);
      addToast({
        type: 'success',
        title: 'Memory Cleared',
        description: 'All saved memories have been removed.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Failed to clear memories.',
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Memory & Personalization
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Nexorbit learns from your preferences to provide more relevant answers.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        {/* Toggle: Memory ON/OFF */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span>Allow Nexorbit to use saved memories</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              When enabled, past preferences and context are used to personalize responses.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              settings.memoryEnabled ? 'bg-blue-600' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                settings.memoryEnabled ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Memory List Section */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">
              Saved Memories ({memories.length})
            </h4>
            {memories.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isClearing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                <span>Clear All</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
              <Database className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">No memories saved yet.</p>
              <p className="text-[10px] text-slate-400 mt-1">Nexorbit will automatically save useful details as you chat.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {memories.map((mem) => (
                <div 
                  key={mem.id}
                  className="group relative p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {mem.title}
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {mem.content}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium">
                        {formatMemoryDate(mem.createdAt)} • {mem.category}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Forget this memory"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Storage Info */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-slate-400" />
            <span>Memory Insights</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-normal">
            Memory helps Nexorbit understand your workflow, coding standards, and preferred output styles without repeating them.
          </p>
        </div>
      </div>
    </div>
  );
};
